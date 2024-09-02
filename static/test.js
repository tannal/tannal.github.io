console.log("This works");

// webcompoent counter
class Counter extends HTMLElement {
  constructor() {
    super();
    this.count = 0;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <button id="increment">Increment</button>
      <span>${this.count}</span>
    `;
    this.shadowRoot
      .getElementById("increment")
      .addEventListener("click", () => {
        this.count++;
        this.shadowRoot.querySelector("span").textContent = this.count;
      });
  }
}
