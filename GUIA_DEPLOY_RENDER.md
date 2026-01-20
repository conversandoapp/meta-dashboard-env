# 🚀 Guía de Deploy en Render - Meta Ads Dashboard

## 📋 Variables de Entorno Necesarias

Tu aplicación necesita estas dos variables de entorno:

### 1. **META_ACCESS_TOKEN**
- **Qué es:** Token de acceso de la API de Meta/Facebook
- **Cómo obtenerlo:**
  1. Ve a https://developers.facebook.com/tools/explorer/
  2. Selecciona tu aplicación de Facebook
  3. Agrega los permisos: `ads_read` y `ads_management`
  4. Haz clic en "Generate Access Token"
  5. Copia el token generado

### 2. **META_AD_ACCOUNT_ID**
- **Qué es:** ID de tu cuenta de anuncios (solo números, SIN el prefijo "act_")
- **Cómo obtenerlo:**
  1. Ve a https://business.facebook.com
  2. Ve a Configuración → Cuentas → Cuentas de anuncios
  3. Copia el ID que aparece (ejemplo: 123456789)
  4. **IMPORTANTE:** Usa solo los números, NO incluyas "act_"

---

## 🎯 Pasos para Deploy en Render

### **Paso 1: Preparar tu código**

Asegúrate de tener estos archivos en tu proyecto:

```
proyecto/
├── server.js          # Backend
├── package.json       # Dependencias
├── .gitignore         # Archivos a ignorar
├── .env.example       # Ejemplo de variables
└── public/            # Carpeta con tu React
    └── index.html
```

### **Paso 2: Subir a GitHub**

1. Crea un repositorio en GitHub
2. Sube tu código:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### **Paso 3: Crear Web Service en Render**

1. Ve a https://render.com y crea una cuenta
2. Haz clic en **"New +"** → **"Web Service"**
3. Conecta tu repositorio de GitHub
4. Configura el servicio:

**Build & Deploy:**
- **Name:** `meta-ads-dashboard` (o el nombre que prefieras)
- **Region:** Elige la más cercana a ti
- **Branch:** `main`
- **Root Directory:** (déjalo vacío si todo está en la raíz)
- **Runtime:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

**Plan:**
- Selecciona **"Free"** (gratis)

### **Paso 4: Configurar Variables de Entorno en Render**

**MUY IMPORTANTE:** Antes de hacer deploy, configura las variables:

1. En la página de tu servicio, ve a la sección **"Environment"**
2. Haz clic en **"Add Environment Variable"**
3. Agrega las siguientes variables:

| Key | Value |
|-----|-------|
| `META_ACCESS_TOKEN` | Tu token de Meta (EAABwzLixnjY...) |
| `META_AD_ACCOUNT_ID` | Tu Account ID (solo números) |

4. Haz clic en **"Save Changes"**

### **Paso 5: Deploy**

1. Haz clic en **"Create Web Service"**
2. Render automáticamente:
   - Clonará tu repositorio
   - Instalará las dependencias
   - Iniciará el servidor
3. Espera 2-5 minutos para que el deploy termine

### **Paso 6: Verificar**

1. Una vez completado, Render te dará una URL como:
   ```
   https://meta-ads-dashboard.onrender.com
   ```

2. Visita la URL y verifica que cargue correctamente

3. Para verificar que las variables están configuradas, visita:
   ```
   https://tu-app.onrender.com/api/health
   ```
   
   Deberías ver:
   ```json
   {
     "status": "OK",
     "timestamp": "2026-01-20T...",
     "env_configured": true
   }
   ```

---

## 🔧 Solución de Problemas Comunes

### ❌ Error: "Credenciales no configuradas"

**Causa:** Las variables de entorno no están configuradas en Render.

**Solución:**
1. Ve a tu servicio en Render
2. Environment → Add Environment Variable
3. Agrega `META_ACCESS_TOKEN` y `META_AD_ACCOUNT_ID`
4. Haz clic en "Manual Deploy" → "Deploy latest commit"

### ❌ Error 400 de Meta API

**Causa:** Token inválido o Account ID incorrecto.

**Solución:**
1. Verifica que el token no haya expirado
2. Genera un nuevo token de larga duración en Facebook
3. Asegúrate de que el Account ID sea solo números (sin "act_")

### ❌ Error: "Application error"

**Causa:** Error en el código o falta alguna dependencia.

**Solución:**
1. Ve a Render → Logs
2. Busca el error específico
3. Verifica que `package.json` tenga todas las dependencias

### ❌ Build falla

**Causa:** Problema en `npm install`

**Solución:**
1. Verifica que `package.json` esté bien formado
2. Asegúrate de que `engines.node` sea compatible (>= 18)

---

## 🔄 Actualizar la Aplicación

Cuando hagas cambios:

1. Sube los cambios a GitHub:
   ```bash
   git add .
   git commit -m "Descripción del cambio"
   git push
   ```

2. Render automáticamente detectará los cambios y hará redeploy

O puedes hacer deploy manual:
- Ve a tu servicio en Render
- Haz clic en "Manual Deploy" → "Deploy latest commit"

---

## 🔐 Seguridad

✅ **Buenas prácticas:**
- ✅ NUNCA subas el archivo `.env` a GitHub
- ✅ Usa `.gitignore` para excluir archivos sensibles
- ✅ Configura las variables de entorno en Render
- ✅ Genera tokens de larga duración en Facebook
- ✅ Revoca tokens si crees que fueron comprometidos

❌ **NO hagas esto:**
- ❌ NO pongas credenciales directamente en el código
- ❌ NO compartas tu token de acceso
- ❌ NO uses el mismo token para desarrollo y producción

---

## 📊 Verificación Final

Checklist antes de terminar:

- [ ] Código subido a GitHub
- [ ] Servicio creado en Render
- [ ] Variables de entorno configuradas
- [ ] Deploy completado exitosamente
- [ ] URL funciona correctamente
- [ ] `/api/health` muestra `env_configured: true`
- [ ] Dashboard muestra datos de Meta

---

## 🆘 Soporte

Si tienes problemas:

1. **Revisa los logs en Render:** Dashboard → Logs
2. **Verifica el endpoint de health:** `/api/health`
3. **Comprueba las variables:** Environment tab en Render

---

## 📝 Notas Importantes

- El plan **Free** de Render:
  - ✅ Es gratis
  - ⏱️ Se "duerme" después de 15 min de inactividad
  - 🐌 Primera carga puede tardar 30-60 segundos
  - 📊 750 horas gratis al mes
  
- Para mejor rendimiento, considera el plan **Starter ($7/mes)**

---

¡Listo! Tu dashboard de Meta Ads debería estar funcionando en Render. 🎉
