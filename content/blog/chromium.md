---
title: Chromium Dev
date: 2023-10-23
draft: false
---


I don't want to get stuck.

So I just keep trying and keep trying.


```sh

mkdir chromium & cd chromium

fetch chromium --no-history --no-hooks

./build/install-build-deps.sh

gclient runhooks

gn gen out/Default

autoninja -C out/Default chrome

```

