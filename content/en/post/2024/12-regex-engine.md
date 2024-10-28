---
title: All you need to know about regex engine
date: 2024-10-28 14:23:11+0000
categories:
    - Music
tags:
    - Music
    - Life
---

## History

Stephen Kleene introduced regular expressions in the 1950s. They are used in many text processing tasks, such as search, find, and replace. Regular expressions are widely used in programming languages, text editors, and command-line utilities.

Ken Thompson implemented the first regular expression engine in the QED text editor in the 1960s. Later, he improved the engine and integrated it into the Unix operating system. The engine was written in assembly language and used a backtracking algorithm.

## Interface

A regular expression engine provides an interface for matching patterns in text. The engine takes a regular expression and a text string as input and returns the positions of the matches in the text. The engine can also replace the matches with a replacement string.


## Implementations

- ed - The original Unix text editor, which includes a regular expression engine. (Ken Thompson, 1971)

- grep - A command-line utility for searching text files using regular expressions. (Ken Thompson, 1973)

- sed - A stream editor for filtering and transforming text using regular expressions. (Lee E. McMahon, 1974)

- awk - A programming language for processing text files using regular expressions. (Alfred Aho, Peter Weinberger, and Brian Kernighan, 1977)

- Perl - A programming language that includes a powerful regular expression engine. (Larry Wall, 1987)

### Thompson NFA algorithm (most common)

Ken Thompson introduced the Nondeterministic Finite Automaton (NFA) algorithm for regular expression matching. The algorithm uses a state machine to match patterns in text. The NFA algorithm is efficient and easy to implement.

### DFA algorithm (Aho-Corasick algorithm)

The Deterministic Finite Automaton (DFA) algorithm is an alternative to the NFA algorithm. The DFA algorithm uses a deterministic state machine to match patterns in text. The DFA algorithm is more efficient than the NFA algorithm but harder to implement.

### Backtracking algorithm (Perl)

The backtracking algorithm is a general algorithm for regular expression matching. The algorithm uses recursion to explore all possible matches in the text. The backtracking algorithm is simple to implement but can be slow for complex patterns.

### Modern and popular implementations

- Golang - The standard library includes a regular expression package that implements the Thompson NFA algorithm.

- Python - The re module provides regular expression support using the Thompson NFA algorithm.

- Java - The java.util.regex package provides regular expression support using the DFA algorithm.

- V8 (JavaScript) - The V8 engine includes a regular expression engine that uses the Thompson NFA algorithm.

- Spidermonkey (JavaScript) - The Spidermonkey engine includes a regular expression engine that uses the Thompson NFA algorithm.

- JavaScriptCore (JavaScript) - The JavaScriptCore engine includes a regular expression engine that uses the Thompson NFA algorithm.

- ICU (C/C++) - The International Components for Unicode library includes a regular expression engine that uses the DFA algorithm.

- Ripgrep - A command-line utility for searching text files using regular expressions. (Andrew Gallant, 2016)

- Rust - The regex crate provides regular expression support using the Thompson NFA algorithm.

- PCRE - The Perl Compatible Regular Expressions library provides regular expression support using the backtracking algorithm.

- Ruby - The Onigmo library provides regular expression support using the backtracking algorithm.

- LLVM - The LLVM project includes a regular expression engine that uses the DFA algorithm.

- GCC - The GNU Compiler Collection includes a regular expression engine that uses the DFA algorithm.

- .NET - The System.Text.RegularExpressions namespace provides regular expression support using the DFA algorithm.
