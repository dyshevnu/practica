document.addEventListener('DOMContentLoaded', function() {
    // ========================
    // ОБЩИЕ ФУНКЦИИ
    // ========================
    
    /**
     * Показывает всплывающее уведомление
     * @param {string} message - Текст сообщения
     * @param {boolean} isSuccess - Тип уведомления (успех/ошибка)
     */
    function showNotification(message, isSuccess = true) {
        const notification = document.getElementById('notification');
        if (!notification) return;
        
        // Настройка внешнего вида
        notification.textContent = message;
        notification.style.backgroundColor = isSuccess ? '#4CAF50' : '#ff6b00';
        notification.style.bottom = '20px';
        notification.style.opacity = '1';
        
        // Автоматическое скрытие через 5 секунд
        setTimeout(() => {
            notification.style.bottom = '-100px';
            notification.style.opacity = '0';
        }, 5000);
    }

    // ========================
    // ОБРАБОТЧИКИ ИНТЕРФЕЙСА
    // ========================
    
    // Все кнопки входа и покупки показывают "Недоступно"
    document.getElementById('login')?.addEventListener('click', function() {
        showNotification('Эта функция пока недоступна', false);
    });
    
    document.querySelectorAll('.buy-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            showNotification('Эта функция пока недоступна', false);
        });
    });

    // ========================
    // ФОРМА "СВЯЗЬ С НАМИ"
    // ========================
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Сбор данных формы
            const formData = {
                name: this.name.value,
                email: this.email.value,
                subject: this.subject.value,
                message: this.message.value,
                date: new Date().toLocaleString('ru-RU')
            };
            
            // Сохранение в localStorage
            saveMessage(formData);
            showNotification('Ваше сообщение отправлено!');
            this.reset();
        });
    }

    /**
     * Сохраняет сообщение в localStorage
     * @param {object} data - Данные сообщения
     */
    function saveMessage(data) {
        try {
            // Получение существующих сообщений
            const stored = localStorage.getItem('contactMessages');
            let messages = stored ? JSON.parse(stored) : [];
            
            // Ограничение хранилища (50 сообщений)
            if (messages.length >= 50) messages.shift();
            
            // Добавление нового сообщения
            messages.push(data);
            localStorage.setItem('contactMessages', JSON.stringify(messages));
        } catch (e) {
            console.error('Ошибка сохранения:', e);
            showNotification('Ошибка сохранения сообщения', false);
        }
    }

    // ========================
    // АДМИН-ПАНЕЛЬ
    // ========================
    
    let isAdminPanelActive = false;

    // Кнопка переключения админ-панели
    document.getElementById('adminBtn')?.addEventListener('click', function() {
        const password = prompt('Введите пароль администратора:');
        if (password === 'admin123') {
            isAdminPanelActive = !isAdminPanelActive;
            const adminPanel = document.getElementById('adminPanel');
            if (adminPanel) {
                adminPanel.style.display = isAdminPanelActive ? 'block' : 'none';
                
                // Автоматическая загрузка сообщений при открытии
                if (isAdminPanelActive) {
                    loadAndDisplayMessages();
                }
            }
        } else {
            alert('Неверный пароль!');
        }
    });

    // Кнопка обновления сообщений
    document.getElementById('viewMessagesBtn')?.addEventListener('click', function() {
        loadAndDisplayMessages();
    });
    
    // Кнопка очистки сообщений
    document.getElementById('clearMessagesBtn')?.addEventListener('click', function() {
        if (confirm('Удалить все сообщения?')) {
            localStorage.removeItem('contactMessages');
            const container = document.getElementById('messagesContainer');
            if (container) container.innerHTML = '<p>Сообщения удалены</p>';
            showNotification('Все сообщения удалены');
        }
    });

    /**
     * Загружает и отображает сообщения
     */
    function loadAndDisplayMessages() {
        try {
            const stored = localStorage.getItem('contactMessages');
            const messages = stored ? JSON.parse(stored) : [];
            displayMessages(messages);
        } catch (e) {
            console.error('Ошибка загрузки сообщений:', e);
            alert('Ошибка загрузки сообщений');
        }
    }

    /**
     * Отображает сообщения в контейнере
     * @param {array} messages - Массив сообщений
     */
    function displayMessages(messages) {
        const container = document.getElementById('messagesContainer');
        if (!container) return;
        
        if (!messages.length) {
            container.innerHTML = '<p>Нет сообщений</p>';
            return;
        }
        
        // Генерация HTML для сообщений
        let html = '';
        messages.forEach(msg => {
            html += `
                <div class="message-card">
                    <p><strong>${msg.name || 'Без имени'}</strong> (${msg.email || 'нет email'})</p>
                    <p><em>${msg.subject || 'Без темы'}</em></p>
                    <p>${msg.message || 'Пустое сообщение'}</p>
                    <p class="message-date">${msg.date || 'Дата неизвестна'}</p>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
});