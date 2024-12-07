class CodepenEmbed extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.penId = this.getAttribute("pen-id");
    this.user = this.getAttribute("user");
    this.height = this.getAttribute("height") || "300";
    this.themeId = this.getAttribute("theme-id") || "0";
    this.defaultTab = this.getAttribute("default-tab") || "result";

    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            width: 100%;
                            max-width: 800px;
                        }
                        iframe {
                            width: 100%;
                            height: ${this.height}px;
                            border: none;
                        }
                    </style>
                    <iframe
                        src="https://codepen.io/${this.user}/embed/${this.penId}?height=${this.height}&theme-id=${this.themeId}&default-tab=${this.defaultTab}"
                        frameborder="no"
                        loading="lazy"
                        allowtransparency="true"
                        allowfullscreen="true">
                    </iframe>
                `;
  }
}

customElements.define("codepen-embed", CodepenEmbed);
