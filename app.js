import markdownit from "markdown-it";
import React, { useState } from "react";
const md = markdownit();
const result = md.render("# markdown-it rulezz!");
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import { useRoutes } from "react-router-dom";
const router = createBrowserRouter([
  {
    path: "/",
    element: /* @__PURE__ */ React.createElement(Search, null)
  },
  {
    path: "/counter",
    element: /* @__PURE__ */ React.createElement(Counter, null)
  },
  {
    path: "/markdown",
    element: /* @__PURE__ */ React.createElement(MarkdownRender, { markdown: result })
  }
]);
export async function MarkdownRender(markdown) {
  const result2 = md.render(await (await fetch(`/test.md`)).text());
  return /* @__PURE__ */ React.createElement("div", { dangerouslySetInnerHTML: { __html: result2 } });
}
export function App() {
  return /* @__PURE__ */ React.createElement(React.StrictMode, null, /* @__PURE__ */ React.createElement(RouterProvider, { router }));
}
export function Search() {
  const [result2, setResult] = useState("");
  const handleQuery = async (event) => {
    if (event.key === "Enter") {
      const result3 = await fetch(`http://192.168.43.27:8081/search?query=${event.target.value}`);
      const resultText = await result3.text();
      console.log(resultText);
      setResult(resultText);
    }
  };
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("input", { type: "text", onKeyDown: handleQuery, className: "w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500", placeholder: "Search..." }), /* @__PURE__ */ React.createElement("div", { dangerouslySetInnerHTML: { __html: result2 } }));
}
export function Counter() {
  const [count, setCount] = useState(0);
  return /* @__PURE__ */ React.createElement("div", null, count, /* @__PURE__ */ React.createElement("button", { className: "text-red-400", onClick: () => setCount(count + 1) }, "+1"));
}
