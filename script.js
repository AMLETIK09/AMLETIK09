// Обратный отсчет
const weddingDate = new Date('2025-08-21T16:30:00').getTime();

function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    // Если время вышло
    if (diff <= 0) {
        document.getElementById("countdown").innerHTML = `
            <div class="wedding-message">
                <h3>🎉 Свадьба уже состоялась!</h3>
                <p>Спасибо, что были с нами в этот важный день!</p>
            </div>
        `;
        return;
    }

    // Рассчет единиц времени
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    // Обновление элементов
    document.getElementById("days").textContent = String(days).padStart(2, "0");
    document.getElementById("hours").textContent = String(hours).padStart(2, "0");
    document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
    document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

// Запуск отсчета
setInterval(updateCountdown, 1000);
updateCountdown(); // Инициализация при загрузке

// RSVP Telegram отправка
document.getElementById('rsvp-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = e.target;
    const data = new FormData(form);
    const name = data.get('name');
    const attendance = data.get('attendance');
    const guests = data.get('guests') || '1';
    const comment = data.get('comment') || 'Нет комментария';

    // Статусное сообщение
    const statusMessage = document.getElementById('status-message');
    statusMessage.innerText = "Отправка данных...";
    statusMessage.style.color = "#4CAF50";

    const message = `🎉 Новая RSVP заявка:\n👤 Имя: ${name}\n✅ Придёт: ${attendance}\n👥 Гостей: ${guests}\n💬 Комментарий: ${comment}`;

    const telegramBotToken = "8042335847:AAG7YW94wZ7Hq7M04S5W-3VPHV1TCGY-zPs";
    const chatId = "-1002552991233";

    try {
        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
        
        if (response.ok) {
            statusMessage.innerText = "Спасибо! Ваш ответ отправлен 💌";
            statusMessage.style.color = "green";
            form.reset();
        } else {
            const errorData = await response.json();
            throw new Error(errorData.description || 'Ошибка сервера');
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        statusMessage.innerText = "Ошибка: " + (error.message || "Попробуйте позже");
        statusMessage.style.color = "red";
    }
});

// Извлечение имени из URL
function getNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name");
}

// Персонализированное приветствие
document.addEventListener("DOMContentLoaded", () => {
    const name = getNameFromURL();
    if (name) {
        document.getElementById("greeting").innerText = `Дорогая, ${name}!`;
    }
    
    // Запуск таймера после загрузки
    updateCountdown();
});
