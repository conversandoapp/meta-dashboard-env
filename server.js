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

    // Construir la URL de la API de Meta
    const fields = 'name,effective_status,adcreatives{image_url},insights{reach,impressions,clicks,spend,cpc,ctr}';
    const apiUrl = `https://graph.facebook.com/v18.0/act_${adAccountId}/ads?fields=${fields}&access_token=${accessToken}`;

    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return res.status(400).json({
        error: data.error.message,
        type: data.error.type,
        code: data.error.code
      });
    }

    // Procesar los datos
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
      total: processedAds.length
    });

  } catch (error) {
    console.error('Error al obtener datos de Meta:', error);
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
});
