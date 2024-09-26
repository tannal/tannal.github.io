---
title: The Hitchhiker's Guide to Firefox Contributor
date: 2024-09-24 19:23:11+0000
categories:
    - open source
    - firefox
tags:
    - Open Source
    - Documentry
---

<script defer src="/youtube.js" type="module"></script>

## **Mozilla & Firefox Documentry**

<youtube-player video-id="4Q7FTjhvZ7Y"></youtube-player>


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

## How to add a new web platform test

The web platform tests are located in the `testing/web-platform/tests` directory.

Take the zoom animation discrete test as an example.

Create a testing/web-platform/tests/css/css-viewport/zoom/discrete-animation.html file.

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>CSS Zoom: animation and transition tests</title>
<link rel="help" href="https://drafts.csswg.org/css-transform-2/#propdef-zoom">
<script src="/resources/testharness.js"></script>
<script src="/resources/testharnessreport.js"></script>
<script src="/css/support/interpolation-testcommon.js"></script>

<body>

<script>
test_no_interpolation({
  property: 'zoom',
  from: '1',
  to: '2',
});

</script>
```

Update the test manifest file by running the following command.

Then you can run the test.

```sh
./mach wpt-manifest-update
./mach wpt css/css-viewport/zoom/zoom-animation-discrete.html
```

The WPT (Web Platform Tests) framework indeed provides many useful helper functions, especially when testing CSS properties and animations. 

In addition to `test_no_interpolation`, there are several other commonly used helper functions. Here are some important examples:

- `test_interpolation`: Tests if a property interpolates correctly.
- `test_composition`: Tests the combined effect of multiple animations or transitions.
- `test_computed_value`: Tests if the computed value matches the expected value.
- `test_valid_value`: Tests if a value is valid for a specific property.
- `test_invalid_value`: Tests if a value is invalid for a specific property.
- `test_property_values`: Tests a set of values for validity or invalidity.
- `test_discrete_values`: Tests the behavior of discrete values.
- `test_addition`: Tests addition operations, such as stacking transforms.
- `test_multiplication`: Tests multiplication operations, such as scaling.
- `create_test_element`: Creates an element for testing purposes.
- `assert_equals_rounded`: Compares approximately equal numerical values.

Most of these functions are defined in various support files under the `/css/support/` directory, such as `interpolation-testcommon.js`, `computed-testcommon.js`, and so on.

Using these helper functions can greatly simplify your test code, improve readability, and maintainability. They encapsulate many common testing patterns and complex setup processes, making it easier to write comprehensive and precise CSS tests.

When writing WPT tests, it is recommended to first explore the relevant support files to understand the available helper functions. This helps avoid duplicating existing functionality and ensures that your tests align with the existing style and quality of tests.

There is another example of a test for input element vertical alignment.

It's a little bit different because it has reference files.

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>Input type=range baseline alignment</title>
<link rel="match" href="range-baseline-ref.html">
<link rel="help" href="https://html.spec.whatwg.org/multipage/input.html#range-state-(type=range)">
<style>
  .range-input {
    margin: 20px;
    padding: 10px;
    outline: 20px solid blue;
    visibility: hidden;
  }
</style>
<div class="text-wrapper">
  Baseline text
  <input type="range" class="range-input">
  More baseline text
</div>
```

```html
<!DOCTYPE html>
<meta charset="utf-8">
<title>Reference for Input type=range baseline alignment</title>
<style>
  .range-placeholder {
    display: inline-block;
    margin-top: 20px;
    margin-left: 20px;
    margin-right: 20px;
    padding: 10px;
    outline: 20px solid transparent;
    width: 160px;
    height: 20px;
  }
</style>
<div>
  Baseline text
  <span class="range-placeholder"></span>
  More baseline text
</div>

```

## Logging


```cpp
Debug()
```