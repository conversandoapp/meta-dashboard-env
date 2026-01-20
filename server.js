const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static('public'));

// Ruta principal - servir index.html
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Endpoint para obtener datos de Meta Ads
app.get('/api/meta-ads', async (req, res) => {
  try {
    // Obtener credenciales de variables de entorno
    const accessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    if (!accessToken || !adAccountId) {
      return res.status(400).json({
        error: 'Credenciales no configuradas',
        message: 'Por favor configura META_ACCESS_TOKEN y META_AD_ACCOUNT_ID en las variables de entorno'
      });
    }

    // Configurar rango de fechas - últimos 36 meses (3 años)
    const today = new Date();
    const thirtyMonthsAgo = new Date();
    thirtyMonthsAgo.setMonth(today.getMonth() - 36);
    
    // Formatear fechas en YYYY-MM-DD
    const sinceDate = thirtyMonthsAgo.toISOString().split('T')[0];
    const untilDate = today.toISOString().split('T')[0];
    
    console.log('📅 Rango de fechas configurado:');
    console.log('   Desde:', sinceDate);
    console.log('   Hasta:', untilDate);
    
    // Campos a solicitar de la API
    // Usamos time_range para especificar el rango exacto de fechas
    const fields = `name,effective_status,status,adcreatives{image_url,title,body},insights.time_range({'since':'${sinceDate}','until':'${untilDate}'}){reach,impressions,clicks,spend,cpc,ctr,frequency,cost_per_unique_click}`;
    
    const apiUrl = `https://graph.facebook.com/v18.0/act_${adAccountId}/ads?fields=${fields}&access_token=${accessToken}&limit=500`;

    console.log('🔍 Solicitando datos a Meta API...');
    console.log('📊 Período: Últimos 36 meses');
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      console.error('❌ Error de Meta API:', data.error);
      return res.status(400).json({
        error: data.error.message,
        type: data.error.type,
        code: data.error.code,
        message: 'Error al obtener datos de Meta. Verifica tu token y permisos.'
      });
    }

    console.log(`📊 Anuncios encontrados: ${data.data?.length || 0}`);

    // Procesar los datos
    const processedAds = (data.data || []).map(ad => {
      const insights = ad.insights?.data?.[0] || {};
      const creative = ad.adcreatives?.data?.[0] || {};

      // Debug: si no hay insights, mostrar en logs
      if (!ad.insights || !ad.insights.data || ad.insights.data.length === 0) {
        console.log(`⚠️ Anuncio sin insights: ${ad.name} (${ad.effective_status})`);
      }

      return {
        ad_name: ad.name || 'Sin nombre',
        effective_status: ad.effective_status,
        status: ad.status,
        image_url: creative.image_url || null,
        title: creative.title || null,
        body: creative.body || null,
        reach: insights.reach || 0,
        impressions: insights.impressions || 0,
        clicks: insights.clicks || 0,
        spend: insights.spend || 0,
        cpc: insights.cpc || 0,
        ctr: insights.ctr || 0,
        frequency: insights.frequency || 0,
        cost_per_unique_click: insights.cost_per_unique_click || 0
      };
    });

    // Estadísticas de insights
    const adsWithInsights = processedAds.filter(ad => ad.impressions > 0 || ad.spend > 0);
    const adsWithoutInsights = processedAds.filter(ad => ad.impressions === 0 && ad.spend === 0);

    console.log(`✅ Anuncios con datos: ${adsWithInsights.length}`);
    console.log(`⚠️ Anuncios sin datos: ${adsWithoutInsights.length}`);

    res.json({
      success: true,
      data: processedAds,
      total: processedAds.length,
      stats: {
        with_data: adsWithInsights.length,
        without_data: adsWithoutInsights.length,
        date_range: {
          since: sinceDate,
          until: untilDate,
          period: 'Últimos 36 meses'
        }
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener datos de Meta:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// Endpoint alternativo con rango de fechas personalizado
app.get('/api/meta-ads/custom-range', async (req, res) => {
  try {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const adAccountId = process.env.META_AD_ACCOUNT_ID;
    
    const { since, until } = req.query;

    if (!since || !until) {
      return res.status(400).json({
        error: 'Parámetros faltantes',
        message: 'Debes proporcionar "since" y "until" en formato YYYY-MM-DD'
      });
    }

    const fields = `name,effective_status,adcreatives{image_url},insights.time_range({'since':'${since}','until':'${until}'}){reach,impressions,clicks,spend,cpc,ctr}`;
    const apiUrl = `https://graph.facebook.com/v18.0/act_${adAccountId}/ads?fields=${fields}&access_token=${accessToken}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({
        error: data.error.message,
        type: data.error.type
      });
    }

    const processedAds = (data.data || []).map(ad => {
      const insights = ad.insights?.data?.[0] || {};
      const creative = ad.adcreatives?.data?.[0] || {};

      return {
        ad_name: ad.name || 'Sin nombre',
        effective_status: ad.effective_status,
        image_url: creative.image_url || null,
        reach: insights.reach || 0,
        impressions: insights.impressions || 0,
        clicks: insights.clicks || 0,
        spend: insights.spend || 0,
        cpc: insights.cpc || 0,
        ctr: insights.ctr || 0
      };
    });

    res.json({
      success: true,
      data: processedAds,
      total: processedAds.length,
      date_range: { since, until }
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    env_configured: !!(process.env.META_ACCESS_TOKEN && process.env.META_AD_ACCOUNT_ID)
  });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en puerto ${PORT}`);
  console.log(`🔑 META_ACCESS_TOKEN configurado: ${!!process.env.META_ACCESS_TOKEN}`);
  console.log(`🔑 META_AD_ACCOUNT_ID configurado: ${!!process.env.META_AD_ACCOUNT_ID}`);
  console.log(`📅 Rango de fechas: Últimos 36 meses (3 años)`);
});
