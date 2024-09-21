---
title: CSS Day 2024
date: 2024-09-14 19:23:11+0000
categories:
    - open source
tags:
    - Open Source
    - Documentry
---

<script defer src="/youtube.js" type="module"></script>
<script defer src="/webgl.js" type="module"></script>


## How to teach CSS

<youtube-player video-id="ZPTVr2pS0XE"></youtube-player>


<!-- <canvas-2d width="800" height="600">
    <line-2d x1="100" y1="100" x2="700" y2="500" color="#000000" width="5"></line-2d>
    <rect-2d x="50" y="50" width="200" height="100" color="#FF0000"></rect-2d>
    <circle-2d cx="400" cy="300" radius="50" color="#0000FF"></circle-2d>
</canvas-2d> -->


## Build

You need to install rust to use cargo.

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

```

Setup git and get the codebase.


```bash
cargo install --git https://github.com/glandium/git-cinnabar
git cinnabar setup


git clone hg::https://hg.mozilla.org/mozilla-unified gecko && cd gecko
git config fetch.prune true
git cinnabar fetch --tags

mv .git/hooks/fsmonitor-watchman.sample .git/hooks/query-watchman
git config core.fsmonitor .git/hooks/query-watchman
```

Then you can actually build it.

Many projects use custom python scripts for building and testing.

The one that firefox codebase using is called mach.

```bash
./mach bootstrap

./mach run
```

The bootstrap process will ask you what target do you want to build?

Normally you will choose the desktop firefox browser to build.

In practice, you can manually set the config into a file.

For example, build SpiderMonkey under the firefox codebase.

```bash
MOZCONFIG=mozconfig.jsshell ./mach build

# For jsshell mozconfig.jsshell
ac_add_options --enable-application=js
mk_add_options MOZ_OBJDIR=@TOPSRCDIR@/obj-@CONFIG_GUESS@-jsshell

# For full browser
# echo "ac_add_options --enable-application=browser" > mozconfig.browser
```


## Logging


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