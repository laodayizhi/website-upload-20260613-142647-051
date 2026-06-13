(function () {
  window.initMoviePlayer = function (options) {
    var video = document.getElementById(options.videoId);
    var overlay = document.getElementById(options.overlayId);
    var button = overlay ? overlay.querySelector('button') : null;
    var source = options.source;
    var hls = null;
    var attached = false;

    if (!video || !source) {
      return;
    }

    function attach() {
      if (attached) {
        return;
      }
      attached = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function begin() {
      attach();
      video.controls = true;
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
      var playRequest = video.play();
      if (playRequest && typeof playRequest.catch === 'function') {
        playRequest.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    }

    if (button) {
      button.addEventListener('click', begin);
    }

    if (overlay) {
      overlay.addEventListener('click', function (event) {
        if (event.target === overlay) {
          begin();
        }
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        begin();
      }
    });

    video.addEventListener('ended', function () {
      if (overlay) {
        overlay.classList.remove('is-hidden');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hls) {
        hls.destroy();
      }
    });
  };
}());
