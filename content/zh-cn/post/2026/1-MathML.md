---
title: 在Chromium和blink中实现 MathML 链接元素
date: 2024-10-30 14:23:11+0000
categories:
    - chromium
    - blink
tags:
    - chromium
    - blink
---

在 third_party/blink/renderer/core/mathml/ 下创建 mathml_anchor_element.h/cc/idl

它应继承自 MathMLElement 并实现类似 HTMLAnchorElement 的属性（如 href, target, rel）。

属性映射：确保 MathML 的 href 能够触发 Element::HandleClick。