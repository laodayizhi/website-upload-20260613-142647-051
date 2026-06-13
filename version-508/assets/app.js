(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    var navToggle = document.querySelector("[data-nav-toggle]");
    var mainNav = document.querySelector("[data-main-nav]");
    if (navToggle && mainNav) {
      navToggle.addEventListener("click", function () {
        mainNav.classList.toggle("is-open");
      });
    }

    var slider = document.querySelector("[data-hero-slider]");
    if (slider) {
      var slides = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(slider.querySelectorAll("[data-hero-dot]"));
      var prev = slider.querySelector("[data-hero-prev]");
      var next = slider.querySelector("[data-hero-next]");
      var active = 0;

      function showSlide(index) {
        active = (index + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) {
          slide.classList.toggle("is-active", slideIndex === active);
        });
        dots.forEach(function (dot, dotIndex) {
          dot.classList.toggle("is-active", dotIndex === active);
        });
      }

      if (prev) {
        prev.addEventListener("click", function () {
          showSlide(active - 1);
        });
      }

      if (next) {
        next.addEventListener("click", function () {
          showSlide(active + 1);
        });
      }

      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });

      if (slides.length > 1) {
        window.setInterval(function () {
          showSlide(active + 1);
        }, 6200);
      }
    }

    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-movie-card]"));
    var searchInput = document.querySelector("[data-search-input]");
    var yearFilter = document.querySelector("[data-year-filter]");
    var regionFilter = document.querySelector("[data-region-filter]");
    var typeFilter = document.querySelector("[data-type-filter]");
    var emptyState = document.querySelector("[data-empty-state]");

    function normalized(value) {
      return String(value || "").trim().toLowerCase();
    }

    function applyFilters() {
      if (!cards.length) {
        return;
      }

      var query = normalized(searchInput && searchInput.value);
      var year = normalized(yearFilter && yearFilter.value);
      var region = normalized(regionFilter && regionFilter.value);
      var type = normalized(typeFilter && typeFilter.value);
      var visible = 0;

      cards.forEach(function (card) {
        var text = normalized(card.getAttribute("data-search-text"));
        var cardYear = normalized(card.getAttribute("data-year"));
        var cardRegion = normalized(card.getAttribute("data-region"));
        var cardType = normalized(card.getAttribute("data-type"));
        var matched = true;

        if (query && text.indexOf(query) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }
        if (region && cardRegion !== region) {
          matched = false;
        }
        if (type && cardType !== type) {
          matched = false;
        }

        card.hidden = !matched;
        if (matched) {
          visible += 1;
        }
      });

      if (emptyState) {
        emptyState.hidden = visible !== 0;
      }
    }

    [searchInput, yearFilter, regionFilter, typeFilter].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });
  });
})();
