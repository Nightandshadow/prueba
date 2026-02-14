# E-commerce (Evaluaciones 2–5)

Proyecto web con **Node.js**, **Express**, **PostgreSQL**, **JWT**, **bcrypt** y **Stripe**, que cumple las evaluaciones de Login, Productos, Carrito y Pagos.

## Stack

- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL (pool con `pg`)
- **Autenticación:** JWT + bcrypt
- **Pagos:** Stripe (modo test)
- **Frontend:** HTML, CSS, JavaScript (Tailwind CSS, SweetAlert2, Animate.css, Lucide Icons)

## Estructura

```
├── app.js                 # Entrada
├── config/db.js           # Pool PostgreSQL
├── models/                # User, Product, Cart, Order
├── controllers/           # auth, product, cart, order, payment
├── routes/                # auth, products, cart, orders, payments
├── middlewares/           # verifyToken, isAdmin, errorHandler
├── validators/            # express-validator
├── public/                # HTML, CSS, JS estático
├── crear_tablas.sql       # Script de tablas
├── .env.example
└── package.json
```

## Ejecución local

1. **Requisitos:** Node.js 18+, PostgreSQL.

2. **Clonar e instalar:**
   ```bash
   cd ecommerce-eval
   npm install
   ```

3. **Base de datos:** Crear una base en PostgreSQL y ejecutar el script:
   ```bash
   psql -U postgres -d nombre_db -f crear_tablas.sql
   ```

4. **Variables de entorno:** Copiar `.env.example` a `.env` y completar:
   ```env
   PORT=3000
   DATABASE_URL=postgresql://usuario:password@localhost:5432/nombre_db
   JWT_SECRET=una_clave_secreta_larga_de_al_menos_32_caracteres
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   FRONTEND_URL=http://localhost:3000
   ```

5. **Iniciar:**
   ```bash
   npm start
   ```
   Abrir: http://localhost:3000

## Despliegue en Render (free tier)

1. **Cuenta:** [render.com](https://render.com), cuenta gratuita.

2. **PostgreSQL:**
   - Dashboard → New → PostgreSQL.
   - Crear base de datos.
   - Copiar **Internal Database URL** (o External si accedes desde fuera de Render).

3. **Web Service:**
   - New → Web Service.
   - Conectar el repo (o subir el código).
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Environment:**
     - `NODE_ENV` = `production`
     - `DATABASE_URL` = (pegando la URL de PostgreSQL de Render)
     - `JWT_SECRET` = (clave larga y segura)
     - `STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
     - `STRIPE_SECRET_KEY` = `sk_test_...`
     - `FRONTEND_URL` = `https://tu-servicio.onrender.com` (la URL que te asigne Render)

4. **Tablas:** La primera vez hay que crear las tablas. Opciones:
   - En Render, en la base PostgreSQL, abrir "Connect" y ejecutar el contenido de `crear_tablas.sql`, o
   - Conectar desde tu máquina con la **External Database URL** y ejecutar:
     ```bash
     psql "URL_EXTERNA" -f crear_tablas.sql
     ```

5. El servicio quedará en `https://tu-servicio.onrender.com`. El frontend se sirve desde Express (mismo origen).

## Evaluaciones cubiertas

- **Eval 2 – Login:** Registro (nombre, email, password, rol), login con JWT, bcrypt, validaciones (email único, mín. 6 caracteres).
- **Eval 3 – Productos:** Crear producto (solo admin), listar y ver por código (autenticado), validación precio > 0.
- **Eval 4 – Carrito:** Añadir, ver (items + total), vaciar; asociado al usuario.
- **Eval 5 – Pagos:** Botón Stripe Checkout (test), al confirmar: orden creada, carrito vaciado; historial de compras (órdenes con fecha, total, productos).

## Stripe (test)

- Claves en [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
- Tarjeta de prueba: `4242 4242 4242 4242`.
- Tras el pago en Checkout, el usuario vuelve a la tienda y se llama a `/api/payments/confirm` para crear la orden y vaciar el carrito.

## Licencia

MIT
