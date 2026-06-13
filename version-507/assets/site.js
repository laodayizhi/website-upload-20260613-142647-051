(function () {
  function ready(callback) {
    if (document.readyState !== 'loading') {
      callback();
    } else {
      document.addEventListener('DOMContentLoaded', callback);
    }
  }

  function text(value) {
    return (value || '').toString().toLowerCase();
  }

  function initMenu() {
    var button = document.querySelector('.menu-toggle');
    var panel = document.querySelector('.mobile-panel');
    if (!button || !panel) {
      return;
    }
    button.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    if (!slides.length) {
      return;
    }
    var index = 0;
    var timer = null;
    function show(next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }
    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }
    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        start();
      });
    });
    show(0);
    start();
  }

  function initSearch() {
    var panel = document.querySelector('[data-filter-panel]');
    if (!panel) {
      return;
    }
    var input = panel.querySelector('[data-search]');
    var category = panel.querySelector('[data-category-select]');
    var year = panel.querySelector('[data-year-select]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var empty = document.querySelector('.empty-state');
    function apply() {
      var query = text(input && input.value).trim();
      var categoryValue = category ? category.value : '';
      var yearValue = year ? year.value : '';
      var visible = 0;
      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-year')
        ].map(text).join(' ');
        var matchesQuery = !query || haystack.indexOf(query) !== -1;
        var matchesCategory = !categoryValue || card.getAttribute('data-category') === categoryValue;
        var matchesYear = !yearValue || card.getAttribute('data-year') === yearValue;
        var isVisible = matchesQuery && matchesCategory && matchesYear;
        card.style.display = isVisible ? '' : 'none';
        if (isVisible) {
          visible += 1;
        }
      });
      if (empty) {
        empty.style.display = visible ? 'none' : 'block';
      }
    }
    [input, category, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  }

  function initTagFilters() {
    var buttons = Array.prototype.slice.call(document.querySelectorAll('[data-tag-filter]'));
    if (!buttons.length) {
      return;
    }
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        var value = button.getAttribute('data-tag-filter');
        buttons.forEach(function (item) {
          item.classList.toggle('active', item === button);
        });
        cards.forEach(function (card) {
          var haystack = text(card.getAttribute('data-tags'));
          card.style.display = value === 'all' || haystack.indexOf(text(value)) !== -1 ? '' : 'none';
        });
      });
    });
  }

  function initPlayers() {
    var shells = Array.prototype.slice.call(document.querySelectorAll('.player-shell[data-stream]'));
    shells.forEach(function (shell) {
      var video = shell.querySelector('video');
      var button = shell.querySelector('.player-start');
      var stream = shell.getAttribute('data-stream');
      var started = false;
      function start() {
        if (!video || !stream || started) {
          if (video) {
            video.play().catch(function () {});
          }
          return;
        }
        started = true;
        if (button) {
          button.classList.add('hidden');
        }
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
          video.play().catch(function () {});
          return;
        }
        if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hls.loadSource(stream);
          hls.attachMedia(video);
          hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
          hls.on(window.Hls.Events.ERROR, function (event, data) {
            if (data && data.fatal) {
              if (button) {
                button.classList.remove('hidden');
                button.querySelector('strong').textContent = '重新播放';
              }
              started = false;
            }
          });
          shell._hls = hls;
        } else {
          video.src = stream;
          video.play().catch(function () {});
        }
      }
      if (button) {
        button.addEventListener('click', start);
      }
      shell.addEventListener('click', function (event) {
        if (event.target === video) {
          return;
        }
        if (!started) {
          start();
        }
      });
    });
  }

  ready(function () {
    initMenu();
    initHero();
    initSearch();
    initTagFilters();
    initPlayers();
  });
})();
