/**
 * Script para probar registro localmente usando la BD de Render.
 * Reemplaza la DATABASE_URL de tu .env local con la External Database URL de Render.
 */

require('dotenv').config();
const bcrypt = require('bcryptjs');
const pool = require('./config/db');

async function testRegister() {
  console.log('=== Prueba de registro con BD de Render ===');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'OK' : 'FALTA');
  console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'OK' : 'FALTA');
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('tu_')) {
    console.error('❌ DATABASE_URL no configurada o contiene placeholder. Edita tu .env local con la External Database URL de Render.');
    process.exit(1);
  }
  try {
    // 1) Verificar si la tabla users existe y sus columnas
    const tableCheck = await pool.query('SELECT to_regclass(\'public.users\') AS users_table');
    console.log('✅ Tabla users:', tableCheck.rows[0]);

    const cols = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_schema='public' AND table_name='users'
      ORDER BY ordinal_position
    `);
    console.log('✅ Columnas:', cols.rows);

    // 2) Intentar insertar un usuario de prueba
    const email = `test-${Date.now()}@example.com`;
    const nombre = 'Test User';
    const password = '123456';
    const rol = 'usuario';

    console.log('\n🔍 Intentando insertar:', { nombre, email, rol });

    // Verificar duplicado antes de insertar
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length) {
      console.log('⚠️  Email ya existe, eliminando...');
      await pool.query('DELETE FROM users WHERE email = $1', [email]);
    }

    const hash = await bcrypt.hash(password, 10);
    const insertResult = await pool.query(
      `INSERT INTO users (nombre, email, password, rol)
       VALUES ($1, $2, $3, $4)
       RETURNING id, nombre, email, rol, created_at`,
      [nombre, email, hash, rol]
    );
    console.log('✅ Usuario insertado:', insertResult.rows[0]);

    // 3) Verificar findByEmail
    const found = await pool.query(
      'SELECT id, nombre, email, password, rol, created_at FROM users WHERE email = $1',
      [email]
    );
    console.log('✅ findByEmail result:', found.rows[0]);

    // 4) Limpiar
    await pool.query('DELETE FROM users WHERE email = $1', [email]);
    console.log('🧹 Usuario de prueba eliminado.');

    await pool.end();
    console.log('\n✅ Todo OK. El registro debería funcionar en Render.');
  } catch (err) {
    console.error('❌ Error:', {
      message: err.message,
      code: err.code,
      detail: err.detail,
      hint: err.hint,
      where: err.where,
      stack: err.stack,
    });
    await pool.end();
    process.exit(1);
  }
}

testRegister();
