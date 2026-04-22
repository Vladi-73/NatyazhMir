// Дожидаемся загрузки DOM
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  // ========== КАРУСЕЛЬ В ГЕРОЕ ==========
  const heroCarousel = document.getElementById("heroCarousel");
  if (heroCarousel) {
    const slides = document.querySelectorAll(".carousel-slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.querySelector(".carousel-arrow-left");
    const nextBtn = document.querySelector(".carousel-arrow-right");
    let currentSlide = 0;
    let slideInterval;

    // Функция показа слайда
    function showSlide(index) {
      if (index < 0) index = slides.length - 1;
      if (index >= slides.length) index = 0;

      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));

      slides[index].classList.add("active");
      dots[index].classList.add("active");
      currentSlide = index;
    }

    // Следующий слайд
    function nextSlide() {
      showSlide(currentSlide + 1);
    }

    // Предыдущий слайд
    function prevSlide() {
      showSlide(currentSlide - 1);
    }

    // Автопрокрутка
    function startAutoPlay() {
      stopAutoPlay();
      slideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoPlay() {
      if (slideInterval) {
        clearInterval(slideInterval);
      }
    }

    // Обработчики событий
    if (prevBtn) {
      prevBtn.addEventListener("click", function () {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", function () {
        nextSlide();
        stopAutoPlay();
        startAutoPlay();
      });
    }

    // Клик по точкам
    dots.forEach((dot, index) => {
      dot.addEventListener("click", function () {
        showSlide(index);
        stopAutoPlay();
        startAutoPlay();
      });
    });

    // Остановка автопрокрутки при наведении
    heroCarousel.addEventListener("mouseenter", stopAutoPlay);
    heroCarousel.addEventListener("mouseleave", startAutoPlay);

    // Запуск автопрокрутки
    startAutoPlay();
  }

  // ========== ГАЛЕРЕЯ - ОТКРЫТИЕ В НОВОЙ ВКЛАДКЕ ==========
  const galleryItems = document.querySelectorAll(".gallery-item");

  galleryItems.forEach((item) => {
    item.addEventListener("click", function (e) {
      e.preventDefault();
      const fullSizeUrl = this.dataset.fullsrc;
      if (fullSizeUrl) {
        window.open(fullSizeUrl, "_blank");
      }
    });
  });

  // ========== КНОПКА "СЛУШАТЬ СКАЗКУ" (АУДИОФАЙЛ) ==========
  const playTaleBtn = document.getElementById("playTaleBtn");
  let isPlaying = false;
  let currentAudio = null;

  // Путь к вашему аудиофайлу (файл лежит в той же папке, что и index.html)
  const audioUrl = "Озвучка_НМ.mp3";

  if (playTaleBtn) {
    playTaleBtn.addEventListener("click", function () {
      if (isPlaying) {
        // Останавливаем воспроизведение
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        playTaleBtn.innerHTML = "▶️ Слушать сказку";
        isPlaying = false;
      } else {
        // Создаём новый аудиообъект
        currentAudio = new Audio(audioUrl);

        currentAudio.onplay = function () {
          playTaleBtn.innerHTML = "⏸️ Стоп сказка";
          isPlaying = true;
        };

        currentAudio.onended = function () {
          playTaleBtn.innerHTML = "▶️ Слушать сказку";
          isPlaying = false;
        };

        currentAudio.onerror = function () {
          alert(
            "Не удалось воспроизвести аудиофайл. Проверьте, что файл 'Озвучка_НМ.mp3' лежит в папке с сайтом.",
          );
          playTaleBtn.innerHTML = "▶️ Слушать сказку";
          isPlaying = false;
        };

        currentAudio.play().catch(function (error) {
          console.error("Ошибка воспроизведения:", error);
          alert(
            "Для воспроизведения звука нажмите на любую кнопку на сайте (это требование безопасности браузера).",
          );
        });
      }
    });
  }

  // ========== ОБРАБОТКА ФОРМЫ ==========
  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const formData = new FormData(this);
      const name = formData.get("name");
      const phone = formData.get("phone");

      if (!name || !phone) {
        alert("Заполните имя и телефон, батюшка!");
        return;
      }

      alert(
        `Спасибо, ${name}! Ваша заявка принята. Гонец свяжется с вами по телефону ${phone} в ближайшее время.`,
      );
      this.reset();
    });
  }

  // ========== ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ==========
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // ========== МАСКА ТЕЛЕФОНА ==========
  const phoneInput = document.getElementById("phone");

  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      let value = this.value.replace(/\D/g, "");

      if (value.length > 0) {
        if (value.length === 1) {
          value = "+7";
        } else if (value.length <= 4) {
          value = "+7 (" + value.substring(1);
        } else if (value.length <= 7) {
          value = "+7 (" + value.substring(1, 4) + ") " + value.substring(4);
        } else if (value.length <= 9) {
          value =
            "+7 (" +
            value.substring(1, 4) +
            ") " +
            value.substring(4, 7) +
            "-" +
            value.substring(7);
        } else {
          value =
            "+7 (" +
            value.substring(1, 4) +
            ") " +
            value.substring(4, 7) +
            "-" +
            value.substring(7, 9) +
            "-" +
            value.substring(9, 11);
        }

        this.value = value;
      }
    });
  }
});

// Предзагрузка голосов для синтеза речи
window.speechSynthesis.getVoices();
