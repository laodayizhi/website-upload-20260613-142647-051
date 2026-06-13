(function () {
  function initMoviePlayer(streamUrl) {
    var video = document.getElementById("movie-video");
    var gate = document.getElementById("play-gate");
    var started = false;
    var hlsInstance = null;

    if (!video || !streamUrl) {
      return;
    }

    function bindSource() {
      if (started) {
        return;
      }
      started = true;

      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = streamUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(streamUrl);
        hlsInstance.attachMedia(video);
      } else {
        video.src = streamUrl;
      }
    }

    function startPlayback() {
      bindSource();
      if (gate) {
        gate.classList.add("is-hidden");
      }
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === "function") {
        playPromise.catch(function () {
          if (gate) {
            gate.classList.remove("is-hidden");
          }
        });
      }
    }

    if (gate) {
      gate.addEventListener("click", startPlayback);
    }

    video.addEventListener("click", function () {
      if (video.paused) {
        startPlayback();
      }
    });

    video.addEventListener("play", function () {
      if (gate) {
        gate.classList.add("is-hidden");
      }
    });

    window.addEventListener("beforeunload", function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.initMoviePlayer = initMoviePlayer;
})();
