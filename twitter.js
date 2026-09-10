class TwitterEmbed extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.tweetId = this.getAttribute("tweet-id");
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            width: 100%;
                            max-width: 550px;
                        }
                    </style>
                    <div id="tweet-container"></div>
                    <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"><\/script>
                `;

    window.twttr = (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
      if (d.getElementById(id)) return t;
      js = d.createElement(s);
      js.id = id;
      js.src = "https://platform.twitter.com/widgets.js";
      fjs.parentNode.insertBefore(js, fjs);

      t._e = [];
      t.ready = function (f) {
        t._e.push(f);
      };

      return t;
    })(document, "script", "twitter-wjs");

    twttr.ready(() => {
      twttr.widgets.createTweet(
        this.tweetId,
        this.shadowRoot.getElementById("tweet-container"),
        { align: "center" },
      );
    });
  }
}

customElements.define("twitter-embed", TwitterEmbed);
