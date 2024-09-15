---
title: The Hitchhiker's Guide to Node Contributor
date: 2024-09-14 19:23:11+0000
categories:
    - open source
    - nodejs
tags:
    - Open Source
    - Documentry
---

<script defer src="/youtube.js" type="module"></script>

## **Nodejs Documentry**

<youtube-player video-id="LB8KwiiUGy0"></youtube-player>


## Build

First we need to generate ninja.build, the configure script will generate both release and debug build.

```bash
./configure --ninja --debug --v8-with-dchecks -C --node-builtin-modules-path $(pwd)
make -j

```

The build process is quite slow beacuse we need to build v8 from source.

ccache might speed up build process especially in incremental rebuild.

Then the build directory is out/Release and out/Debug.


Node typically contains two parts of code, one is C++ code which abstract v8 and the host system, another part is js code which executed by v8.


You can run tests with tools/test.py

```bash
python tools/test.py -p tap --logfile test.tap --mode=release --flaky-tests=keep_retrying -p actions --node-args='--test-reporter=spec' --node-args='--test-reporter-destination=stdout' --measure-flakiness 9 test/parallel/test-zlib-crc32.js
```


You can lint your code (no auto fix) with `make lint-cpp`


## Logging


```cpp
Debug()
```