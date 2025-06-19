document.addEventListener('DOMContentLoaded', function() {
  // Обработчик для кнопки входа
  document.getElementById('login').addEventListener('click', showNotification);
  
  // Обработчики для всех кнопок "Купить"
  document.querySelectorAll('.buy-btn').forEach(btn => {
    btn.addEventListener('click', showNotification);
  });
  
  function showNotification() {
    const notification = document.getElementById('notification');
    
    // Показываем уведомление
    notification.style.bottom = '20px';
    notification.style.opacity = '1';
    
    // Через 6 секунд скрываем
    setTimeout(() => {
      notification.style.bottom = '-100px';
      notification.style.opacity = '0';
    }, 6000);
    
    // Отменяем стандартное поведение (если это ссылка)
    return false;
  }
});