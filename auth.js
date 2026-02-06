// Модуль для работы с аутентификацией и регистрацией

const Auth = {
    // Инициализация модуля
    init() {
        this.bindEvents();
        this.checkExistingUser();
        console.log('Модуль Auth инициализирован');
    },

    // Проверка существующего пользователя
    checkExistingUser() {
        const currentUser = Storage.getCurrentUser();
        if (currentUser) {
            this.showUserInterface(currentUser);
        } else {
            this.showStartScreen();
        }
    },

    // Показать стартовый экран
    showStartScreen() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-screen active fade-in">
                <div class="auth-container">
                    <div class="auth-header">
                        <div class="auth-logo">
                            <i class="fas fa-box-open"></i>
                        </div>
                        <h1 class="auth-title">Сервис доставки бытовой техники</h1>
                        <p class="auth-subtitle">Учебный проект - магазин бытовой техники</p>
                    </div>
                    
                    <div class="role-selector">
                        <div class="role-card" id="client-role">
                            <div class="role-icon">
                                <i class="fas fa-user"></i>
                            </div>
                            <div class="role-title">Клиент</div>
                            <p>Покупка товаров, оформление заказов</p>
                        </div>
                        
                        <div class="role-card" id="admin-role">
                            <div class="role-icon">
                                <i class="fas fa-cogs"></i>
                            </div>
                            <div class="role-title">Администратор</div>
                            <p>Управление товарами и заказами</p>
                        </div>
                    </div>
                    
                    <div id="role-content">
                        <!-- Контент будет подгружен в зависимости от выбора -->
                    </div>
                </div>
            </div>
        `;
        
        this.bindStartScreenEvents();
    },

    // Привязка событий на стартовом экране
    bindStartScreenEvents() {
        const clientRole = document.getElementById('client-role');
        const adminRole = document.getElementById('admin-role');
        
        clientRole.addEventListener('click', () => {
            this.selectRole('client');
        });
        
        adminRole.addEventListener('click', () => {
            this.selectRole('admin');
        });
    },

    // Выбор роли
    selectRole(role) {
        const clientRole = document.getElementById('client-role');
        const adminRole = document.getElementById('admin-role');
        const roleContent = document.getElementById('role-content');
        
        // Сброс выбора
        clientRole.classList.remove('selected');
        adminRole.classList.remove('selected');
        
        if (role === 'client') {
            clientRole.classList.add('selected');
            roleContent.innerHTML = `
                <div class="auth-actions">
                    <button class="btn btn-primary" id="register-btn">
                        <i class="fas fa-user-plus"></i> Регистрация
                    </button>
                    <p class="auth-link">
                        Уже зарегистрированы? <a href="#" id="login-link">Войти по ID</a>
                    </p>
                </div>
            `;
            
            document.getElementById('register-btn').addEventListener('click', () => {
                this.showRegistrationForm();
            });
            
            document.getElementById('login-link').addEventListener('click', (e) => {
                e.preventDefault();
                this.showLoginForm();
            });
        } else if (role === 'admin') {
            adminRole.classList.add('selected');
            roleContent.innerHTML = `
                <div class="auth-actions">
                    <button class="btn" id="admin-login-btn">
                        <i class="fas fa-sign-in-alt"></i> Вход для администратора
                    </button>
                </div>
            `;
            
            document.getElementById('admin-login-btn').addEventListener('click', () => {
                this.showAdminLoginForm();
            });
        }
    },

    // Показать форму регистрации
    showRegistrationForm() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-screen active fade-in">
                <div class="auth-container">
                    <button class="back-button" id="back-to-start">
                        <i class="fas fa-arrow-left"></i> Назад
                    </button>
                    
                    <div class="auth-header">
                        <div class="auth-logo">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <h1 class="auth-title">Регистрация клиента</h1>
                        <p class="auth-subtitle">Заполните форму для создания аккаунта</p>
                    </div>
                    
                    <form id="registration-form" class="auth-form">
                        <div class="form-group">
                            <label class="form-label" for="fullName">ФИО *</label>
                            <input type="text" id="fullName" class="form-input" 
                                   placeholder="Иванов Иван Иванович" required>
                            <div class="form-error" id="fullName-error"></div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="phone">Номер телефона *</label>
                            <input type="tel" id="phone" class="form-input" 
                                   placeholder="+7 (999) 123-45-67" required>
                            <div class="form-error" id="phone-error"></div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="address">Адрес доставки *</label>
                            <input type="text" id="address" class="form-input" 
                                   placeholder="г. Москва, ул. Примерная, д. 1, кв. 1" required>
                            <div class="form-error" id="address-error"></div>
                        </div>
                        
                        <div class="info-block" style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                            <p style="margin: 0; font-size: 14px; color: #2c3e50;">
                                <i class="fas fa-info-circle"></i> После регистрации будет сгенерирован уникальный ID пользователя из 6 цифр, который привязывается к устройству.
                            </p>
                        </div>
                        
                        <div class="auth-actions">
                            <button type="submit" class="btn btn-primary" id="submit-registration">
                                <i class="fas fa-check"></i> Зарегистрироваться
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        this.bindRegistrationFormEvents();
    },

    // Привязка событий формы регистрации
    bindRegistrationFormEvents() {
        const form = document.getElementById('registration-form');
        const backButton = document.getElementById('back-to-start');
        
        backButton.addEventListener('click', () => {
            this.showStartScreen();
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.registerUser();
        });
    },

    // Регистрация пользователя
    registerUser() {
        // Получаем данные из формы
        const fullName = document.getElementById('fullName').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        
        // Валидация
        let isValid = true;
        
        if (!fullName) {
            this.showError('fullName-error', 'Введите ФИО');
            isValid = false;
        } else {
            this.hideError('fullName-error');
        }
        
        if (!phone) {
            this.showError('phone-error', 'Введите номер телефона');
            isValid = false;
        } else {
            this.hideError('phone-error');
        }
        
        if (!address) {
            this.showError('address-error', 'Введите адрес доставки');
            isValid = false;
        } else {
            this.hideError('address-error');
        }
        
        if (!isValid) return;
        
        try {
            // Создаем пользователя
            const userId = Storage.generateUserId();
            const deviceId = this.getDeviceId();
            
            const user = {
                id: userId,
                deviceId: deviceId,
                name: fullName,
                phone: phone,
                address: address,
                registeredAt: new Date().toISOString(),
                role: 'client'
            };
            
            // Сохраняем пользователя
            Storage.saveUser(user);
            Storage.setCurrentUser(user);
            
            // Показываем успешную регистрацию
            this.showRegistrationSuccess(user);
            
        } catch (error) {
            alert('Ошибка регистрации: ' + error.message);
        }
    },

    // Показать успешную регистрацию
    showRegistrationSuccess(user) {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-screen active fade-in">
                <div class="auth-container">
                    <div class="auth-header">
                        <div class="auth-logo" style="color: #2ecc71;">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h1 class="auth-title">Регистрация успешна!</h1>
                        <p class="auth-subtitle">Ваш аккаунт создан</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <div style="font-size: 48px; color: #3498db; margin-bottom: 15px;">
                            <i class="fas fa-id-card"></i>
                        </div>
                        <h3 style="color: #2c3e50; margin-bottom: 10px;">Ваш ID пользователя:</h3>
                        <div style="font-size: 32px; font-weight: 700; color: #e74c3c; margin-bottom: 20px;">
                            ${user.id}
                        </div>
                        <p style="color: #7f8c8d; margin-bottom: 20px;">
                            Запомните этот номер. Он потребуется для входа в систему.
                        </p>
                    </div>
                    
                    <div class="info-block" style="background-color: #f0f8ff; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #2c3e50; margin-bottom: 10px;">Данные вашего профиля:</h4>
                        <p><strong>ФИО:</strong> ${user.name}</p>
                        <p><strong>Телефон:</strong> ${user.phone}</p>
                        <p><strong>Адрес:</strong> ${user.address}</p>
                    </div>
                    
                    <div class="auth-actions">
                        <button class="btn btn-primary" id="go-to-main">
                            <i class="fas fa-home"></i> Перейти в магазин
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('go-to-main').addEventListener('click', () => {
            this.showUserInterface(user);
        });
    },

    // Показать форму входа по ID
    showLoginForm() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-screen active fade-in">
                <div class="auth-container">
                    <button class="back-button" id="back-to-start">
                        <i class="fas fa-arrow-left"></i> Назад
                    </button>
                    
                    <div class="auth-header">
                        <div class="auth-logo">
                            <i class="fas fa-sign-in-alt"></i>
                        </div>
                        <h1 class="auth-title">Вход по ID</h1>
                        <p class="auth-subtitle">Введите ваш ID пользователя</p>
                    </div>
                    
                    <form id="login-form" class="auth-form">
                        <div class="form-group">
                            <label class="form-label" for="userId">ID пользователя *</label>
                            <input type="text" id="userId" class="form-input" 
                                   placeholder="Введите 6-значный ID" required>
                            <div class="form-error" id="userId-error"></div>
                        </div>
                        
                        <div class="auth-actions">
                            <button type="submit" class="btn btn-primary" id="submit-login">
                                <i class="fas fa-sign-in-alt"></i> Войти
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        this.bindLoginFormEvents();
    },

    // Привязка событий формы входа
    bindLoginFormEvents() {
        const form = document.getElementById('login-form');
        const backButton = document.getElementById('back-to-start');
        
        backButton.addEventListener('click', () => {
            this.showStartScreen();
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginUser();
        });
    },

    // Вход пользователя
    loginUser() {
        const userId = document.getElementById('userId').value.trim();
        
        if (!userId) {
            this.showError('userId-error', 'Введите ID пользователя');
            return;
        }
        
        const user = Storage.getUserById(userId);
        
        if (!user) {
            this.showError('userId-error', 'Пользователь с таким ID не найден');
            return;
        }
        
        // Проверяем, совпадает ли deviceId
        const currentDeviceId = this.getDeviceId();
        if (user.deviceId !== currentDeviceId) {
            alert('Доступ запрещен. Этот ID привязан к другому устройству.');
            return;
        }
        
        // Успешный вход
        Storage.setCurrentUser(user);
        this.showUserInterface(user);
    },

    // Показать форму входа администратора
    showAdminLoginForm() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="auth-screen active fade-in">
                <div class="auth-container">
                    <button class="back-button" id="back-to-start">
                        <i class="fas fa-arrow-left"></i> Назад
                    </button>
                    
                    <div class="auth-header">
                        <div class="auth-logo">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <h1 class="auth-title">Вход администратора</h1>
                        <p class="auth-subtitle">Требуется авторизация</p>
                    </div>
                    
                    <div class="info-block" style="background-color: #fff8e1; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #2c3e50; margin-bottom: 10px;">Учебный проект</h4>
                        <p style="margin: 0; font-size: 14px; color: #2c3e50;">
                            Данные администратора заданы в коде приложения. Для входа используйте:<br>
                            <strong>Логин:</strong> admin<br>
                            <strong>Пароль:</strong> admin123
                        </p>
                    </div>
                    
                    <form id="admin-login-form" class="auth-form">
                        <div class="form-group">
                            <label class="form-label" for="admin-login">Логин *</label>
                            <input type="text" id="admin-login" class="form-input" 
                                   placeholder="Введите логин" required>
                            <div class="form-error" id="admin-login-error"></div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label" for="admin-password">Пароль *</label>
                            <input type="password" id="admin-password" class="form-input" 
                                   placeholder="Введите пароль" required>
                            <div class="form-error" id="admin-password-error"></div>
                        </div>
                        
                        <div class="auth-actions">
                            <button type="submit" class="btn" id="submit-admin-login">
                                <i class="fas fa-sign-in-alt"></i> Войти как администратор
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        this.bindAdminLoginFormEvents();
    },

    // Привязка событий формы входа администратора
    bindAdminLoginFormEvents() {
        const form = document.getElementById('admin-login-form');
        const backButton = document.getElementById('back-to-start');
        
        backButton.addEventListener('click', () => {
            this.showStartScreen();
        });
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.loginAdmin();
        });
    },

    // Вход администратора
    loginAdmin() {
        const login = document.getElementById('admin-login').value.trim();
        const password = document.getElementById('admin-password').value.trim();
        
        let isValid = true;
        
        if (!login) {
            this.showError('admin-login-error', 'Введите логин');
            isValid = false;
        } else {
            this.hideError('admin-login-error');
        }
        
        if (!password) {
            this.showError('admin-password-error', 'Введите пароль');
            isValid = false;
        } else {
            this.hideError('admin-password-error');
        }
        
        if (!isValid) return;
        
        // Проверяем credentials
        if (Storage.checkAdminCredentials(login, password)) {
            // Создаем объект администратора
            const adminUser = {
                id: 'admin',
                name: 'Администратор',
                role: 'admin',
                loggedInAt: new Date().toISOString()
            };
            
            Storage.setCurrentUser(adminUser);
            this.showAdminInterface();
        } else {
            alert('Неверный логин или пароль');
        }
    },

    // Показать интерфейс пользователя
    showUserInterface(user) {
        // Загружаем основной интерфейс магазина
        App.init();
    },

    // Показать интерфейс администратора
    showAdminInterface() {
        // Загружаем интерфейс администратора
        Admin.init();
    },

    // Выход из системы
    logout() {
        Storage.clearCurrentUser();
        Storage.clearCart(); // Очищаем корзину при выходе
        this.showStartScreen();
    },

    // Получение ID устройства (упрощенная версия)
    getDeviceId() {
        // Используем комбинацию userAgent и других данных
        // В реальном приложении нужно использовать более надежный метод
        let deviceId = localStorage.getItem('device_id');
        
        if (!deviceId) {
            deviceId = 'device_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('device_id', deviceId);
        }
        
        return deviceId;
    },

    // Утилиты для отображения ошибок
    showError(elementId, message) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    },

    hideError(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            element.style.display = 'none';
        }
    },

    // Привязка всех событий
    bindEvents() {
        // Общие события будут добавлены позже
    }
};