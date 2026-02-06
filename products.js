// Модуль для работы с товарами

const Products = {
    // Инициализация модуля
    init() {
        console.log('Модуль Products инициализирован');
    },

    // Получение всех товаров
    getAllProducts() {
        return Storage.getProducts();
    },

    // Получение товаров по категории
    getProductsByCategory(categoryId) {
        const products = Storage.getProducts();
        return products.filter(product => product.categoryId == categoryId);
    },

    // Получение товара по ID
    getProductById(id) {
        return Storage.getProductById(id);
    },

    // Отображение всех товаров на главной странице
    renderProducts() {
        const products = this.getAllProducts();
        const container = document.getElementById('products-container');
        
        if (!container) return;
        
        if (products.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 50px 20px;">
                    <div style="font-size: 60px; color: #ddd; margin-bottom: 20px;">
                        <i class="fas fa-box-open"></i>
                    </div>
                    <h3 style="color: #7f8c8d; margin-bottom: 10px;">Товары не найдены</h3>
                    <p style="color: #95a5a6;">Администратор еще не добавил товары в каталог</p>
                </div>
            `;
            return;
        }
        
        let html = '<div class="products-grid">';
        
        products.forEach(product => {
            const category = Storage.getCategoryById(product.categoryId);
            const categoryName = category ? category.name : 'Без категории';
            
            html += `
                <div class="product-card" data-product-id="${product.id}">
                    <div class="product-image">
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">${Storage.formatPrice(product.price)}</div>
                        <div style="font-size: 12px; color: #7f8c8d; margin-bottom: 10px;">
                            ${categoryName}
                        </div>
                        <div class="product-actions">
                            <button class="btn btn-small" onclick="Products.viewProduct(${product.id})">
                                <i class="fas fa-eye"></i> Подробнее
                            </button>
                            <button class="btn btn-primary btn-small" onclick="Cart.addToCart(${product.id})">
                                <i class="fas fa-cart-plus"></i> В корзину
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    },

    // Просмотр детальной информации о товаре
    viewProduct(productId) {
        const product = this.getProductById(productId);
        if (!product) return;
        
        const category = Storage.getCategoryById(product.categoryId);
        const categoryName = category ? category.name : 'Без категории';
        
        // Создаем модальное окно
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">${product.name}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div class="product-image" style="height: 250px;">
                        <i class="fas fa-box fa-4x"></i>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p><strong>Категория:</strong> ${categoryName}</p>
                    <p><strong>Цена:</strong> <span style="font-size: 24px; color: #e74c3c; font-weight: bold;">
                        ${Storage.formatPrice(product.price)}
                    </span></p>
                    <p><strong>На складе:</strong> ${product.stock} шт.</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h4 style="margin-bottom: 10px;">Описание:</h4>
                    <p>${product.description || 'Описание отсутствует'}</p>
                </div>
                
                <div class="product-actions" style="display: flex; gap: 10px;">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                    <button class="btn btn-primary" onclick="Cart.addToCart(${product.id}); this.closest('.modal').remove()">
                        <i class="fas fa-cart-plus"></i> Добавить в корзину
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Отображение товаров по категории
    renderProductsByCategory(categoryId) {
        const products = this.getProductsByCategory(categoryId);
        const container = document.getElementById('products-container');
        const category = Storage.getCategoryById(categoryId);
        
        if (!container) return;
        
        // Заголовок категории
        let html = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                <button class="btn btn-small btn-secondary" onclick="Categories.renderCategories()">
                    <i class="fas fa-arrow-left"></i> Назад к категориям
                </button>
                <h2 style="margin: 0;">${category ? category.name : 'Товары'}</h2>
            </div>
        `;
        
        if (products.length === 0) {
            html += `
                <div style="text-align: center; padding: 40px 20px; background-color: #f8f9fa; border-radius: 10px;">
                    <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">
                        <i class="fas fa-box-open"></i>
                    </div>
                    <h3 style="color: #7f8c8d; margin-bottom: 10px;">Товары не найдены</h3>
                    <p style="color: #95a5a6;">В этой категории пока нет товаров</p>
                </div>
            `;
        } else {
            html += '<div class="products-grid">';
            
            products.forEach(product => {
                html += `
                    <div class="product-card" data-product-id="${product.id}">
                        <div class="product-image">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">${Storage.formatPrice(product.price)}</div>
                            <div class="product-actions">
                                <button class="btn btn-small" onclick="Products.viewProduct(${product.id})">
                                    <i class="fas fa-eye"></i> Подробнее
                                </button>
                                <button class="btn btn-primary btn-small" onclick="Cart.addToCart(${product.id})">
                                    <i class="fas fa-cart-plus"></i> В корзину
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        container.innerHTML = html;
    },

    // Поиск товаров
    searchProducts(query) {
        const products = this.getAllProducts();
        const normalizedQuery = query.toLowerCase().trim();
        
        return products.filter(product => 
            product.name.toLowerCase().includes(normalizedQuery) ||
            (product.description && product.description.toLowerCase().includes(normalizedQuery))
        );
    },

    // Отображение результатов поиска
    renderSearchResults(query) {
        const results = this.searchProducts(query);
        const container = document.getElementById('products-container');
        
        if (!container) return;
        
        let html = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                <button class="btn btn-small btn-secondary" onclick="Products.renderProducts()">
                    <i class="fas fa-arrow-left"></i> Все товары
                </button>
                <h2 style="margin: 0;">Результаты поиска: "${query}"</h2>
            </div>
        `;
        
        if (results.length === 0) {
            html += `
                <div style="text-align: center; padding: 40px 20px; background-color: #f8f9fa; border-radius: 10px;">
                    <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">
                        <i class="fas fa-search"></i>
                    </div>
                    <h3 style="color: #7f8c8d; margin-bottom: 10px;">Ничего не найдено</h3>
                    <p style="color: #95a5a6;">Попробуйте изменить запрос</p>
                </div>
            `;
        } else {
            html += `
                <p style="margin-bottom: 20px; color: #7f8c8d;">
                    Найдено товаров: ${results.length}
                </p>
                <div class="products-grid">
            `;
            
            results.forEach(product => {
                const category = Storage.getCategoryById(product.categoryId);
                const categoryName = category ? category.name : 'Без категории';
                
                html += `
                    <div class="product-card" data-product-id="${product.id}">
                        <div class="product-image">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="product-info">
                            <div class="product-name">${product.name}</div>
                            <div class="product-price">${Storage.formatPrice(product.price)}</div>
                            <div style="font-size: 12px; color: #7f8c8d; margin-bottom: 10px;">
                                ${categoryName}
                            </div>
                            <div class="product-actions">
                                <button class="btn btn-small" onclick="Products.viewProduct(${product.id})">
                                    <i class="fas fa-eye"></i> Подробнее
                                </button>
                                <button class="btn btn-primary btn-small" onclick="Cart.addToCart(${product.id})">
                                    <i class="fas fa-cart-plus"></i> В корзину
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        container.innerHTML = html;
    },

    // Получение иконки для категории
    getCategoryIcon(categoryId) {
        const category = Storage.getCategoryById(categoryId);
        if (!category || !category.icon) return 'fa-box';
        
        const iconMap = {
            'snowflake': 'fa-snowflake',
            'wind': 'fa-wind',
            'tv': 'fa-tv',
            'tshirt': 'fa-tshirt',
            'temperature-high': 'fa-temperature-high',
            'coffee': 'fa-coffee'
        };
        
        return iconMap[category.icon] || 'fa-box';
    },

    // Обновление количества товара на складе
    updateStock(productId, quantityChange) {
        const product = this.getProductById(productId);
        if (!product) return false;
        
        const newStock = product.stock - quantityChange;
        if (newStock < 0) {
            return false; // Недостаточно товара на складе
        }
        
        product.stock = newStock;
        Storage.saveProduct(product);
        return true;
    }
};