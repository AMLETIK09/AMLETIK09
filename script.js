const countdown = document.getElementById('countdown');
const weddingDate = new Date('2025-08-21T16:30:00');

function updateCountdown() {
  const now = new Date();
  const diff = weddingDate - now;
  if (diff <= 0) {
    countdown.innerHTML = "<p>Свадьба уже состоялась!</p>";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  countdown.innerHTML = `<p>До свадьбы осталось: ${days} дн ${hours} ч ${minutes} мин ${seconds} сек</p>`;
}
setInterval(updateCountdown, 1000);
updateCountdown();

// RSVP Telegram отправка

document.getElementById('rsvp-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const name = data.get('name');
    const attendance = data.get('attendance');
    const guests = data.get('guests');
    const comment = data.get('comment');

    const message = `🎉 Новая RSVP заявка:\n👤 Имя: ${name}\n✅ Придёт: ${attendance}\n👥 Гостей: ${guests}\n💬 Комментарий: ${comment}`;

    const telegramBotToken = "8042335847:AAG7YW94wZ7Hq7M04S5W-3VPHV1TCGY-zPs";
    const chatId = "-1002552991233";

    try {
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message
            })
        });
        form.reset();
        document.getElementById('status-message').innerText = "Спасибо! Ответ отправлен 💌";
    } catch (error) {
        document.getElementById('status-message').innerText = "Ошибка при отправке. Попробуйте позже.";
    }
});
<script>
  function getNameFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("name");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const name = getNameFromURL();
    if (name) {
      document.getElementById("greeting").innerText = `Дорогая, ${name}!`;
    }
  });
