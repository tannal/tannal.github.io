

import markdownit from 'markdown-it'
import React, { useEffect, useState } from 'react'
const md = markdownit()
const result = md.render('# markdown-it rulezz!');

import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import { useRoutes } from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Search />,
    },
    {
        path: "/counter",
        element: <Counter />,
    },
    {
        path: "/markdown",
        element: <MarkdownRender markdown={result} />,
    }
]);

export function MarkdownRender({ markdown }) {
    const [result, setResult] = useState('');
    useEffect(() => {
        fetch(`/content/test.md`)
            .then((response) => response.text())
            .then((text) => {
                console.log(text);
                setResult(text);
            });
    }, []); // Add an empty dependency array to run the effect only once
    return (
        <div dangerouslySetInnerHTML={{ __html: md.render(result || markdown) }} />
    );
}

export function App() {
    // render the result of the markdown conversion as dom not string

    return (
        <React.StrictMode>
            <RouterProvider router={router} />
        </React.StrictMode>
    )
}

export function Search() {
    const [result, setResult] = useState('')
    const handleQuery = async (event) => {
        if (event.key === 'Enter') {
            // http://localhost:8081/search?query=
            const result = await fetch(`http://192.168.43.27:8081/search?query=${event.target.value}`)
            const resultText = await result.text()
            console.log(resultText)
            setResult(resultText)
        }
    }
    return (
        <div>
            <input type="text" onKeyDown={handleQuery} className="w-64 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500" placeholder="Search..." />
            <div dangerouslySetInnerHTML={{ __html: result }} />
        </div>
    )
}


export function Counter() {
    const [count, setCount] = useState(0)
    return (
        <div>
            {count}
            <button className='text-red-400' onClick={() => setCount(count + 1)}>+1</button>
        </div>
    )
}