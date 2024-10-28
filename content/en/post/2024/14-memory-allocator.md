---
title: All you need to know about memory allocator
date: 2024-09-13 14:23:11+0000
categories:
    - editor
tags:
    - editor
---

## History


## Kernel-space allocator

- buddy allocator - A memory allocator that is used in many operating systems. (Per Brinch Hansen, 1970)

- slab allocator - A memory allocator that is used in the Linux kernel. (Jeff Bonwick, 1994)

- jemalloc - A general-purpose memory allocator that is widely used in production systems. (Jason Evans, 2005)

- tcmalloc - A thread-caching memory allocator that is used in Google's production systems. (Sanjay Ghemawat, 2004)


## User-space allocator

- jemalloc - A general-purpose memory allocator that is widely used in production systems. (Jason Evans, 2005)

- tcmalloc - A thread-caching memory allocator that is used in Google's production systems. (Sanjay Ghemawat, 2004)

- malloc - The standard memory allocator in the C standard library. (Doug Lea, 1979)

- dlmalloc - A memory allocator that is used in many Unix systems. (Doug Lea, 2001)

