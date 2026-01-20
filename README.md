# 📊 Meta Ads Dashboard

Dashboard profesional para monitorear tus campañas de Meta Ads (Facebook/Instagram) en tiempo real.

![Dashboard Preview](https://img.shields.io/badge/Status-Ready_to_Deploy-success)
![Node](https://img.shields.io/badge/Node-%3E%3D18.0.0-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Características

- 📈 **KPIs en tiempo real**: Alcance, impresiones, CPC, inversión total
- 🎯 **Vista de anuncios**: Todos tus anuncios con métricas detalladas
- 🎨 **Diseño moderno**: Interfaz responsive y profesional
- 🔄 **Actualización automática**: Datos frescos de la API de Meta
- 🔒 **Seguro**: Variables de entorno para credenciales
- 📱 **Responsive**: Funciona en desktop, tablet y móvil

## 🚀 Demo

[Ver Demo en Vivo](https://tu-app.onrender.com) _(Próximamente)_

## 📋 Requisitos Previos

- Node.js >= 18.0.0
- Cuenta de Facebook Business
- Access Token de Meta API
- Ad Account ID de Meta

## 🔧 Instalación Local

1. **Clona el repositorio:**
   ```bash
   git clone https://github.com/tu-usuario/meta-ads-dashboard.git
   cd meta-ads-dashboard
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura variables de entorno:**
   
   Crea un archivo `.env` en la raíz del proyecto:
   ```env
   META_ACCESS_TOKEN=tu_token_aqui
   META_AD_ACCOUNT_ID=123456789
   ```

4. **Inicia el servidor:**
   ```bash
   npm start
   ```

5. **Abre en el navegador:**
   ```
   http://localhost:3001
   ```

## 🌐 Deploy en Render

Sigue la [Guía de Deploy](./GUIA_DEPLOY_RENDER.md) para instrucciones detalladas.

**Resumen rápido:**

1. Sube tu código a GitHub
2. Crea un Web Service en Render
3. Configura las variables de entorno:
   - `META_ACCESS_TOKEN`
   - `META_AD_ACCOUNT_ID`
4. ¡Deploy automático!

## 🔑 Obtener Credenciales de Meta

### Access Token

1. Ve a [Meta Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Selecciona tu aplicación
3. Agrega permisos: `ads_read`, `ads_management`
4. Genera el token
5. Para token de larga duración, usa el [Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/)

### Ad Account ID

1. Ve a [Meta Business Suite](https://business.facebook.com)
2. Configuración → Cuentas → Cuentas de anuncios
3. Copia el ID (solo números, SIN "act_")

## 📁 Estructura del Proyecto

```
meta-ads-dashboard/
├── server.js              # Backend Express
├── package.json           # Dependencias
├── .env.example           # Ejemplo de variables
├── .gitignore            # Archivos ignorados
├── MetaAdsDashboard.jsx  # Componente React
├── GUIA_DEPLOY_RENDER.md # Guía de deploy
└── README.md             # Este archivo
```

## 🛠️ Tecnologías

- **Backend:** Node.js + Express
- **Frontend:** React (JSX)
- **API:** Meta Graph API
- **Hosting:** Render (recomendado)
- **Styling:** Inline CSS con gradientes modernos

## 📊 API Endpoints

### `GET /api/meta-ads`
Obtiene todos los anuncios con sus métricas.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "ad_name": "Nombre del anuncio",
      "effective_status": "ACTIVE",
      "image_url": "https://...",
      "reach": 1000,
      "impressions": 5000,
      "clicks": 100,
      "spend": 50.00,
      "cpc": 0.50,
      "ctr": 2.00
    }
  ],
  "total": 1
}
```

### `GET /api/health`
Verifica el estado del servidor.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2026-01-20T12:00:00.000Z",
  "env_configured": true
}
```

## 🔒 Seguridad

- ✅ Variables de entorno para credenciales
- ✅ `.gitignore` configurado
- ✅ CORS habilitado
- ✅ Sin credenciales en el código fuente
- ✅ Tokens de acceso seguros

## 🐛 Solución de Problemas

### Error: "Credenciales no configuradas"
- Verifica que las variables de entorno estén configuradas
- Revisa que los nombres sean exactos: `META_ACCESS_TOKEN` y `META_AD_ACCOUNT_ID`

### Error 400 de Meta API
- Token inválido o expirado → Genera uno nuevo
- Account ID incorrecto → Verifica que sea solo números
- Permisos insuficientes → Agrega `ads_read` y `ads_management`

### No se muestran anuncios
- Verifica que tengas campañas activas
- Revisa los logs del servidor
- Comprueba que el Account ID sea correcto

## 📝 Variables de Entorno

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `META_ACCESS_TOKEN` | Token de acceso de Meta API | `EAABwzLixnjY...` |
| `META_AD_ACCOUNT_ID` | ID de cuenta de anuncios (sin "act_") | `123456789` |
| `PORT` | Puerto del servidor (opcional) | `3001` |

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Tu Nombre - [@tu_twitter](https://twitter.com/tu_twitter)

## 🙏 Agradecimientos

- [Meta Marketing API](https://developers.facebook.com/docs/marketing-apis)
- [Render](https://render.com) por el hosting gratuito
- Comunidad de desarrolladores

---

⭐ Si este proyecto te fue útil, considera darle una estrella en GitHub!
