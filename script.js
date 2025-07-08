// --- ФАЙЛ script.js (ИСПРАВЛЕННАЯ ВЕРСИЯ) ---

document.addEventListener('DOMContentLoaded', () => {

    // --- Анимация появления блоков при скролле ---
    const animatedElements = document.querySelectorAll('.fade-in-up');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px 0px -100px 0px'
        });

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        animatedElements.forEach(el => {
            el.classList.add('is-visible');
        });
    }

    // --- Таймер обратного отсчета ---
    const weddingDate = new Date('2025-08-21T16:30:00').getTime();
    const countdownElement = document.getElementById("countdown");

    function updateCountdown() {
        const now = new Date().getTime();
        const diff = weddingDate - now;
        if (!countdownElement) return;
        if (diff <= 0) {
            countdownElement.innerHTML = `<div class="wedding-message"><h3>🎉 Свадьба уже состоялась!</h3><p>Спасибо, что были с нами в этот важный день!</p></div>`;
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById("days").textContent = String(days).padStart(2, "0");
        document.getElementById("hours").textContent = String(hours).padStart(2, "0");
        document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
        document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
    }

    if (countdownElement) {
        setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --- Отправка формы RSVP в Telegram ---
    const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const form = e.target;
            const data = new FormData(form);
            const name = data.get('name');
            const attendance = data.get('attendance');
            const guests = data.get('guests') || '1';
            const comment = data.get('comment') || 'Нет комментария';
            const statusMessage = document.getElementById('status-message');
            statusMessage.innerText = "Отправка данных...";
            statusMessage.style.color = "#555";
            const message = `🎉 Новая RSVP заявка:\n\n👤 Имя: ${name}\n✅ Придёт: ${attendance}\n👥 Гостей: ${guests}\n💬 Комментарий: ${comment}`;
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
    }
    
    // --- Персонализированное приветствие ---
    function getNameFromURL() {
        const params = new URLSearchParams(window.location.search);
        return params.get("name");
    }
    const guestName = getNameFromURL();
    const greetingElement = document.getElementById("greeting");
    if (guestName && greetingElement) {
        greetingElement.innerText = `Дорогая, ${decodeURIComponent(guestName)}!`;
    }

    // --- Управление фоновой музыкой ---
    const audio = document.getElementById('background-music');
    const toggleBtn = document.getElementById('music-toggle');
    const volumeSlider = document.getElementById('volume-slider');

    if (audio && toggleBtn && volumeSlider) {
        audio.volume = 0.5;
        toggleBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play().catch(e => console.log("Ошибка воспроизведения:", e));
            } else {
                audio.pause();
            }
        });
        audio.onplay = () => {
            toggleBtn.style.color = '#fff';
            toggleBtn.innerHTML = '♫';
        };
        audio.onpause = () => {
            toggleBtn.style.color = '#ccc';
            toggleBtn.innerHTML = '♪';
        };
        volumeSlider.addEventListener('input', () => {
            audio.volume = volumeSlider.value;
        });
        const startMusic = () => {
            audio.play().catch(() => {});
            document.body.removeEventListener('click', startMusic);
            document.body.removeEventListener('touchstart', startMusic);
        };
        document.body.addEventListener('click', startMusic);
        document.body.addEventListener('touchstart', startMusic);
    }
});