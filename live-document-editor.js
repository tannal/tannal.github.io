class LiveDocumentEditor extends HTMLElement {
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
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        .editor {
                            width: 100%;
                            height: 200px;
                            resize: vertical;
                            font-family: monospace;
                            margin-bottom: 10px;
                        }
                        .execute-btn {
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            border: none;
                            border-radius: 4px;
                            cursor: pointer;
                        }
                        .execute-btn:hover {
                            background-color: #45a049;
                        }
                    </style>
                    <textarea class="editor" id="codeInput" placeholder="输入 JavaScript 代码..."></textarea>
                    <button class="execute-btn" id="executeBtn">执行代码</button>
                `;
  }

  setupEventListeners() {
    const codeInput = this.shadowRoot.getElementById("codeInput");
    const executeBtn = this.shadowRoot.getElementById("executeBtn");

    executeBtn.addEventListener("click", () => {
      this.executeCode(codeInput.value);
    });

    // 添加一些示例代码
    codeInput.value = `// 示例：创建一个新的段落元素并添加到文档中
const newParagraph = document.createElement('p');
newParagraph.textContent = '这是通过代码动态添加的新段落！';
document.body.appendChild(newParagraph);

// 示例：修改现有元素的样式
const heading = document.querySelector('h1');
heading.style.color = 'blue';
heading.style.textDecoration = 'underline';

// 示例：添加一个点击事件监听器
document.body.addEventListener('click', function() {
    alert('你点击了页面！');
});`;
  }

  executeCode(code) {
    try {
      // 使用 Function 构造函数来创建一个新的函数，这样可以在全局作用域下执行代码
      new Function(code)();
      console.log("代码执行成功");
    } catch (error) {
      console.error("代码执行出错:", error);
      alert(`代码执行出错: ${error.message}`);
    }
  }
}

customElements.define("live-document-editor", LiveDocumentEditor);
