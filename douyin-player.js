class DouyinPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.videoId = this.getAttribute("video-id");
    this.width = this.getAttribute("width") || "360";
    this.height = this.getAttribute("height") || "640";

    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            width: 100%;
                            max-width: ${this.width}px;
                        }
                        iframe {
                            width: 100%;
                            height: ${this.height}px;
                            border: none;
                        }
                    </style>
                    <iframe src="https://www.douyin.com/video/${this.videoId}"
                            frameborder="0"
                            allowfullscreen>
                    </iframe>
                `;
  }
}

customElements.define("douyin-player", DouyinPlayer);
