---
title: How browser paint box border
date: 2024-10-30 14:23:11+0000
categories:
    - editor
tags:
    - editor
---

## Chromium

```bash
class BoxBorderPainter {
private:
    // 边框属性标志
    bool is_uniform_color_;
    bool is_uniform_style_;
    bool is_uniform_width_;
    bool has_transparency_;
    
    // 可见边的集合，可能是位掩码
    unsigned visible_edge_set_;
    static const unsigned kAllBorderEdges = 0xF; // 推测值
    
    // 边框的几何形状
    RoundedRect outer_;  // 外边框
    RoundedRect inner_;  // 内边框
    
    // 绘制上下文
    PaintContext context_;
    
    // 样式相关
    const ComputedStyle& style_;
    ElementRole element_role_;
    BleedAvoidance bleed_avoidance_;
};
```

## Webkit


## Gecko