
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
document.getElementById('rsvp-form').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Спасибо за ответ! Мы получили вашу информацию.');
});
