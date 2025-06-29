const countdown = document.getElementById('countdown');
const weddingDate = new Date('2025-08-21T16:30:00');

function updateCountdown() {
  const weddingDate = new Date("2025-08-21T16:30:00").getTime();
  const now = new Date().getTime();
  const diff = weddingDate - now;

  if (diff <= 0) {
    document.querySelector(".countdown-clean").innerHTML = "<p>Свадьба уже состоялась!</p>";
    return;
  }

  const totalSeconds = Math.floor(diff / 1000);
  const weeks = Math.floor(totalSeconds / (7 * 24 * 3600));
  const days = Math.floor((totalSeconds % (7 * 24 * 3600)) / (24 * 3600));
  const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.getElementById("weeks").textContent = String(weeks).padStart(2, "0");
  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown(); // запускаем сразу

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
