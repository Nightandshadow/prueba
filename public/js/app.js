/**
 * App frontend: redirección según auth, usuario actual, notificaciones.
 */

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || 'null');
  } catch {
    return null;
  }
}

function setUserAndToken(user, token) {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('token', token);
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/index.html';
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname + window.location.search);
    return false;
  }
  return true;
}

function requireAdmin() {
  if (!requireAuth()) return false;
  const user = getCurrentUser();
  if (user && user.rol !== 'admin') {
    if (typeof Swal !== 'undefined') {
      Swal.fire({ icon: 'error', title: 'Acceso denegado', text: 'Solo administradores.' });
    }
    setTimeout(() => (window.location.href = '/index.html'), 1500);
    return false;
  }
  return true;
}

function showLoading(message = 'Cargando...') {
  if (typeof Swal !== 'undefined') {
    Swal.fire({ title: message, allowOutsideClick: false, didOpen: () => Swal.showLoading() });
  }
}

function closeLoading() {
  if (typeof Swal !== 'undefined') Swal.close();
}

function showSuccess(title, text) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({ icon: 'success', title: title || '¡Listo!', text: text || '' });
  } else alert(title + (text ? '\n' + text : ''));
}

function showError(title, text) {
  if (typeof Swal !== 'undefined') {
    Swal.fire({ icon: 'error', title: title || 'Error', text: text || '' });
  } else alert(title + (text ? '\n' + text : ''));
}

function renderNav() {
  const nav = document.getElementById('nav-links') || document.querySelector('[data-nav]');
  if (!nav) return;
  const user = getCurrentUser();
  let html = '';
  if (isLoggedIn()) {
    html += `<span class="text-white/90 text-sm">${user?.nombre || user?.email || 'Usuario'}</span>`;
    html += `<a href="/cart.html" class="text-white/90 hover:text-white flex items-center gap-1"><i data-lucide="shopping-cart"></i> Carrito</a>`;
    html += `<a href="/orders.html" class="text-white/90 hover:text-white flex items-center gap-1"><i data-lucide="history"></i> Mis compras</a>`;
    if (user?.rol === 'admin') {
      html += `<a href="/admin.html" class="text-white/90 hover:text-white flex items-center gap-1"><i data-lucide="shield"></i> Admin</a>`;
    }
    html += `<button type="button" onclick="logout()" class="text-white/90 hover:text-white flex items-center gap-1"><i data-lucide="log-out"></i> Salir</button>`;
  } else {
    html += `<a href="/login.html" class="text-white/90 hover:text-white flex items-center gap-1"><i data-lucide="log-in"></i> Iniciar sesión</a>`;
    html += `<a href="/register.html" class="text-white/90 hover:text-white flex items-center gap-1"><i data-lucide="user-plus"></i> Registrarse</a>`;
  }
  nav.innerHTML = html;
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

// Inicializar Lucide si existe
document.addEventListener('DOMContentLoaded', () => {
  renderNav();
  if (typeof lucide !== 'undefined') lucide.createIcons();
});
