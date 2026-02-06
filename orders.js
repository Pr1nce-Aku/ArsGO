// Модуль для работы с заказами

const Orders = {
    // Инициализация модуля
    init() {
        console.log('Модуль Orders инициализирован');
    },

    // Получение всех заказов
    getAllOrders() {
        return Storage.getOrders();
    },

    // Получение заказов пользователя
    getUserOrders(userId) {
        return Storage.getOrdersByUserId(userId);
    },

    // Получение заказа по ID
    getOrderById(orderId) {
        const orders = this.getAllOrders();
        return orders.find(order => order.id === orderId);
    },

    // Получение статуса заказа в читаемом виде
    getOrderStatusText(status) {
        const statusMap = {
            'processing': 'В обработке',
            'confirmed': 'Подтверждён',
            'onway': 'В пути',
            'delivered': 'Доставлен',
            'cancelled': 'Отказано'
        };
        
        return statusMap[status] || status;
    },

    // Получение класса для статуса
    getOrderStatusClass(status) {
        const statusClassMap = {
            'processing': 'status-processing',
            'confirmed': 'status-confirmed',
            'onway': 'status-onway',
            'delivered': 'status-delivered',
            'cancelled': 'status-cancelled'
        };
        
        return statusClassMap[status] || 'status-processing';
    },

    // Отображение заказов пользователя
    renderUserOrders() {
        const user = Storage.getCurrentUser();
        if (!user || user.role !== 'client') {
            return;
        }
        
        const orders = this.getUserOrders(user.id);
        const container = document.getElementById('orders-list');
        const statsContainer = document.getElementById('orders-stats');
        
        if (!container) return;
        
        // Статистика заказов
        if (statsContainer) {
            const processingCount = orders.filter(o => o.status === 'processing').length;
            const onwayCount = orders.filter(o => o.status === 'onway').length;
            const deliveredCount = orders.filter(o => o.status === 'delivered').length;
            const totalCount = orders.length;
            
            statsContainer.innerHTML = `
                <div class="admin-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-value">${processingCount}</div>
                        <div class="stat-label">В обработке</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-truck"></i>
                        </div>
                        <div class="stat-value">${onwayCount}</div>
                        <div class="stat-label">В пути</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <div class="stat-value">${deliveredCount}</div>
                        <div class="stat-label">Доставлено</div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-shopping-bag"></i>
                        </div>
                        <div class="stat-value">${totalCount}</div>
                        <div class="stat-label">Всего заказов</div>
                    </div>
                </div>
            `;
        }
        
        if (orders.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 40px 20px; background-color: #f8f9fa; border-radius: 10px;">
                    <div style="font-size: 48px; color: #ddd; margin-bottom: 15px;">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h3 style="color: #7f8c8d; margin-bottom: 10px;">Заказов нет</h3>
                    <p style="color: #95a5a6;">У вас еще нет оформленных заказов</p>
                    <button class="btn btn-primary" onclick="App.showScreen('main')" style="margin-top: 20px;">
                        <i class="fas fa-shopping-cart"></i> Перейти к покупкам
                    </button>
                </div>
            `;
            return;
        }
        
        // Сортируем заказы по дате (новые сверху)
        orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        let html = '<div class="list-group">';
        
        orders.forEach(order => {
            const orderDate = new Date(order.createdAt).toLocaleDateString('ru-RU', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            
            html += `
                <div class="list-item" data-order-id="${order.id}">
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
                            <div>
                                <div style="font-weight: 600; margin-bottom: 5px;">Заказ #${order.id.substring(0, 8)}</div>
                                <div style="font-size: 12px; color: #7f8c8d;">${orderDate}</div>
                            </div>
                            <div>
                                <span class="status-badge ${this.getOrderStatusClass(order.status)}">
                                    ${this.getOrderStatusText(order.status)}
                                </span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 10px;">
                            <div style="font-size: 14px; color: #2c3e50;">
                                <strong>Сумма:</strong> ${Storage.formatPrice(order.total)}
                            </div>
                            <div style="font-size: 14px; color: #2c3e50;">
                                <strong>Товаров:</strong> ${order.items.reduce((sum, item) => sum + item.quantity, 0)} шт.
                            </div>
                        </div>
                        
                        <div class="product-actions">
                            <button class="btn btn-small" onclick="Orders.viewOrderDetails('${order.id}')">
                                <i class="fas fa-eye"></i> Подробнее
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
    },

    // Просмотр деталей заказа
    viewOrderDetails(orderId) {
        const order = this.getOrderById(orderId);
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
                            <span class="status-badge ${this.getOrderStatusClass(order.status)}" style="font-size: 14px;">
                                ${this.getOrderStatusText(order.status)}
                            </span>
                        </div>
                    </div>
                    
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="font-weight: 600; margin-bottom: 5px;">Информация о покупателе</div>
                        <div><strong>ФИО:</strong> ${order.userName}</div>
                        <div><strong>Телефон:</strong> ${order.userPhone}</div>
                        <div><strong>Адрес доставки:</strong> ${order.userAddress}</div>
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
                
                <div style="margin-bottom: 25px;">
                    <h4 style="margin-bottom: 10px;">История статусов:</h4>
                    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #f39c12;"></div>
                            <div>В обработке</div>
                            <div style="margin-left: auto; font-size: 12px; color: #7f8c8d;">
                                ${new Date(order.createdAt).toLocaleDateString('ru-RU')}
                            </div>
                        </div>
                        
                        ${order.status === 'cancelled' ? `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #e74c3c;"></div>
                                <div>Отказано</div>
                                <div style="margin-left: auto; font-size: 12px; color: #7f8c8d;">
                                    ${order.updatedAt ? new Date(order.updatedAt).toLocaleDateString('ru-RU') : ''}
                                </div>
                            </div>
                        ` : ''}
                        
                        ${['confirmed', 'onway', 'delivered'].includes(order.status) ? `
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #3498db;"></div>
                                <div>Подтверждён</div>
                            </div>
                        ` : ''}
                        
                        ${['onway', 'delivered'].includes(order.status) ? `
                            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #9b59b6;"></div>
                                <div>В пути</div>
                            </div>
                        ` : ''}
                        
                        ${order.status === 'delivered' ? `
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <div style="width: 12px; height: 12px; border-radius: 50%; background-color: #2ecc71;"></div>
                                <div>Доставлен</div>
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                <div class="auth-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i> Закрыть
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    },

    // Обновление статуса заказа (для администратора)
    updateOrderStatus(orderId, newStatus) {
        const order = this.getOrderById(orderId);
        if (!order) return false;
        
        // Проверяем допустимость смены статуса
        const validTransitions = {
            'processing': ['confirmed', 'cancelled'],
            'confirmed': ['onway', 'cancelled'],
            'onway': ['delivered', 'cancelled'],
            'delivered': [], // Дальнейшие изменения невозможны
            'cancelled': []  // Дальнейшие изменения невозможны
        };
        
        if (!validTransitions[order.status].includes(newStatus)) {
            return {
                success: false,
                message: `Невозможно сменить статус с "${this.getOrderStatusText(order.status)}" на "${this.getOrderStatusText(newStatus)}"`
            };
        }
        
        const updatedOrder = Storage.updateOrderStatus(orderId, newStatus);
        
        if (updatedOrder) {
            return {
                success: true,
                message: `Статус заказа изменен на "${this.getOrderStatusText(newStatus)}"`,
                order: updatedOrder
            };
        }
        
        return {
            success: false,
            message: 'Ошибка при обновлении статуса заказа'
        };
    },

    // Получение статистики заказов (для администратора)
    getOrdersStats() {
        const orders = this.getAllOrders();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const todayOrders = orders.filter(order => {
            const orderDate = new Date(order.createdAt);
            orderDate.setHours(0, 0, 0, 0);
            return orderDate.getTime() === today.getTime();
        });
        
        const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
        const averageOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;
        
        return {
            totalOrders: orders.length,
            todayOrders: todayOrders.length,
            totalRevenue: totalRevenue,
            averageOrderValue: averageOrderValue,
            statusCounts: {
                processing: orders.filter(o => o.status === 'processing').length,
                confirmed: orders.filter(o => o.status === 'confirmed').length,
                onway: orders.filter(o => o.status === 'onway').length,
                delivered: orders.filter(o => o.status === 'delivered').length,
                cancelled: orders.filter(o => o.status === 'cancelled').length
            }
        };
    }
};