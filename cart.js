// Модуль для работы с корзиной

const Cart = {
    // Инициализация модуля
    init() {
        console.log('Модуль Cart инициализирован');
    },

    // Получение содержимого корзины
    getCart() {
        return Storage.getCart();
    },

    // Получение общего количества товаров в корзине
    getCartItemCount() {
        const cart = this.getCart();
        return cart.reduce((total, item) => total + item.quantity, 0);
    },

    // Получение общей стоимости корзины
    getCartTotal() {
        const cart = this.getCart();
        let total = 0;
        
        cart.forEach(item => {
            const product = Products.getProductById(item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        });
        
        return total;
    },

    // Добавление товара в корзину
    addToCart(productId, quantity = 1) {
        // Проверяем наличие товара на складе
        const product = Products.getProductById(productId);
        if (!product) {
            this.showMessage('Товар не найден', 'error');
            return false;
        }
        
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId == productId);
        
        // Проверяем, достаточно ли товара на складе
        const requestedQuantity = existingItem ? existingItem.quantity + quantity : quantity;
        if (product.stock < requestedQuantity) {
            this.showMessage(`Недостаточно товара на складе. Доступно: ${product.stock} шт.`, 'error');
            return false;
        }
        
        Storage.addToCart(productId, quantity);
        this.updateCartBadge();
        this.showMessage('Товар добавлен в корзину', 'success');
        
        // Если мы на странице корзины, обновляем её
        if (document.getElementById('cart-items')) {
            this.renderCart();
        }
        
        return true;
    },

    // Удаление товара из корзины
    removeFromCart(productId) {
        Storage.removeFromCart(productId);
        this.updateCartBadge();
        
        if (document.getElementById('cart-items')) {
            this.renderCart();
        }
        
        this.showMessage('Товар удален из корзины', 'info');
    },

    // Обновление количества товара в корзине
    updateQuantity(productId, newQuantity) {
        if (newQuantity < 1) {
            this.removeFromCart(productId);
            return;
        }
        
        // Проверяем наличие товара на складе
        const product = Products.getProductById(productId);
        if (product && product.stock < newQuantity) {
            this.showMessage(`Недостаточно товара на складе. Доступно: ${product.stock} шт.`, 'error');
            this.renderCart(); // Перерисовываем корзину для отображения корректного количества
            return;
        }
        
        Storage.updateCartItem(productId, newQuantity);
        this.updateCartBadge();
        
        if (document.getElementById('cart-items')) {
            this.renderCart();
        }
    },

    // Очистка корзины
    clearCart() {
        Storage.clearCart();
        this.updateCartBadge();
        
        if (document.getElementById('cart-items')) {
            this.renderCart();
        }
        
        this.showMessage('Корзина очищена', 'info');
    },

    // Отображение корзины
    renderCart() {
        const cart = this.getCart();
        const container = document.getElementById('cart-items');
        const totalContainer = document.getElementById('cart-total');
        
        if (!container) return;
        
        if (cart.length === 0) {
            container.innerHTML = `
                <div id="empty-cart" style="text-align: center; padding: 40px 20px; color: #666;">
                    <div style="font-size: 48px; margin-bottom: 20px; color: #ddd;">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3 style="color: #7f8c8d; margin-bottom: 10px;">Корзина пуста</h3>
                    <p style="color: #95a5a6;">Добавьте товары из каталога</p>
                    <button class="btn btn-primary" onclick="App.showScreen('catalog')" style="margin-top: 20px;">
                        <i class="fas fa-shopping-bag"></i> Перейти в каталог
                    </button>
                </div>
            `;
            
            if (totalContainer) {
                totalContainer.style.display = 'none';
            }
            
            return;
        }
        
        let html = '<div class="list-group">';
        let total = 0;
        
        cart.forEach(item => {
            const product = Products.getProductById(item.productId);
            if (!product) return;
            
            const itemTotal = product.price * item.quantity;
            total += itemTotal;
            
            html += `
                <div class="list-item" data-product-id="${product.id}">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 5px;">${product.name}</div>
                        <div style="color: #e74c3c; font-weight: 600; margin-bottom: 10px;">
                            ${Storage.formatPrice(product.price)} × ${item.quantity} = ${Storage.formatPrice(itemTotal)}
                        </div>
                        <div class="product-actions" style="display: flex; gap: 10px; align-items: center;">
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <button class="btn btn-small btn-secondary" 
                                        onclick="Cart.updateQuantity(${product.id}, ${item.quantity - 1})"
                                        ${item.quantity <= 1 ? 'disabled' : ''}>
                                    <i class="fas fa-minus"></i>
                                </button>
                                <span style="min-width: 30px; text-align: center;">${item.quantity}</span>
                                <button class="btn btn-small btn-secondary" 
                                        onclick="Cart.updateQuantity(${product.id}, ${item.quantity + 1})">
                                    <i class="fas fa-plus"></i>
                                </button>
                            </div>
                            <button class="btn btn-small btn-danger" onclick="Cart.removeFromCart(${product.id})">
                                <i class="fas fa-trash"></i> Удалить
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Обновляем общую сумму
        if (totalContainer) {
            document.getElementById('total-amount').textContent = Storage.formatPrice(total);
            totalContainer.style.display = 'block';
        }
        
        this.updateCartBadge();
    },

    // Обновление бейджа на иконке корзины
    updateCartBadge() {
        const cartCount = this.getCartItemCount();
        const cartBadge = document.querySelector('.cart-badge');
        
        if (cartBadge) {
            if (cartCount > 0) {
                cartBadge.textContent = cartCount;
                cartBadge.style.display = 'flex';
            } else {
                cartBadge.style.display = 'none';
            }
        }
    },

    // Оформление заказа
    checkout() {
        const user = Storage.getCurrentUser();
        if (!user || user.role !== 'client') {
            this.showMessage('Для оформления заказа необходимо войти как клиент', 'error');
            return;
        }
        
        const cart = this.getCart();
        if (cart.length === 0) {
            this.showMessage('Корзина пуста', 'error');
            return;
        }
        
        // Проверяем наличие всех товаров на складе
        for (const item of cart) {
            const product = Products.getProductById(item.productId);
            if (!product) {
                this.showMessage(`Товар с ID ${item.productId} не найден`, 'error');
                return;
            }
            
            if (product.stock < item.quantity) {
                this.showMessage(`Недостаточно товара "${product.name}" на складе. Доступно: ${product.stock} шт.`, 'error');
                return;
            }
        }
        
        // Создаем заказ
        const order = {
            userId: user.id,
            userName: user.name,
            userPhone: user.phone,
            userAddress: user.address,
            items: cart.map(item => ({
                productId: item.productId,
                productName: Products.getProductById(item.productId).name,
                quantity: item.quantity,
                price: Products.getProductById(item.productId).price
            })),
            total: this.getCartTotal(),
            status: 'processing',
            createdAt: new Date().toISOString()
        };
        
        // Сохраняем заказ
        const savedOrder = Storage.saveOrder(order);
        
        // Обновляем количество товаров на складе
        let allStockUpdated = true;
        for (const item of cart) {
            const success = Products.updateStock(item.productId, item.quantity);
            if (!success) {
                allStockUpdated = false;
                console.error(`Не удалось обновить запас товара ${item.productId}`);
            }
        }
        
        if (!allStockUpdated) {
            this.showMessage('Часть товаров уже закончилась на складе', 'warning');
        }
        
        // Очищаем корзину
        this.clearCart();
        
        // Показываем успешное сообщение
        this.showOrderSuccess(savedOrder);
    },

    // Показать успешное оформление заказа
    showOrderSuccess(order) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Заказ оформлен!</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <div style="text-align: center; margin: 20px 0;">
                    <div style="font-size: 60px; color: #2ecc71; margin-bottom: 20px;">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3 style="color: #2c3e50; margin-bottom: 10px;">Заказ №${order.id.substring(0, 8)}</h3>
                    <p style="color: #7f8c8d;">Статус: <span class="status-badge status-processing">В обработке</span></p>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h4 style="margin-bottom: 10px;">Детали заказа:</h4>
                    <div class="list-group">
                        ${order.items.map(item => `
                            <div class="list-item">
                                <div>${item.productName}</div>
                                <div>${item.quantity} × ${Storage.formatPrice(item.price)}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div style="text-align: right; margin-top: 15px; padding-top: 15px; border-top: 2px solid #eee;">
                        <strong style="font-size: 18px;">Итого: ${Storage.formatPrice(order.total)}</strong>
                    </div>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h4 style="margin-bottom: 10px;">Доставка:</h4>
                    <p><strong>Адрес:</strong> ${order.userAddress}</p>
                    <p><strong>Телефон:</strong> ${order.userPhone}</p>
                </div>
                
                <div class="auth-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove(); App.showScreen('main')">
                        <i class="fas fa-home"></i> На главную
                    </button>
                    <button class="btn btn-primary" onclick="this.closest('.modal').remove(); App.showScreen('orders')">
                        <i class="fas fa-list"></i> Мои заказы
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Показать сообщение
    showMessage(message, type = 'info') {
        // Создаем элемент сообщения
        const messageDiv = document.createElement('div');
        messageDiv.className = `cart-message cart-message-${type}`;
        messageDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
        `;
        
        // Добавляем стили
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'success' ? '#d4edda' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
            color: ${type === 'success' ? '#155724' : type === 'error' ? '#721c24' : '#0c5460'};
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            z-index: 10000;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Добавляем в body
        document.body.appendChild(messageDiv);
        
        // Удаляем через 5 секунд
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    },

    // Инициализация событий корзины
    bindEvents() {
        // События будут привязаны при рендере
    }
};

// Добавляем CSS для анимации сообщений
const cartMessageStyles = document.createElement('style');
cartMessageStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(cartMessageStyles);