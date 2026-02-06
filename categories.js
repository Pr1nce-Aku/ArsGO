// Модуль для работы с категориями

const Categories = {
    // Инициализация модуля
    init() {
        console.log('Модуль Categories инициализирован');
    },

    // Получение всех категорий
    getAllCategories() {
        return Storage.getCategories();
    },

    // Получение категории по ID
    getCategoryById(id) {
        return Storage.getCategoryById(id);
    },

    // Отображение всех категорий
    renderCategories() {
        const categories = this.getAllCategories();
        const container = document.getElementById('products-container');
        
        if (!container) return;
        
        let html = `
            <div style="margin-bottom: 25px;">
                <h2>Каталог товаров</h2>
                <p style="color: #7f8c8d;">Выберите категорию для просмотра товаров</p>
            </div>
        `;
        
        if (categories.length === 0) {
            html += `
                <div style="text-align: center; padding: 40px 20px; background-color: #f8f9fa; border-radius: 10px;">
                    <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">
                        <i class="fas fa-folder-open"></i>
                    </div>
                    <h3 style="color: #7f8c8d; margin-bottom: 10px;">Категории не найдены</h3>
                    <p style="color: #95a5a6;">Администратор еще не создал категории</p>
                </div>
            `;
        } else {
            html += '<div class="categories-grid">';
            
            categories.forEach(category => {
                const iconClass = this.getIconClass(category.icon);
                const productCount = Products.getProductsByCategory(category.id).length;
                
                html += `
                    <div class="category-card" onclick="Categories.showCategoryProducts(${category.id})">
                        <div class="category-icon">
                            <i class="fas ${iconClass}"></i>
                        </div>
                        <div style="font-weight: 600; margin-bottom: 5px;">${category.name}</div>
                        <div style="font-size: 12px; color: #7f8c8d;">
                            ${productCount} товаров
                        </div>
                    </div>
                `;
            });
            
            html += '</div>';
        }
        
        container.innerHTML = html;
    },

    // Показать товары категории
    showCategoryProducts(categoryId) {
        Products.renderProductsByCategory(categoryId);
    },

    // Получение класса иконки
    getIconClass(iconName) {
        const iconMap = {
            'snowflake': 'fa-snowflake',
            'wind': 'fa-wind',
            'tv': 'fa-tv',
            'tshirt': 'fa-tshirt',
            'temperature-high': 'fa-temperature-high',
            'coffee': 'fa-coffee'
        };
        
        return iconMap[iconName] || 'fa-box';
    },

    // Получение списка категорий для селекта
    getCategoriesForSelect() {
        const categories = this.getAllCategories();
        return categories.map(category => ({
            id: category.id,
            name: category.name
        }));
    },

    // Добавление новой категории (для администратора)
    addCategory(name, icon = 'box') {
        const newCategory = {
            name: name,
            icon: icon
        };
        
        return Storage.saveCategory(newCategory);
    },

    // Обновление категории
    updateCategory(id, name, icon) {
        const category = this.getCategoryById(id);
        if (!category) return null;
        
        category.name = name;
        category.icon = icon;
        
        return Storage.saveCategory(category);
    },

    // Удаление категории
    deleteCategory(id) {
        // Проверяем, есть ли товары в этой категории
        const productsInCategory = Products.getProductsByCategory(id);
        if (productsInCategory.length > 0) {
            return {
                success: false,
                message: 'Нельзя удалить категорию, в которой есть товары'
            };
        }
        
        const result = Storage.deleteCategory(id);
        return {
            success: result,
            message: result ? 'Категория удалена' : 'Ошибка удаления категории'
        };
    }
};