class LiveEditor extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  render() {
    this.shadowRoot.innerHTML = `
                    <style>
                        :host {
                            display: block;
                            width: 100%;
                            max-width: 1200px;
                            margin: 0 auto;
                        }
                        .container {
                            display: flex;
                            gap: 20px;
                        }
                        .editor, .preview {
                            flex: 1;
                            border: 1px solid #ccc;
                            border-radius: 4px;
                            padding: 10px;
                            background-color: white;
                        }
                        textarea {
                            width: 100%;
                            height: 300px;
                            resize: vertical;
                            font-family: monospace;
                        }
                        .preview {
                            min-height: 300px;
                        }
                    </style>
                    <div class="container">
                        <div class="editor">
                            <h2>编辑器</h2>
                            <textarea id="codeInput"></textarea>
                        </div>
                        <div class="preview">
                            <h2>预览</h2>
                            <div id="previewArea"></div>
                        </div>
                    </div>
                `;
  }

  setupEventListeners() {
    const codeInput = this.shadowRoot.getElementById("codeInput");
    const previewArea = this.shadowRoot.getElementById("previewArea");

    codeInput.addEventListener("input", () => {
      this.updatePreview(codeInput.value);
    });

    // 初始化时添加一些示例代码
    codeInput.value =
      "<h1>Hello, World!</h1>\n<p>Edit this code to see live changes.</p>";
    this.updatePreview(codeInput.value);
  }

  updatePreview(code) {
    const previewArea = this.shadowRoot.getElementById("previewArea");
    previewArea.innerHTML = code;

    // 执行编辑器中的JavaScript代码
    const scriptTags = previewArea.getElementsByTagName("script");
    Array.from(scriptTags).forEach((scriptTag) => {
      const newScript = document.createElement("script");
      newScript.textContent = scriptTag.textContent;
      scriptTag.parentNode.replaceChild(newScript, scriptTag);
    });
  }
}

customElements.define("live-editor", LiveEditor);
