// Модуль для работы с административной панелью

const Admin = {
    // Инициализация модуля
    init() {
        this.renderAdminPanel();
        this.bindEvents();
        console.log('Модуль Admin инициализирован');
    },

    // Отрисовка админ панели
    renderAdminPanel() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="admin-screen active">
                <div class="app-header">
                    <div class="header-content">
                        <div class="logo">
                            <i class="fas fa-cogs"></i>
                            <span>Панель администратора</span>
                        </div>
                        <div class="user-info">
                            <span>Администратор</span>
                            <button class="btn btn-small btn-danger" id="admin-logout">
                                <i class="fas fa-sign-out-alt"></i> Выйти
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="app-content">
                    <div class="admin-panel">
                        <div class="admin-sidebar">
                            <ul class="admin-menu">
                                <li class="admin-menu-item active" data-section="dashboard">
                                    <i class="fas fa-tachometer-alt"></i>
                                    <span>Панель управления</span>
                                </li>
                                <li class="admin-menu-item" data-section="users">
                                    <i class="fas fa-users"></i>
                                    <span>Пользователи</span>
                                </li>
                                <li class="admin-menu-item" data-section="categories">
                                    <i class="fas fa-folder"></i>
                                    <span>Категории</span>
                                </li>
                                <li class="admin-menu-item" data-section="products">
                                    <i class="fas fa-box"></i>
                                    <span>Товары</span>
                                </li>
                                <li class="admin-menu-item" data-section="orders">
                                    <i class="fas fa-shopping-bag"></i>
                                    <span>Заказы</span>
                                </li>
                            </ul>
                        </div>
                        
                        <div class="admin-content">
                            <div id="admin-sections">
                                <!-- Секции будут загружены через JS -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Загружаем dashboard по умолчанию
        this.showSection('dashboard');
    },

    // Привязка событий
    bindEvents() {
        // События меню
        document.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.admin-menu-item');
            if (menuItem) {
                const section = menuItem.dataset.section;
                this.showSection(section);
                
                // Обновляем активный класс
                document.querySelectorAll('.admin-menu-item').forEach(item => {
                    item.classList.remove('active');
                });
                menuItem.classList.add('active');
            }
        });
        
        // Выход из админки
        document.addEventListener('click', (e) => {
            if (e.target.id === 'admin-logout' || e.target.closest('#admin-logout')) {
                Auth.logout();
            }
        });
    },

    // Показать секцию админ панели
    showSection(sectionName) {
        const sectionsContainer = document.getElementById('admin-sections');
        
        switch(sectionName) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'users':
                this.renderUsers();
                break;
            case 'categories':
                this.renderCategories();
                break;
            case 'products':
                this.renderProducts();
                break;
            case 'orders':
                this.renderOrders();
                break;
            default:
                this.renderDashboard();
        }
    },

    // Отрисовка dashboard
    renderDashboard() {
        const stats = Orders.getOrdersStats();
        const users = Storage.getUsers();
        const products = Products.getAllProducts();
        const categories = Categories.getAllCategories();
        
        const sectionsContainer = document.getElementById('admin-sections');
        sectionsContainer.innerHTML = `
            <div class="admin-section active" id="dashboard-section">
                <div class="admin-section-header">
                    <h2 class="admin-section-title">Панель управления</h2>
                    <div style="font-size: 14px; color: #7f8c8d;">
                        ${new Date().toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
                
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #3498db;">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-value">${users.length}</div>
                        <div class="stat-label">Пользователей</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #2ecc71;">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-value">${products.length}</div>
                        <div class="stat-label">Товаров</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #9b59b6;">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div class="stat-value">${stats.totalOrders}</div>
                        <div class="stat-label">Всего заказов</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon" style="color: #e74c3c;">
                            <i class="fas fa-ruble-sign"></i>
                        </div>
                        <div class="stat-value">${Storage.formatPrice(stats.totalRevenue)}</div>
                        <div class="stat-label">Общая выручка</div>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px;">
                    <div>
                        <h3 style="margin-bottom: 20px; color: #2c3e50;">Статистика заказов</h3>
                        <div class="list-group">
                            <div class="list-item">
                                <div>В обработке</div>
                                <div><span class="status-badge status-processing">${stats.statusCounts.processing}</span></div>
                            </div>
                            <div class="list-item">
                                <div>Подтверждённые</div>
                                <div><span class="status-badge status-confirmed">${stats.statusCounts.confirmed}</span></div>
                            </div>
                            <div class="list-item">
                                <div>В пути</div>
                                <div><span class="status-badge status-onway">${stats.statusCounts.onway}</span></div>
                            </div>
                            <div class="list-item">
                                <div>Доставленные</div>
                                <div><span class="status-badge status-delivered">${stats.statusCounts.delivered}</span></div>
                            </div>
                            <div class="list-item">
                                <div>Отменённые</div>
                                <div><span class="status-badge status-cancelled">${stats.statusCounts.cancelled}</span></div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 style="margin-bottom: 20px; color: #2c3e50;">Быстрые действия</h3>
                        <div style="display: flex; flex-direction: column; gap: 15px;">
                            <button class="btn" onclick="Admin.showSection('products'); Admin.showAddProductModal()">
                                <i class="fas fa-plus"></i> Добавить товар
                            </button>
                            <button class="btn" onclick="Admin.showSection('categories'); Admin.showAddCategoryModal()">
                                <i class="fas fa-folder-plus"></i> Добавить категорию
                            </button>
                            <button class="btn" onclick="Admin.showSection('orders')">
                                <i class="fas fa-eye"></i> Просмотреть заказы
                            </button>
                            <button class="btn btn-secondary" onclick="Storage.clearAll(); location.reload()">
                                <i class="fas fa-trash"></i> Очистить все данные
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    // Отрисовка пользователей
    renderUsers() {
        const users = Storage.getUsers();
        
        const sectionsContainer = document.getElementById('admin-sections');
        sectionsContainer.innerHTML = `
            <div class="admin-section active" id="users-section">
                <div class="admin-section-header">
                    <h2 class="admin-section-title">Управление пользователями</h2>
                    <div style="font-size: 14px; color: #7f8c8d;">
                        Всего пользователей: ${users.length}
                    </div>
                </div>
                
                ${users.length === 0 ? `
                    <div style="text-align: center; padding: 40px 20px; background-color: #f8f9fa; border-radius: 10px;">
                        <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3 style="color: #7f8c8d; margin-bottom: 10px;">Пользователей нет</h3>
                        <p style="color: #95a5a6;">Клиенты еще не зарегистрировались</p>
                    </div>
                ` : `
                    <div class="list-group">
                        ${users.map(user => {
                            const userOrders = Orders.getUserOrders(user.id);
                            const orderCount = userOrders.length;
                            const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
                            
                            return `
                                <div class="list-item">
                                    <div style="flex: 1;">
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                                            <div>
                                                <div style="font-weight: 600; margin-bottom: 5px;">${user.name}</div>
                                                <div style="font-size: 12px; color: #7f8c8d;">ID: ${user.id}</div>
                                            </div>
                                            <div style="text-align: right;">
                                                <div style="font-weight: 600; color: #2c3e50;">${orderCount} зак.</div>
                                                <div style="font-size: 12px; color: #7f8c8d;">${Storage.formatPrice(totalSpent)}</div>
                                            </div>
                                        </div>
                                        
                                        <div style="margin-bottom: 10px;">
                                            <div style="font-size: 14px; color: #2c3e50;">
                                                <i class="fas fa-phone"></i> ${user.phone}
                                            </div>
                                            <div style="font-size: 14px; color: #2c3e50; margin-top: 5px;">
                                                <i class="fas fa-map-marker-alt"></i> ${user.address}
                                            </div>
                                        </div>
                                        
                                        <div style="font-size: 12px; color: #7f8c8d;">
                                            Зарегистрирован: ${new Date(user.registeredAt).toLocaleDateString('ru-RU')}
                                        </div>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        `;
    },

    // Отрисовка категорий
    renderCategories() {
        const categories = Categories.getAllCategories();
        
        const sectionsContainer = document.getElementById('admin-sections');
        sectionsContainer.innerHTML = `
            <div class="admin-section active" id="categories-section">
                <div class="admin-section-header">
                    <h2 class="admin-section-title">Управление категориями</h2>
                    <button class="btn btn-primary" onclick="Admin.showAddCategoryModal()">
                        <i class="fas fa-plus"></i> Добавить категорию
                    </button>
                </div>
                
                ${categories.length === 0 ? `
                    <div style="text-align: center; padding: 40px 20px; background-color: #f8f9fa; border-radius: 10px;">
                        <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">
                            <i class="fas fa-folder-open"></i>
                        </div>
                        <h3 style="color: #7f8c8d; margin-bottom: 10px;">Категорий нет</h3>
                        <p style="color: #95a5a6;">Добавьте первую категорию</p>
                    </div>
                ` : `
                    <div class="list-group">
                        ${categories.map(category => {
                            const productCount = Products.getProductsByCategory(category.id).length;
                            const iconClass = Categories.getIconClass(category.icon);
                            
                            return `
                                <div class="list-item">
                                    <div style="display: flex; align-items: center; gap: 15px; flex: 1;">
                                        <div style="font-size: 24px; color: #3498db;">
                                            <i class="fas ${iconClass}"></i>
                                        </div>
                                        <div style="flex: 1;">
                                            <div style="font-weight: 600; margin-bottom: 5px;">${category.name}</div>
                                            <div style="font-size: 12px; color: #7f8c8d;">
                                                ID: ${category.id} • ${productCount} товаров
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div class="table-actions">
                                        <button class="action-btn action-edit" onclick="Admin.showEditCategoryModal(${category.id})">
                                            <i class="fas fa-edit"></i> Изменить
                                        </button>
                                        <button class="action-btn action-delete" onclick="Admin.deleteCategory(${category.id})">
                                            <i class="fas fa-trash"></i> Удалить
                                        </button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `}
            </div>
        `;
    },

    // Показать модальное окно добавления категории
    showAddCategoryModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Добавить категорию</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <form id="add-category-form" class="admin-form">
                    <div class="form-group">
                        <label class="form-label" for="category-name">Название категории *</label>
                        <input type="text" id="category-name" class="form-input" 
                               placeholder="Например: Холодильники" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="category-icon">Иконка</label>
                        <select id="category-icon" class="form-input">
                            <option value="snowflake">❄️ Снежинка (Холодильники)</option>
                            <option value="wind">🌀 Ветер (Пылесосы)</option>
                            <option value="tv">📺 Телевизор (Телевизоры)</option>
                            <option value="tshirt">👕 Футболка (Стиральные машины)</option>
                            <option value="temperature-high">🌡️ Температура (Микроволновки)</option>
                            <option value="coffee">☕ Кофе (Кофемашины)</option>
                            <option value="box" selected>📦 Коробка (Другое)</option>
                        </select>
                    </div>
                    
                    <div class="auth-actions" style="margin-top: 30px;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Отмена
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Добавить категорию
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('add-category-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addCategory();
        });
    },

    // Добавление категории
    addCategory() {
        const name = document.getElementById('category-name').value.trim();
        const icon = document.getElementById('category-icon').value;
        
        if (!name) {
            alert('Введите название категории');
            return;
        }
        
        Categories.addCategory(name, icon);
        this.renderCategories();
        
        // Закрываем модальное окно
        document.querySelector('.modal.active').remove();
        
        // Показываем сообщение об успехе
        this.showMessage('Категория успешно добавлена', 'success');
    },

    // Показать модальное окно редактирования категории
    showEditCategoryModal(categoryId) {
        const category = Categories.getCategoryById(categoryId);
        if (!category) return;
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Редактировать категорию</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <form id="edit-category-form" class="admin-form">
                    <input type="hidden" id="edit-category-id" value="${category.id}">
                    
                    <div class="form-group">
                        <label class="form-label" for="edit-category-name">Название категории *</label>
                        <input type="text" id="edit-category-name" class="form-input" 
                               value="${category.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="edit-category-icon">Иконка</label>
                        <select id="edit-category-icon" class="form-input">
                            <option value="snowflake" ${category.icon === 'snowflake' ? 'selected' : ''}>❄️ Снежинка</option>
                            <option value="wind" ${category.icon === 'wind' ? 'selected' : ''}>🌀 Ветер</option>
                            <option value="tv" ${category.icon === 'tv' ? 'selected' : ''}>📺 Телевизор</option>
                            <option value="tshirt" ${category.icon === 'tshirt' ? 'selected' : ''}>👕 Футболка</option>
                            <option value="temperature-high" ${category.icon === 'temperature-high' ? 'selected' : ''}>🌡️ Температура</option>
                            <option value="coffee" ${category.icon === 'coffee' ? 'selected' : ''}>☕ Кофе</option>
                            <option value="box" ${!category.icon || category.icon === 'box' ? 'selected' : ''}>📦 Коробка</option>
                        </select>
                    </div>
                    
                    <div class="auth-actions" style="margin-top: 30px;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Отмена
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Сохранить изменения
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('edit-category-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateCategory();
        });
    },

    // Обновление категории
    updateCategory() {
        const id = document.getElementById('edit-category-id').value;
        const name = document.getElementById('edit-category-name').value.trim();
        const icon = document.getElementById('edit-category-icon').value;
        
        if (!name) {
            alert('Введите название категории');
            return;
        }
        
        Categories.updateCategory(id, name, icon);
        this.renderCategories();
        
        // Закрываем модальное окно
        document.querySelector('.modal.active').remove();
        
        // Показываем сообщение об успехе
        this.showMessage('Категория успешно обновлена', 'success');
    },

    // Удаление категории
    deleteCategory(categoryId) {
        if (!confirm('Вы уверены, что хотите удалить эту категорию?')) {
            return;
        }
        
        const result = Categories.deleteCategory(categoryId);
        
        if (result.success) {
            this.renderCategories();
            this.showMessage(result.message, 'success');
        } else {
            alert(result.message);
        }
    },

    // Отрисовка товаров
    renderProducts() {
        const products = Products.getAllProducts();
        
        const sectionsContainer = document.getElementById('admin-sections');
        sectionsContainer.innerHTML = `
            <div class="admin-section active" id="products-section">
                <div class="admin-section-header">
                    <h2 class="admin-section-title">Управление товарами</h2>
                    <div style="display: flex; gap: 10px;">
                        <button class="btn btn-primary" onclick="Admin.showAddProductModal()">
                            <i class="fas fa-plus"></i> Добавить товар
                        </button>
                    </div>
                </div>
                
                ${products.length === 0 ? `
                    <div style="text-align: center; padding: 40px 20px; background-color: #f8f9fa; border-radius: 10px;">
                        <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <h3 style="color: #7f8c8d; margin-bottom: 10px;">Товаров нет</h3>
                        <p style="color: #95a5a6;">Добавьте первый товар</p>
                    </div>
                ` : `
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Категория</th>
                                <th>Цена</th>
                                <th>На складе</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${products.map(product => {
                                const category = Categories.getCategoryById(product.categoryId);
                                const categoryName = category ? category.name : 'Без категории';
                                
                                return `
                                    <tr>
                                        <td>${product.name}</td>
                                        <td>${categoryName}</td>
                                        <td>${Storage.formatPrice(product.price)}</td>
                                        <td>${product.stock} шт.</td>
                                        <td>
                                            <div class="table-actions">
                                                <button class="action-btn action-edit" onclick="Admin.showEditProductModal(${product.id})">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                                <button class="action-btn action-delete" onclick="Admin.deleteProduct(${product.id})">
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                `}
            </div>
        `;
    },

    // Показать модальное окно добавления товара
    showAddProductModal() {
        const categories = Categories.getCategoriesForSelect();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Добавить товар</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <form id="add-product-form" class="admin-form">
                    <div class="form-group">
                        <label class="form-label" for="product-name">Название товара *</label>
                        <input type="text" id="product-name" class="form-input" 
                               placeholder="Например: Холодильник Samsung" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="product-category">Категория *</label>
                        <select id="product-category" class="form-input" required>
                            <option value="">Выберите категорию</option>
                            ${categories.map(cat => `
                                <option value="${cat.id}">${cat.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="product-price">Цена *</label>
                            <input type="number" id="product-price" class="form-input" 
                                   min="0" step="1" placeholder="Например: 45999" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="product-stock">Количество на складе *</label>
                            <input type="number" id="product-stock" class="form-input" 
                                   min="0" step="1" value="10" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="product-description">Описание</label>
                        <textarea id="product-description" class="form-input" 
                                  rows="4" placeholder="Описание товара..."></textarea>
                    </div>
                    
                    <div class="auth-actions" style="margin-top: 30px;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Отмена
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Добавить товар
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('add-product-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addProduct();
        });
    },

    // Добавление товара
    addProduct() {
        const name = document.getElementById('product-name').value.trim();
        const categoryId = document.getElementById('product-category').value;
        const price = parseInt(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const description = document.getElementById('product-description').value.trim();
        
        if (!name || !categoryId || !price || price < 0 || stock < 0) {
            alert('Заполните все обязательные поля корректно');
            return;
        }
        
        const product = {
            categoryId: categoryId,
            name: name,
            description: description,
            price: price,
            stock: stock
        };
        
        Storage.saveProduct(product);
        this.renderProducts();
        
        // Закрываем модальное окно
        document.querySelector('.modal.active').remove();
        
        // Показываем сообщение об успехе
        this.showMessage('Товар успешно добавлен', 'success');
    },

    // Показать модальное окно редактирования товара
    showEditProductModal(productId) {
        const product = Products.getProductById(productId);
        if (!product) return;
        
        const categories = Categories.getCategoriesForSelect();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Редактировать товар</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <form id="edit-product-form" class="admin-form">
                    <input type="hidden" id="edit-product-id" value="${product.id}">
                    
                    <div class="form-group">
                        <label class="form-label" for="edit-product-name">Название товара *</label>
                        <input type="text" id="edit-product-name" class="form-input" 
                               value="${product.name}" required>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="edit-product-category">Категория *</label>
                        <select id="edit-product-category" class="form-input" required>
                            <option value="">Выберите категорию</option>
                            ${categories.map(cat => `
                                <option value="${cat.id}" ${cat.id == product.categoryId ? 'selected' : ''}>${cat.name}</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label" for="edit-product-price">Цена *</label>
                            <input type="number" id="edit-product-price" class="form-input" 
                                   min="0" step="1" value="${product.price}" required>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="edit-product-stock">Количество на складе *</label>
                            <input type="number" id="edit-product-stock" class="form-input" 
                                   min="0" step="1" value="${product.stock}" required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label" for="edit-product-description">Описание</label>
                        <textarea id="edit-product-description" class="form-input" 
                                  rows="4">${product.description || ''}</textarea>
                    </div>
                    
                    <div class="auth-actions" style="margin-top: 30px;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Отмена
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Сохранить изменения
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        const form = document.getElementById('edit-product-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProduct();
        });
    },

    // Обновление товара
    updateProduct() {
        const id = document.getElementById('edit-product-id').value;
        const name = document.getElementById('edit-product-name').value.trim();
        const categoryId = document.getElementById('edit-product-category').value;
        const price = parseInt(document.getElementById('edit-product-price').value);
        const stock = parseInt(document.getElementById('edit-product-stock').value);
        const description = document.getElementById('edit-product-description').value.trim();
        
        if (!name || !categoryId || !price || price < 0 || stock < 0) {
            alert('Заполните все обязательные поля корректно');
            return;
        }
        
        const product = {
            id: id,
            categoryId: categoryId,
            name: name,
            description: description,
            price: price,
            stock: stock
        };
        
        Storage.saveProduct(product);
        this.renderProducts();
        
        // Закрываем модальное окно
        document.querySelector('.modal.active').remove();
        
        // Показываем сообщение об успехе
        this.showMessage('Товар успешно обновлен', 'success');
    },

    // Удаление товара
    deleteProduct(productId) {
        if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
            return;
        }
        
        // Проверяем, есть ли этот товар в заказах
        const orders = Orders.getAllOrders();
        const isInOrders = orders.some(order => 
            order.items.some(item => item.productId == productId)
        );
        
        if (isInOrders) {
            alert('Нельзя удалить товар, который есть в заказах');
            return;
        }
        
        Storage.deleteProduct(productId);
        this.renderProducts();
        
        // Показываем сообщение об успехе
        this.showMessage('Товар успешно удален', 'success');
    },

    // Отрисовка заказов
    renderOrders() {
        const orders = Orders.getAllOrders();
        
        const sectionsContainer = document.getElementById('admin-sections');
        sectionsContainer.innerHTML = `
            <div class="admin-section active" id="orders-section">
                <div class="admin-section-header">
                    <h2 class="admin-section-title">Управление заказами</h2>
                    <div style="font-size: 14px; color: #7f8c8d;">
                        Всего заказов: ${orders.length}
                    </div>
                </div>
                
                ${orders.length === 0 ? `
                    <div style="text-align: center; padding: 40px 20px; background-color: #f8f9fa; border-radius: 10px;">
                        <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <h3 style="color: #7f8c8d; margin-bottom: 10px;">Заказов нет</h3>
                        <p style="color: #95a5a6;">Клиенты еще не оформили заказы</p>
                    </div>
                ` : `
                    <table class="admin-table">
                        <thead>
                            <tr>
                                <th>Номер заказа</th>
                                <th>Клиент</th>
                                <th>Сумма</th>
                                <th>Статус</th>
                                <th>Дата</th>
                                <th>Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${orders.map(order => {
                                const orderDate = new Date(order.createdAt).toLocaleDateString('ru-RU');
                                const statusText = Orders.getOrderStatusText(order.status);
                                const statusClass = Orders.getOrderStatusClass(order.status);
                                
                                return `
                                    <tr>
                                        <td>#${order.id.substring(0, 8)}</td>
                                        <td>
                                            <div>${order.userName}</div>
                                            <div style="font-size: 12px; color: #7f8c8d;">ID: ${order.userId}</div>
                                        </td>
                                        <td>${Storage.formatPrice(order.total)}</td>
                                        <td>
                                            <span class="status-badge ${statusClass}">${statusText}</span>
                                        </td>
                                        <td>${orderDate}</td>
                                        <td>
                                            <div class="table-actions">
                                                <button class="action-btn action-view" onclick="Admin.viewOrderDetails('${order.id}')">
                                                    <i class="fas fa-eye"></i>
                                                </button>
                                                <button class="action-btn action-edit" onclick="Admin.showChangeStatusModal('${order.id}')">
                                                    <i class="fas fa-edit"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                `}
            </div>
        `;
    },

    // Просмотр деталей заказа в админке
    viewOrderDetails(orderId) {
        const order = Orders.getOrderById(orderId);
        if (!order) return;
        
        const orderDate = new Date(order.createdAt).toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Заказ #${order.id.substring(0, 8)}</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <div>
                            <div style="font-size: 14px; color: #7f8c8d;">Дата оформления</div>
                            <div style="font-weight: 600;">${orderDate}</div>
                        </div>
                        <div>
                            <span class="status-badge ${Orders.getOrderStatusClass(order.status)}" style="font-size: 14px;">
                                ${Orders.getOrderStatusText(order.status)}
                            </span>
                        </div>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">Информация о покупателе</div>
                        <div><strong>ФИО:</strong> ${order.userName}</div>
                        <div><strong>Телефон:</strong> ${order.userPhone}</div>
                        <div><strong>Адрес доставки:</strong> ${order.userAddress}</div>
                        <div><strong>ID пользователя:</strong> ${order.userId}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 25px;">
                    <h4 style="margin-bottom: 10px;">Состав заказа:</h4>
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
                
                <div class="auth-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                    <button class="btn btn-primary" onclick="Admin.showChangeStatusModal('${order.id}'); this.closest('.modal').remove()">
                        <i class="fas fa-edit"></i> Изменить статус
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Показать модальное окно изменения статуса заказа
    showChangeStatusModal(orderId) {
        const order = Orders.getOrderById(orderId);
        if (!order) return;
        
        const currentStatus = order.status;
        const validTransitions = {
            'processing': ['confirmed', 'cancelled'],
            'confirmed': ['onway', 'cancelled'],
            'onway': ['delivered', 'cancelled'],
            'delivered': [],
            'cancelled': []
        };
        
        const availableStatuses = validTransitions[currentStatus];
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title">Изменение статуса заказа</h2>
                    <button class="modal-close" onclick="this.closest('.modal').remove()">&times;</button>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <p><strong>Текущий статус:</strong> 
                        <span class="status-badge ${Orders.getOrderStatusClass(currentStatus)}">
                            ${Orders.getOrderStatusText(currentStatus)}
                        </span>
                    </p>
                    <p style="margin-top: 10px;">Заказ #${order.id.substring(0, 8)}</p>
                </div>
                
                <form id="change-status-form" class="admin-form">
                    <input type="hidden" id="change-status-order-id" value="${orderId}">
                    
                    <div class="form-group">
                        <label class="form-label" for="new-status">Новый статус *</label>
                        <select id="new-status" class="form-input" required>
                            <option value="">Выберите новый статус</option>
                            ${availableStatuses.map(status => {
                                const statusText = Orders.getOrderStatusText(status);
                                return `<option value="${status}">${statusText}</option>`;
                            }).join('')}
                        </select>
                        ${availableStatuses.length === 0 ? `
                            <p style="color: #e74c3c; margin-top: 10px;">
                                Статус этого заказа нельзя изменить
                            </p>
                        ` : ''}
                    </div>
                    
                    <div class="auth-actions" style="margin-top: 30px;">
                        <button type="button" class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                            <i class="fas fa-times"></i> Отмена
                        </button>
                        ${availableStatuses.length > 0 ? `
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-save"></i> Сохранить статус
                            </button>
                        ` : ''}
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        if (availableStatuses.length > 0) {
            const form = document.getElementById('change-status-form');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.changeOrderStatus();
            });
        }
    },

    // Изменение статуса заказа
    changeOrderStatus() {
        const orderId = document.getElementById('change-status-order-id').value;
        const newStatus = document.getElementById('new-status').value;
        
        if (!newStatus) {
            alert('Выберите новый статус');
            return;
        }
        
        const result = Orders.updateOrderStatus(orderId, newStatus);
        
        if (result.success) {
            this.renderOrders();
            document.querySelector('.modal.active').remove();
            this.showMessage(result.message, 'success');
        } else {
            alert(result.message);
        }
    },

    // Показать сообщение
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `admin-message admin-message-${type}`;
        messageDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
        `;
        
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
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }
};