/**
 * Script para probar el registro manualmente con la BD de Render.
 * Reemplaza DATABASE_URL con la External Database URL de Render.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function testRegister() {
  console.log('Probando registro con BD de Render...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'FALTA');
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('tu_')) {
    console.error('❌ DATABASE_URL no configurado o contiene placeholder. Edita tu .env con la External Database URL de Render.');
    process.exit(1);
  }
  try {
    // 1) Verificar si la tabla users existe y sus columnas
    const tableCheck = await pool.query('SELECT to_regclass(\'public.users\') AS users_table');
    console.log('Tabla users:', tableCheck.rows[0]);

    const cols = await pool.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='users'
      ORDER BY ordinal_position
    `);
    console.log('Columnas:', cols.rows);

    // 2) Intentar insertar un usuario de prueba
    const email = `test-${Date.now()}@example.com`;
    const nombre = 'Test User';
    const password = '123456';
    const rol = 'usuario';

    console.log('\nIntentando insertar:', { nombre, email, rol });

    const hash = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      `INSERT INTO users (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, created_at`,
      [nombre, email, hash, rol]
    );
    console.log('Usuario insertado:', insertResult.rows[0]);

    // 3) Verificar findByEmail
    const found = await pool.query(
      'SELECT id, nombre, email, password, rol, created_at FROM users WHERE email = $1',
      [email]
    );
    console.log('findByEmail result:', found.rows[0]);

    await pool.end();
    console.log('\n✅ Todo OK. El registro debería funcionar.');
  } catch (err) {
    console.error('❌ Error:', err);
    await pool.end();
    process.exit(1);
  }
}

testRegister();
