---
title: CSS Table in Servo
date: 2024-09-27 19:23:11+0000
categories:
    - Open Source
tags:
    - Render Engine
    - Servo
---

## Some call stack


```rust

#0  layout_2020::table::layout::TableLayout::compute_grid_min_max (self=0x7fff863616c0, layout_context=0x7ffe4ffec1d8, writing_mode=...) at components/layout_2020/table/layout.rs:739
#1  0x000055555b503ad0 in layout_2020::table::layout::TableLayout::layout
    (self=..., layout_context=0x7ffe4ffec1d8, positioning_context=0x7fff863625f8, containing_block_for_children=0x7fff86361968, containing_block_for_table=0x7ffe4ffe61c0)
    at components/layout_2020/table/layout.rs:1686
#2  0x000055555b4dbd58 in layout_2020::table::Table::layout
    (self=0x7ffe25835178, layout_context=0x7ffe4ffec1d8, positioning_context=0x7fff863625f8, containing_block_for_children=0x7fff86361968, containing_block_for_table=0x7ffe4ffe61c0)
    at components/layout_2020/table/layout.rs:2750
#3  0x000055555b553f31 in layout_2020::formatting_contexts::NonReplacedFormattingContext::layout
    (self=0x7ffe25835160, layout_context=0x7ffe4ffec1d8, positioning_context=0x7fff863625f8, containing_block_for_children=0x7fff86361968, containing_block=0x7ffe4ffe61c0)
    at components/layout_2020/formatting_contexts.rs:260
#4  0x000055555b552497 in layout_2020::formatting_contexts::NonReplacedFormattingContext::layout_in_flow_block_level
    (self=0x7ffe25835160, layout_context=0x7ffe4ffec1d8, positioning_context=0x7fff863625f8, containing_block=0x7ffe4ffe61c0, sequential_layout_state=...)
    at components/layout_2020/flow/mod.rs:987
#5  0x000055555b5fc59b in layout_2020::flow::{impl#5}::layout::{closure#2} (positioning_context=0x7fff863625f8) at components/layout_2020/flow/mod.rs:696
#6  0x000055555b67d4d0 in layout_2020::positioned::PositioningContext::layout_maybe_position_relative_fragment<layout_2020::flow::{impl#5}::layout::{closure_env#2}>
    (self=0x7fff863625f8, layout_context=0x7ffe4ffec1d8, containing_block=0x7ffe4ffe61c0, style=0x7ffe4f84c970, fragment_layout_fn=...) at components/layout_2020/positioned.rs:205
#7  0x000055555b635587 in layout_2020::flow::BlockLevelBox::layout
    (self=0x7ffe25835158, layout_context=0x7ffe4ffec1d8, positioning_context=0x7fff863625f8, containing_block=0x7ffe4ffe61c0, sequential_layout_state=..., collapsible_with_parent_start_margin=...) at components/layout_2020/flow/mod.rs:691

```