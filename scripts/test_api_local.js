/**
 * Script para probar la API localmente con la base de datos de Render
 * Ejecutar: node test_api_local.js
 */

const fetch = require('node-fetch');

const API_BASE = 'http://localhost:3001/api';

async function testAPI() {
  console.log('🧪 Probando API local con base de datos de Render...\n');

  try {
    // Test 1: Obtener todos los productos
    console.log('📦 Test 1: GET /api/products');
    const productsResponse = await fetch(`${API_BASE}/products`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token' // Token de prueba
      }
    });
    
    if (productsResponse.ok) {
      const products = await productsResponse.json();
      console.log(`✅ Productos encontrados: ${products.length}`);
      if (products.length > 0) {
        console.log('📋 Primer producto:', products[0].nombre);
      }
    } else {
      console.log('❌ Error al obtener productos:', productsResponse.status);
      const error = await productsResponse.text();
      console.log('Error details:', error);
    }

    // Test 2: Obtener producto por código
    console.log('\n🔍 Test 2: GET /api/products/PRD001');
    const productResponse = await fetch(`${API_BASE}/products/PRD001`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      }
    });

    if (productResponse.ok) {
      const product = await productResponse.json();
      console.log(`✅ Producto encontrado: ${product.nombre}`);
    } else {
      console.log('❌ Error al obtener producto:', productResponse.status);
      const error = await productResponse.text();
      console.log('Error details:', error);
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n💡 Soluciones posibles:');
    console.log('1. Asegúrate de que el servidor está corriendo en http://localhost:3001');
    console.log('2. Verifica que DATABASE_URL en .env apunte a la base de datos de Render');
    console.log('3. Confirma que las tablas existen en la base de datos de Render');
  }
}

testAPI();
