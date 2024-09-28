---
title: Implement the v flag for RegExp in SpiderMonkey
date: 2024-09-21 19:23:11+0000
categories:
    - Open Source
tags:
    - Open Source
    - Documentry
---

## The problem

The `RegExp` object in SpiderMonkey does not support the `v` flag. The `v` flag is a new flag introduced in ECMAScript 2022. The `v` flag is used to match vertical whitespace characters. The vertical whitespace characters are the characters that are used to separate lines of text. The vertical whitespace characters include the following characters:

The tc39 proposal for the `v` flag can be found [here](https://github.com/tc39/proposal-regexp-v-flag?tab=readme-ov-file)

The proposal is made by Mathias Bynens who was a v8 engineer.

See their blog post [here](https://v8.dev/features/regexp-v-flag)


## Summary of the v8 post

The `v` flag is typically used to deal with unicode characters appearing in the RegExp.

Matching Emoji characters is a good example of where the `v` flag is useful.

```js
// Unicode defines a character property named “Emoji”.
const re = /^\p{Emoji}$/u;

// Match an emoji that consists of just 1 code point:
re.test('⚽'); // '\u26BD'
// → true ✅

// Match an emoji that consists of multiple code points:
re.test('👨🏾‍⚕️'); // '\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F'
// → false ❌
```

```js
const re = /^\p{RGI_Emoji}$/v;

// Match an emoji that consists of just 1 code point:
re.test('⚽'); // '\u26BD'
// → true ✅

// Match an emoji that consists of multiple code points:
re.test('👨🏾‍⚕️'); // '\u{1F468}\u{1F3FE}\u200D\u2695\uFE0F'
// → true ✅
```


## The test

I didn't do this at first, but I should have written a test for this.

The v flag is not tested in the test262 testsuite.

So I wrote a test for this and contributed back to test262.

```js

```


## The Regex v flag


## The implementation in Spidermonkey


