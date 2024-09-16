---
title: Training an AI for melody creating
date: 2024-09-14 19:23:11+0000
categories:
    - open source
tags:
    - Open Source
    - Documentry
---

<script defer src="/youtube.js" type="module"></script>
<script defer typse="module" src="https://cdn.jsdelivr.net/combine/npm/tone@14.7.58,npm/@magenta/music@1.23.1/es6/core.js,npm/focus-visible@5,npm/html-midi-player@1.4.0"></script>


<midi-visualizer type="piano-roll" id="myVisualizer"></midi-visualizer>

<midi-player
  src="https://tannal.github.io/heisemaoyi.midi"
  sound-font visualizer="#myVisualizer">
</midi-player>

<script defer src="/bilibili-player.js" type="module"></script>

<bilibili-player bvid="BV1sxtsegEf3"></bilibili-player>;


## **GNU/Linux Documentry**

<youtube-player video-id="k0RYQVkQmWU"></youtube-player>


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