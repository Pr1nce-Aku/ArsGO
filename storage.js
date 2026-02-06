// Модуль для работы с localStorage (имитация базы данных)

const Storage = {
    // Ключи для хранения данных
    KEYS: {
        USERS: 'delivery_app_users',
        CURRENT_USER: 'delivery_app_current_user',
        PRODUCTS: 'delivery_app_products',
        CATEGORIES: 'delivery_app_categories',
        CART: 'delivery_app_cart',
        ORDERS: 'delivery_app_orders',
        ADMIN_CREDENTIALS: 'delivery_app_admin_credentials'
    },

    // Инициализация хранилища с начальными данными
    init() {
        // Проверяем, инициализировано ли хранилище
        if (!localStorage.getItem('delivery_app_initialized')) {
            this.setupInitialData();
            localStorage.setItem('delivery_app_initialized', 'true');
        }
        
        // Проверяем наличие текущего пользователя
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            console.log(`Текущий пользователь: ${currentUser.name} (ID: ${currentUser.id})`);
        }
        
        console.log('Хранилище инициализировано');
    },

    // Настройка начальных данных
    setupInitialData() {
        // Данные администратора по умолчанию
        const adminCredentials = {
            login: 'admin',
            password: 'admin123'
        };
        localStorage.setItem(this.KEYS.ADMIN_CREDENTIALS, JSON.stringify(adminCredentials));

        // Начальные категории
        const initialCategories = [
            { id: 1, name: 'Холодильники', icon: 'snowflake' },
            { id: 2, name: 'Пылесосы', icon: 'wind' },
            { id: 3, name: 'Телевизоры', icon: 'tv' },
            { id: 4, name: 'Стиральные машины', icon: 'tshirt' },
            { id: 5, name: 'Микроволновки', icon: 'temperature-high' },
            { id: 6, name: 'Кофемашины', icon: 'coffee' }
        ];
        localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(initialCategories));

        // Начальные товары
        const initialProducts = [
            {
                id: 1,
                categoryId: 1,
                name: 'Холодильник Samsung RB37',
                description: 'Двухкамерный холодильник с системой No Frost',
                price: 45999,
                image: 'fridge1.jpg',
                stock: 10
            },
            {
                id: 2,
                categoryId: 1,
                name: 'Холодильник LG GA-B459',
                description: 'Энергоэффективный холодильник с инверторным компрессором',
                price: 52999,
                image: 'fridge2.jpg',
                stock: 7
            },
            {
                id: 3,
                categoryId: 2,
                name: 'Пылесос Dyson V11',
                description: 'Беспроводной пылесос с продвинутой системой фильтрации',
                price: 39999,
                image: 'vacuum1.jpg',
                stock: 15
            },
            {
                id: 4,
                categoryId: 2,
                name: 'Пылесос Samsung Jet 90',
                description: 'Мощный пылесос с турбощёткой',
                price: 29999,
                image: 'vacuum2.jpg',
                stock: 12
            },
            {
                id: 5,
                categoryId: 3,
                name: 'Телевизор LG OLED 55"',
                description: 'OLED телевизор с поддержкой 4K HDR',
                price: 89999,
                image: 'tv1.jpg',
                stock: 5
            },
            {
                id: 6,
                categoryId: 3,
                name: 'Телевизор Samsung QLED 65"',
                description: 'QLED телевизор с технологией Quantum Dot',
                price: 109999,
                image: 'tv2.jpg',
                stock: 3
            },
            {
                id: 7,
                categoryId: 4,
                name: 'Стиральная машина Bosch',
                description: 'Стиральная машина с загрузкой 7 кг и прямым приводом',
                price: 34999,
                image: 'washer1.jpg',
                stock: 8
            },
            {
                id: 8,
                categoryId: 4,
                name: 'Стиральная машина LG F2J3',
                description: 'Стиральная машина с парогом и сушкой',
                price: 54999,
                image: 'washer2.jpg',
                stock: 6
            }
        ];
        localStorage.setItem(this.KEYS.PRODUCTS, JSON.stringify(initialProducts));

        // Пустые массивы для пользователей, корзин и заказов
        localStorage.setItem(this.KEYS.USERS, JSON.stringify([]));
        localStorage.setItem(this.KEYS.CART, JSON.stringify([]));
        localStorage.setItem(this.KEYS.ORDERS, JSON.stringify([]));

        console.log('Начальные данные загружены');
    },

    // Генерация уникального ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Генерация 6-значного ID пользователя
    generateUserId() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    // Получение данных из localStorage
    getItem(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    // Сохранение данных в localStorage
    setItem(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // Работа с пользователями
    getUsers() {
        return this.getItem(this.KEYS.USERS) || [];
    },

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    },

    saveUser(user) {
        const users = this.getUsers();
        
        // Проверяем, нет ли уже пользователя с таким устройством
        const existingUser = users.find(u => u.deviceId === user.deviceId);
        if (existingUser) {
            throw new Error('Пользователь с этого устройства уже зарегистрирован');
        }
        
        users.push(user);
        this.setItem(this.KEYS.USERS, users);
        return user;
    },

    // Текущий пользователь
    getCurrentUser() {
        return this.getItem(this.KEYS.CURRENT_USER);
    },

    setCurrentUser(user) {
        this.setItem(this.KEYS.CURRENT_USER, user);
    },

    clearCurrentUser() {
        localStorage.removeItem(this.KEYS.CURRENT_USER);
    },

    // Работа с товарами
    getProducts() {
        return this.getItem(this.KEYS.PRODUCTS) || [];
    },

    getProductById(id) {
        const products = this.getProducts();
        return products.find(product => product.id == id);
    },

    saveProduct(product) {
        const products = this.getProducts();
        
        if (product.id) {
            // Обновление существующего товара
            const index = products.findIndex(p => p.id == product.id);
            if (index !== -1) {
                products[index] = product;
            }
        } else {
            // Добавление нового товара
            product.id = this.generateId();
            product.stock = product.stock || 10;
            products.push(product);
        }
        
        this.setItem(this.KEYS.PRODUCTS, products);
        return product;
    },

    deleteProduct(id) {
        const products = this.getProducts();
        const filteredProducts = products.filter(product => product.id != id);
        this.setItem(this.KEYS.PRODUCTS, filteredProducts);
        return true;
    },

    // Работа с категориями
    getCategories() {
        return this.getItem(this.KEYS.CATEGORIES) || [];
    },

    getCategoryById(id) {
        const categories = this.getCategories();
        return categories.find(category => category.id == id);
    },

    saveCategory(category) {
        const categories = this.getCategories();
        
        if (category.id) {
            // Обновление существующей категории
            const index = categories.findIndex(c => c.id == category.id);
            if (index !== -1) {
                categories[index] = category;
            }
        } else {
            // Добавление новой категории
            category.id = this.generateId();
            categories.push(category);
        }
        
        this.setItem(this.KEYS.CATEGORIES, categories);
        return category;
    },

    deleteCategory(id) {
        const categories = this.getCategories();
        const filteredCategories = categories.filter(category => category.id != id);
        this.setItem(this.KEYS.CATEGORIES, filteredCategories);
        return true;
    },

    // Работа с корзиной
    getCart() {
        return this.getItem(this.KEYS.CART) || [];
    },

    addToCart(productId, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.productId == productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                productId,
                quantity,
                addedAt: new Date().toISOString()
            });
        }
        
        this.setItem(this.KEYS.CART, cart);
        return cart;
    },

    updateCartItem(productId, quantity) {
        const cart = this.getCart();
        const itemIndex = cart.findIndex(item => item.productId == productId);
        
        if (itemIndex !== -1) {
            if (quantity <= 0) {
                cart.splice(itemIndex, 1);
            } else {
                cart[itemIndex].quantity = quantity;
            }
            
            this.setItem(this.KEYS.CART, cart);
        }
        
        return cart;
    },

    removeFromCart(productId) {
        const cart = this.getCart();
        const filteredCart = cart.filter(item => item.productId != productId);
        this.setItem(this.KEYS.CART, filteredCart);
        return filteredCart;
    },

    clearCart() {
        this.setItem(this.KEYS.CART, []);
        return [];
    },

    // Работа с заказами
    getOrders() {
        return this.getItem(this.KEYS.ORDERS) || [];
    },

    getOrdersByUserId(userId) {
        const orders = this.getOrders();
        return orders.filter(order => order.userId === userId);
    },

    saveOrder(order) {
        const orders = this.getOrders();
        
        if (!order.id) {
            order.id = this.generateId();
            order.createdAt = new Date().toISOString();
            order.status = 'processing'; // В обработке
        }
        
        orders.push(order);
        this.setItem(this.KEYS.ORDERS, orders);
        return order;
    },

    updateOrderStatus(orderId, status) {
        const orders = this.getOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);
        
        if (orderIndex !== -1) {
            orders[orderIndex].status = status;
            orders[orderIndex].updatedAt = new Date().toISOString();
            this.setItem(this.KEYS.ORDERS, orders);
            return orders[orderIndex];
        }
        
        return null;
    },

    // Администратор
    checkAdminCredentials(login, password) {
        const credentials = this.getItem(this.KEYS.ADMIN_CREDENTIALS);
        return credentials && credentials.login === login && credentials.password === password;
    },

    // Утилиты
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    },

    // Очистка всех данных (для тестирования)
    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            localStorage.removeItem(key);
        });
        localStorage.removeItem('delivery_app_initialized');
        console.log('Все данные очищены');
    }
};

// Экспорт для использования в других модулях
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Storage;
}