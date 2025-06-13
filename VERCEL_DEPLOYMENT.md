# Configurar Variables de Entorno en Vercel

## 🔧 Pasos para Configurar .env en Vercel

### **Paso 1: Acceder a la Configuración del Proyecto**
1. Ve a [vercel.com](https://vercel.com)
2. Inicia sesión con tu cuenta
3. Busca tu proyecto `nothing-landing`
4. Haz clic en el proyecto para entrar

### **Paso 2: Ir a Settings → Environment Variables**
1. Haz clic en **"Settings"** (en la barra superior)
2. En el menú lateral izquierdo, haz clic en **"Environment Variables"**

### **Paso 3: Agregar las Variables de Entorno**

#### **PayPal Variables:**
```
Name: NEXT_PUBLIC_PAYPAL_CLIENT_ID
Value: [tu_paypal_client_id_de_produccion]
Environment: Production, Preview, Development
```

```
Name: PAYPAL_CLIENT_SECRET
Value: [tu_paypal_client_secret_de_produccion]
Environment: Production, Preview, Development
```

```
Name: PAYPAL_ENVIRONMENT
Value: live
Environment: Production
```

```
Name: PAYPAL_ENVIRONMENT
Value: sandbox
Environment: Preview, Development
```

#### **Google Sheets Variables:**
```
Name: GOOGLE_SHEETS_PRIVATE_KEY
Value: "-----BEGIN PRIVATE KEY-----\n[tu_clave_privada]\n-----END PRIVATE KEY-----\n"
Environment: Production, Preview, Development
```

```
Name: GOOGLE_SHEETS_CLIENT_EMAIL
Value: [tu-service-account@tu-proyecto.iam.gserviceaccount.com]
Environment: Production, Preview, Development
```

```
Name: GOOGLE_SHEETS_SPREADSHEET_ID
Value: [tu_spreadsheet_id]
Environment: Production, Preview, Development
```

#### **Configuración del Producto:**
```
Name: NEXT_PUBLIC_PRODUCT_PRICE
Value: 9.99
Environment: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_SHIPPING_PRICE
Value: 3.00
Environment: Production, Preview, Development
```

```
Name: NEXT_PUBLIC_BASE_URL
Value: https://sendnothing.co
Environment: Production
```

### **Paso 4: Cómo Agregar Cada Variable**
1. Haz clic en **"Add New"**
2. Escribe el **Name** (nombre exacto de la variable)
3. Escribe el **Value** (valor de la variable)
4. Selecciona los **Environments** donde aplica
5. Haz clic en **"Save"**

### **Paso 5: Obtener los Valores Correctos**

#### **PayPal (Producción):**
1. Ve a [developer.paypal.com](https://developer.paypal.com)
2. En "My Apps & Credentials"
3. Cambia a **"Live"** (no Sandbox)
4. Crea una nueva app o usa una existente
5. Copia el **Client ID** y **Client Secret**

#### **Google Sheets:**
1. Abre tu archivo JSON: `iron-foundry-462823-t9-e8f44e28c436.json`
2. Copia el valor completo de `"private_key"` (incluyendo comillas)
3. Copia el valor de `"client_email"`
4. El Spreadsheet ID está en la URL de tu Google Sheet

### **Paso 6: Redesplegar**
1. Ve a la pestaña **"Deployments"**
2. Haz clic en **"..."** del último deployment
3. Selecciona **"Redeploy"**
4. Confirma el redespliegue

### **⚠️ Importante:**
- **PayPal Live**: Usa credenciales de producción, no sandbox
- **Private Key**: Mantén el formato exacto con `\n`
- **Base URL**: Usa tu dominio real `https://sendnothing.co`
- **No espacios**: No agregues espacios extra en los valores

### **🔍 Verificar Funcionamiento:**
1. Ve a `https://sendnothing.co`
2. Haz una compra de prueba
3. Verifica que aparezca en Google Sheets
4. Confirma que PayPal procese el pago

### **🆘 Si Hay Problemas:**
1. Revisa los logs en Vercel → Functions
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que PayPal esté en modo "Live"
4. Confirma que Google Sheet esté compartido con el service account
