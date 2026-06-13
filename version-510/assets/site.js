(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    function initImages() {
        document.querySelectorAll('img').forEach(function (img) {
            img.addEventListener('error', function () {
                img.classList.add('is-missing');
            });
        });
    }

    function initMenu() {
        var toggle = document.querySelector('[data-nav-toggle]');
        var links = document.querySelector('[data-nav-links]');
        if (!toggle || !links) {
            return;
        }
        toggle.addEventListener('click', function () {
            links.classList.toggle('open');
        });
    }

    function initHero() {
        var hero = document.querySelector('[data-hero]');
        if (!hero) {
            return;
        }
        var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        if (!slides.length) {
            return;
        }
        var index = 0;
        var timer;
        function show(nextIndex) {
            index = (nextIndex + slides.length) % slides.length;
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
            }, 5000);
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
        if (prev) {
            prev.addEventListener('click', function () {
                show(index - 1);
                start();
            });
        }
        if (next) {
            next.addEventListener('click', function () {
                show(index + 1);
                start();
            });
        }
        hero.addEventListener('mouseenter', stop);
        hero.addEventListener('mouseleave', start);
        show(0);
        start();
    }

    function initSearchForms() {
        document.querySelectorAll('[data-search-form]').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[name="q"]');
                var value = input ? input.value.trim() : '';
                var target = form.getAttribute('data-search-target') || 'search.html';
                if (value) {
                    window.location.href = target + '?q=' + encodeURIComponent(value);
                } else {
                    window.location.href = target;
                }
            });
        });
    }

    function initFilters() {
        document.querySelectorAll('[data-filter-scope]').forEach(function (scope) {
            var queryInput = scope.querySelector('[data-filter-query]');
            var yearSelect = scope.querySelector('[data-filter-year]');
            var typeSelect = scope.querySelector('[data-filter-type]');
            var regionSelect = scope.querySelector('[data-filter-region]');
            var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
            var params = new URLSearchParams(window.location.search);
            var initial = params.get('q');
            if (initial && queryInput) {
                queryInput.value = initial;
            }
            function apply() {
                var q = queryInput ? queryInput.value.trim().toLowerCase() : '';
                var y = yearSelect ? yearSelect.value : '';
                var t = typeSelect ? typeSelect.value : '';
                var r = regionSelect ? regionSelect.value : '';
                cards.forEach(function (card) {
                    var text = (card.getAttribute('data-search') || '').toLowerCase();
                    var pass = true;
                    if (q && text.indexOf(q) === -1) {
                        pass = false;
                    }
                    if (y && card.getAttribute('data-year') !== y) {
                        pass = false;
                    }
                    if (t && card.getAttribute('data-type') !== t) {
                        pass = false;
                    }
                    if (r && card.getAttribute('data-region') !== r) {
                        pass = false;
                    }
                    card.classList.toggle('hide-card', !pass);
                });
            }
            [queryInput, yearSelect, typeSelect, regionSelect].forEach(function (node) {
                if (node) {
                    node.addEventListener('input', apply);
                    node.addEventListener('change', apply);
                }
            });
            apply();
        });
    }

    function initPlayers() {
        document.querySelectorAll('.player-card').forEach(function (box) {
            var video = box.querySelector('video');
            var trigger = box.querySelector('.player-trigger');
            if (!video || !trigger) {
                return;
            }
            var loaded = false;
            var stream = video.getAttribute('data-stream');
            function load() {
                if (loaded || !stream) {
                    return;
                }
                loaded = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                } else if (window.Hls && window.Hls.isSupported()) {
                    var hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                } else {
                    video.src = stream;
                }
            }
            function play() {
                load();
                video.controls = true;
                trigger.classList.add('is-hidden');
                var attempt = video.play();
                if (attempt && typeof attempt.catch === 'function') {
                    attempt.catch(function () {
                        trigger.classList.remove('is-hidden');
                    });
                }
            }
            trigger.addEventListener('click', play);
            video.addEventListener('click', function () {
                if (video.paused) {
                    play();
                }
            });
            video.addEventListener('play', function () {
                trigger.classList.add('is-hidden');
            });
        });
    }

    ready(function () {
        initImages();
        initMenu();
        initHero();
        initSearchForms();
        initFilters();
        initPlayers();
    });
}());
