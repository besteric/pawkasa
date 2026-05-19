class PawKasaTheme {
  constructor() {
    this.bindMobileMenu();
    this.bindCartDrawer();
    this.bindProductForms();
  }

  bindMobileMenu() {
    const toggle = document.querySelector('[data-mobile-menu-toggle]');
    const menu = document.querySelector('[data-mobile-menu]');
    toggle?.addEventListener('click', () => menu?.classList.toggle('is-open'));
  }

  bindCartDrawer() {
    this.drawer = document.querySelector('[data-cart-drawer]');
    this.overlay = document.querySelector('[data-cart-overlay]');
    document.querySelectorAll('[data-cart-open]').forEach((button) => button.addEventListener('click', () => this.openCart()));
    document.querySelectorAll('[data-cart-close], [data-cart-overlay]').forEach((button) => button.addEventListener('click', () => this.closeCart()));
    document.addEventListener('click', async (event) => {
      const button = event.target.closest('[data-cart-change]');
      if (!button) return;
      await this.changeCart(button.dataset.key, Number(button.dataset.quantity));
    });
  }

  bindProductForms() {
    document.addEventListener('submit', async (event) => {
      const form = event.target.closest('form[action*="/cart/add"]');
      if (!form || form.dataset.productForm === '') return;
      event.preventDefault();
      const formData = new FormData(form);
      const response = await fetch(`${window.Shopify.routes.root}cart/add.js`, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      });
      if (response.ok) {
        await this.refreshCart();
        this.openCart();
      } else {
        form.submit();
      }
    });
  }

  async changeCart(key, quantity) {
    await fetch(`${window.Shopify.routes.root}cart/change.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ id: key, quantity }),
    });
    await this.refreshCart();
  }

  async refreshCart() {
    const response = await fetch(`${window.Shopify.routes.root}cart.js`, {
      headers: { Accept: 'application/json' },
    });
    const cart = await response.json();
    this.renderCart(cart);
  }

  renderCart(cart) {
    const drawerItems = document.querySelector('[data-cart-items]');
    const count = document.querySelector('[data-cart-count]');
    const subtotal = document.querySelector('[data-cart-subtotal]');
    if (count) count.textContent = cart.item_count;
    if (subtotal) subtotal.textContent = this.formatMoney(cart.total_price);
    if (!drawerItems) return;

    if (!cart.item_count) {
      drawerItems.innerHTML = `
        <div class="empty-cart">
          <h3>Your cart is empty</h3>
          <p>Add a scratcher or two, then checkout with Shopify secure checkout.</p>
          <a class="button button--primary" href="${window.Shopify.routes.root}collections/all">Shop products</a>
        </div>
      `;
      return;
    }

    drawerItems.innerHTML = cart.items.map((item) => `
      <div class="cart-line" data-line-key="${item.key}">
        <img src="${item.image || ''}" alt="${this.escapeHtml(item.product_title)}" loading="lazy">
        <div>
          <h3>${this.escapeHtml(item.product_title)}</h3>
          <p>${this.formatMoney(item.final_line_price)}</p>
          <div class="qty-controls">
            <button type="button" data-cart-change data-key="${item.key}" data-quantity="${Math.max(0, item.quantity - 1)}">-</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-change data-key="${item.key}" data-quantity="${item.quantity + 1}">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  formatMoney(cents) {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', {
      style: 'currency',
      currency: window.Shopify.currency?.active || 'USD',
    }).format((cents || 0) / 100);
  }

  escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, (char) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    }[char]));
  }

  openCart() {
    this.drawer?.classList.add('is-open');
    this.overlay?.classList.add('is-open');
  }

  closeCart() {
    this.drawer?.classList.remove('is-open');
    this.overlay?.classList.remove('is-open');
  }
}

document.addEventListener('DOMContentLoaded', () => new PawKasaTheme());
