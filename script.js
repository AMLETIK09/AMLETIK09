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
document.getElementById('rsvp-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const attending = document.getElementById('attending').value;
  const message = document.getElementById('message').value.trim();

  const text = `📩 Новое RSVP-приглашение:\n👤 Имя: ${name}\n📌 Придёт: ${attending}\n💬 Сообщение: ${message}`;
  const botToken = '8042335847:AAG7YW94wZ7Hq7M04S5W-3VPHV1TCGY-zPs';
  const chatId = '-1002552991233';

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: text }),
  })
    .then(response => {
      if (response.ok) {
        alert('Спасибо! Ваш ответ получен ❤️');
        document.getElementById('rsvp-form').reset();
      } else {
        alert('Ошибка при отправке. Попробуйте позже.');
      }
    })
    .catch(error => {
      alert('Сбой соединения. Попробуйте позже.');
      console.error(error);
    });
});
