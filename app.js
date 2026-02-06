// Главный модуль приложения - точка входа

const App = {
    // Инициализация приложения
    init() {
        console.log('Приложение инициализируется...');
        
        // Инициализируем хранилище
        Storage.init();
        
        // Проверяем текущего пользователя
        const currentUser = Storage.getCurrentUser();
        
        if (!currentUser) {
            // Если нет пользователя, показываем стартовый экран
            Auth.showStartScreen();
        } else if (currentUser.role === 'admin') {
            // Если пользователь - администратор
            Admin.init();
        } else {
            // Если пользователь - клиент
            this.showMainInterface();
        }
        
        // Скрываем экран загрузки
        this.hideLoadingScreen();
        
        // Инициализируем остальные модули
        Products.init();
        Categories.init();
        Cart.init();
        Orders.init();
        
        console.log('Приложение запущено');
    },
    
    // Показать основной интерфейс пользователя
    showMainInterface() {
        const user = Storage.getCurrentUser();
        
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="main-screen">
                <!-- Шапка приложения -->
                <div class="app-header">
                    <div class="header-content">
                        <div class="logo">
                            <i class="fas fa-box-open"></i>
                            <span>Сервис доставки</span>
                        </div>
                        <div class="user-info">
                            <span>${user.name}</span>
                            <span class="user-id">ID: ${user.id}</span>
                            <button class="btn btn-small btn-danger" id="logout-btn">
                                <i class="fas fa-sign-out-alt"></i>
                            </button>
                        </div>
                    </div>
                </div>
                
                <!-- Основной контент -->
                <div class="app-content">
                    <div id="products-container">
                        <!-- Содержимое будет загружено через JS -->
                    </div>
                </div>
                
                <!-- Нижнее меню навигации -->
                <div class="bottom-nav">
                    <a href="#" class="nav-item active" data-screen="main">
                        <i class="fas fa-home"></i>
                        <span class="nav-label">Главная</span>
                    </a>
                    
                    <a href="#" class="nav-item" data-screen="catalog">
                        <i class="fas fa-search"></i>
                        <span class="nav-label">Каталог</span>
                    </a>
                    
                    <a href="#" class="nav-item" data-screen="cart">
                        <i class="fas fa-shopping-cart"></i>
                        <span class="nav-label">Корзина</span>
                        <span class="cart-badge" style="display: none;"></span>
                    </a>
                    
                    <a href="#" class="nav-item" data-screen="profile">
                        <i class="fas fa-user"></i>
                        <span class="nav-label">Профиль</span>
                    </a>
                </div>
            </div>
        `;
        
        // Загружаем товары на главную
        Products.renderProducts();
        
        // Обновляем бейдж корзины
        Cart.updateCartBadge();
        
        // Привязываем события
        this.bindEvents();
    },
    
    // Показать экран
    showScreen(screenName) {
        // Обновляем активный элемент в навигации
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.dataset.screen === screenName) {
                item.classList.add('active');
            }
        });
        
        // Показываем соответствующий контент
        const container = document.getElementById('products-container');
        
        switch(screenName) {
            case 'main':
                Products.renderProducts();
                break;
                
            case 'catalog':
                Categories.renderCategories();
                break;
                
            case 'cart':
                this.renderCartScreen();
                break;
                
            case 'profile':
                this.renderProfileScreen();
                break;
                
            case 'orders':
                this.renderOrdersScreen();
                break;
        }
    },
    
    // Отрисовка экрана корзины
    renderCartScreen() {
        const container = document.getElementById('products-container');
        container.innerHTML = `
            <div style="margin-bottom: 25px;">
                <h2>Корзина</h2>
                <p style="color: #7f8c8d;">Товары, добавленные в корзину</p>
            </div>
            
            <div id="cart-items"></div>
            <div id="cart-total" style="display: none;">
                <div style="font-size: 20px; font-weight: bold; text-align: right; margin: 20px 0;">
                    Общая сумма: <span id="total-amount">0</span>
                </div>
                
                <div class="auth-actions">
                    <button class="btn btn-danger" onclick="Cart.clearCart()">
                        <i class="fas fa-trash"></i> Очистить корзину
                    </button>
                    <button class="btn btn-primary" onclick="Cart.checkout()">
                        <i class="fas fa-check"></i> Оформить заказ
                    </button>
                </div>
            </div>
        `;
        
        Cart.renderCart();
    },
    
    // Отрисовка экрана профиля
    renderProfileScreen() {
        const user = Storage.getCurrentUser();
        const userOrders = Orders.getUserOrders(user.id);
        
        const processingCount = userOrders.filter(o => o.status === 'processing').length;
        const onwayCount = userOrders.filter(o => o.status === 'onway').length;
        const deliveredCount = userOrders.filter(o => o.status === 'delivered').length;
        
        const container = document.getElementById('products-container');
        container.innerHTML = `
            <div style="margin-bottom: 25px;">
                <h2>Мой профиль</h2>
                <p style="color: #7f8c8d;">Ваши данные и статистика</p>
            </div>
            
            <div class="info-block" style="background-color: #f0f8ff; padding: 20px; border-radius: 10px; margin-bottom: 25px;">
                <h4 style="color: #2c3e50; margin-bottom: 15px;">Личная информация</h4>
                <div style="margin-bottom: 10px;">
                    <strong>ФИО:</strong> ${user.name}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Телефон:</strong> ${user.phone}
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Адрес доставки:</strong> ${user.address}
                </div>
                <div>
                    <strong>ID пользователя:</strong> <span style="font-family: monospace; background-color: #e8f4fc; padding: 2px 6px; border-radius: 4px;">${user.id}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 25px;">
                <h3 style="margin-bottom: 15px;">Статистика заказов</h3>
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #f39c12;">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-value">${processingCount}</div>
                        <div class="stat-label">В обработке</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #9b59b6;">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="stat-value">${onwayCount}</div>
                        <div class="stat-label">В пути</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #2ecc71;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-value">${deliveredCount}</div>
                        <div class="stat-label">Доставлено</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #3498db;">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div class="stat-value">${userOrders.length}</div>
                        <div class="stat-label">Всего заказов</div>
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3 style="margin: 0;">Мои заказы</h3>
                    <button class="btn btn-small" onclick="App.showScreen('orders')">
                        <i class="fas fa-list"></i> Все заказы
                    </button>
                </div>
                
                ${userOrders.length === 0 ? `
                    <div style="text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 10px;">
                        <p style="color: #95a5a6; margin: 0;">У вас пока нет заказов</p>
                    </div>
                ` : `
                    <div class="list-group">
                        ${userOrders.slice(0, 3).map(order => {
                            const orderDate = new Date(order.createdAt).toLocaleDateString('ru-RU');
                            const statusText = Orders.getOrderStatusText(order.status);
                            const statusClass = Orders.getOrderStatusClass(order.status);
                            
                            return `
                                <div class="list-item">
                                    <div style="flex: 1;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                                            <div style="font-weight: 600;">Заказ #${order.id.substring(0, 8)}</div>
                                            <span class="status-badge ${statusClass}">${statusText}</span>
                                        </div>
                                        <div style="font-size: 12px; color: #7f8c8d; margin-bottom: 5px;">${orderDate}</div>
                                        <div style="font-size: 14px; color: #2c3e50;">
                                            ${order.items.length} товаров • ${Storage.formatPrice(order.total)}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                    
                    ${userOrders.length > 3 ? `
                        <div style="text-align: center; margin-top: 15px;">
                            <button class="btn btn-small btn-secondary" onclick="App.showScreen('orders')">
                                Показать еще ${userOrders.length - 3} заказов
                            </button>
                        </div>
                    ` : ''}
                `}
            </div>
            
            <div style="margin-top: 30px;">
                <h3 style="margin-bottom: 15px;">Дополнительно</h3>
                <div style="display: flex; flex-direction: column; gap: 15px;">
                    <button class="btn" onclick="alert('Информация о сервисе')">
                        <i class="fas fa-info-circle"></i> О сервисе
                    </button>
                    <button class="btn" onclick="alert('Раздел помощи')">
                        <i class="fas fa-question-circle"></i> Помощь
                    </button>
                    <button class="btn btn-secondary">
                        <i class="fab fa-telegram"></i> Telegram бот
                    </button>
                </div>
            </div>
        `;
    },
    
    // Отрисовка экрана заказов
    renderOrdersScreen() {
        const container = document.getElementById('products-container');
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 25px;">
                <button class="btn btn-small btn-secondary" onclick="App.showScreen('profile')">
                    <i class="fas fa-arrow-left"></i> Назад в профиль
                </button>
                <h2 style="margin: 0;">Мои заказы</h2>
            </div>
            
            <div id="orders-stats"></div>
            <div id="orders-list"></div>
        `;
        
        Orders.renderUserOrders();
    },
    
    // Поиск товаров
    setupSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    Products.renderSearchResults(query);
                } else if (query.length === 0) {
                    Products.renderProducts();
                }
            });
        }
    },
    
    // Привязка событий
    bindEvents() {
        // Навигация по меню
        document.addEventListener('click', (e) => {
            const navItem = e.target.closest('.nav-item');
            if (navItem) {
                e.preventDefault();
                const screen = navItem.dataset.screen;
                this.showScreen(screen);
            }
        });
        
        // Выход из системы
        document.addEventListener('click', (e) => {
            if (e.target.id === 'logout-btn' || e.target.closest('#logout-btn')) {
                if (confirm('Вы уверены, что хотите выйти?')) {
                    Auth.logout();
                }
            }
        });
        
        // Обработка нажатия Enter в поле поиска
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'search-input' && e.key === 'Enter') {
                const query = e.target.value.trim();
                if (query.length >= 2) {
                    Products.renderSearchResults(query);
                }
            }
        });
    },
    
    // Скрыть экран загрузки
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.style.display = 'none';
        }
    }
};

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Глобальные функции для вызова из HTML
window.App = App;
window.Products = Products;
window.Categories = Categories;
window.Cart = Cart;
window.Orders = Orders;
window.Admin = Admin;
window.Auth = Auth;
window.Storage = Storage;