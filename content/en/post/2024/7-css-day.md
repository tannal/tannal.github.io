---
title: CSS Day 2024
date: 2024-09-14 19:23:11+0000
categories:
    - Frontend
tags:
    - CSS Day
---

<script defer src="/youtube.js" type="module"></script>
<script defer src="/webgl.js" type="module"></script>


## How to teach CSS

<youtube-player video-id="ZPTVr2pS0XE"></youtube-player>

## Start over-engineering your CSS

<youtube-player video-id="k_3pRxdv-cI"></youtube-player>



<!-- <canvas-2d width="800" height="600">
    <line-2d x1="100" y1="100" x2="700" y2="500" color="#000000" width="5"></line-2d>
    <rect-2d x="50" y="50" width="200" height="100" color="#FF0000"></rect-2d>
    <circle-2d cx="400" cy="300" radius="50" color="#0000FF"></circle-2d>
</canvas-2d> -->


```cpp
Debug()
```

<textarea id="input" placeholder="Enter text to tokenize"></textarea>
<button id="tokenize" disabled>Tokenize</button>
<div id="output"></div>

<script>
    const inputEl = document.getElementById('input');
    const outputEl = document.getElementById('output');
    const tokenizeBtn = document.getElementById('tokenize');

    let wasmModule;

    WebAssembly.instantiateStreaming(fetch("/tokenizer.wasm"), {})
        .then(result => {
            wasmModule = result.instance.exports;
            if (typeof wasmModule.tokenize !== 'function') {
                throw new Error('tokenize function not found in WebAssembly module');
            }
            tokenizeBtn.disabled = false;
            console.log('WebAssembly module loaded successfully');
        })
        .catch(error => {
            console.error('Failed to load WebAssembly module:', error);
            outputEl.textContent = 'Error: Failed to load tokenizer';
        });

    tokenizeBtn.addEventListener('click', () => {
        if (!wasmModule) {
            outputEl.textContent = 'Error: WebAssembly module not loaded';
            return;
        }

        try {
            const input = inputEl.value;
            const tokenizedArray = wasmModule.tokenize(input);
            outputEl.textContent = `Tokenized sequence:\n${tokenizedArray.join(' ')}`;
        } catch (error) {
            console.error('Error during tokenization:', error);
            outputEl.textContent = 'Error: Tokenization failed';
        }
    });
</script>