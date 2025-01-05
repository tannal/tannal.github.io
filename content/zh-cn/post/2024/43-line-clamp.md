---
title: Blink中的line-clamp和断行机制
date: 2024-10-12T10:51:56+08:00
categories:
    - 桌面系统
tags:
    - 操作系统
---

## 

Xerox PARC（Palo Alto Research Center）是施乐公司旗下的研究中心，成立于 1970 年代初。它是计算机科技史上最重要的研究机构之一，为现代计算机技术的发展做出了巨大贡献。本文将介绍 Xerox PARC 的历史、研究成果和对计算机科技的影响。

## 调用栈

```bash
BlockLayoutAlgorithm::Layout()
    |
    |--> BlockLayoutAlgorithm::LayoutInlineChild()  // 处理行内子元素
         |
         |--> BlockLayoutAlgorithm::Layout(InlineChildLayoutContext*)
              |
              |--> BlockLayoutAlgorithm::HandleInflow()  // 处理流内元素
                   |
                   |--> LayoutInflow()  // 布局流内元素
                        |
                        |--> InlineNode::Layout()  // 行内节点布局
                             |
                             |--> InlineLayoutAlgorithm::Layout()  // 行内布局算法
                                  |
                                  |--> LineBreaker::NextLine()  // 获取下一行
                                       |
                                       |--> LineBreaker::BreakLine()  // 断行
```
## 3. 研究成果

Xerox PARC 的研究成果涉及多个领域，其中最著名的包括：

1. **图形用户界面（GUI）**：Xerox PARC 开发了世界上第一个图形用户界面系统 Alto，包括窗口、图标、菜单等元素，为后来的 Macintosh 和 Windows 系统奠定了基础。

2. **鼠标**：Xerox PARC 发明了鼠标这一现代计算机输入设备，使用户可以通过移动鼠标来控制屏幕上的光标，实现更加直观的交互。

3. **以太网**：Xerox PARC 开发了以太网技术，实现了计算机之间的局域网连接，为互联网的发展奠定了基础。

4. **面向对象编程**：Xerox PARC 提出了面向对象编程的概念，将数据和操作封装在对象中，提高了软件的可维护性和复用性。

## 4. 对计算机科技的影响

Xerox PARC 的研究成果对计算机科技的发展产生了深远影响，其中最重要的包括：

1. **图形用户界面的普及**：Xerox PARC 的 GUI 技术被后来的 Macintosh 和 Windows 系统借鉴，成为现代计算机界面的标准。

2. **鼠标的普及**：鼠标的发明使得计算机操作更加直观和便捷，成为现代计算机的标配。

3. **以太网的发展**：以太网技术的发明促进了计算机网络的普及和互联网的发展，改变了人们的生活和工作方式。

4. **面向对象编程的影响**：面向对象编程的思想影响了后来的编程语言和软件开发方法，成为现代软件开发的主流范式。

总的来说，Xerox PARC 的研究成果为计算机科技的发展开辟了新的道路，影响深远，至今仍在继续发挥作用。我不允许任何一个计算机的人不知道它的贡献。
```