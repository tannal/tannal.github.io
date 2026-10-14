class BilibiliPlayer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.bvid = this.getAttribute("bvid");
    this.width = this.getAttribute("width") || "800";
    this.height = this.getAttribute("height") || "450";
    this.page = this.getAttribute("page") || "1";

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
                    <iframe src="//player.bilibili.com/player.html?bvid=${this.bvid}&page=${this.page}"
                            scrolling="no"
                            frameborder="no"
                            allowfullscreen="true">
                    </iframe>
                `;
  }
}

customElements.define("bilibili-player", BilibiliPlayer);
