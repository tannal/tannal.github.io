class YouTubePlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.videoId = this.getAttribute("video-id");
    this.width = this.getAttribute("width") || "560";
    this.height = this.getAttribute("height") || "315";

    this.render();
    this.loadYouTubeAPI();
  }

  render() {
    this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            width: 100%;
                            max-width: ${this.width}px;
                        }
                        #player {
                            width: 100%;
                            aspect-ratio: 16 / 9;
                        }
                    </style>
                    <div id="player"></div>
                `;
  }

  loadYouTubeAPI() {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        this.createPlayer();
      };
    } else {
      this.createPlayer();
    }
  }

  createPlayer() {
    new YT.Player(this.shadowRoot.getElementById("player"), {
      height: this.height,
      width: this.width,
      videoId: this.videoId,
      playerVars: {
        playsinline: 1,
      },
      events: {
        onReady: this.onPlayerReady.bind(this),
        onStateChange: this.onPlayerStateChange.bind(this),
      },
    });
  }

  onPlayerReady(event) {
    console.log("Player is ready");
  }

  onPlayerStateChange(event) {
    console.log("Player state changed:", event.data);
  }
}

customElements.define("youtube-player", YouTubePlayer);
