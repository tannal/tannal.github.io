---
title: Implement MathML a tag in blink/chromium.
date: 2024-10-30 14:23:11+0000
categories:
    - chromium
    - blink
tags:
    - chromium
    - blink
---

First create MathMLAnchorElement mathml_anchor_element.h and mathml_anchor_element.cc in third_party/blink/renderer/core/mathml/

```idl
// mathml_anchor_element.idl
// https://mathml-refresh.github.io/mathml-core/#dom-and-global-attributes
[Exposed=Window]
interface MathMLAnchorElement : MathMLElement {
    [CEReactions, Reflect] attribute USVString href;
    [CEReactions, Reflect] attribute DOMString target;
    [CEReactions, Reflect] attribute DOMString download;
    [CEReactions, Reflect] attribute DOMString rel;
    [CEReactions, Reflect] attribute DOMString referrerpolicy;
    [PutForwards=value] readonly attribute DOMTokenList relList;

    // 支持 tabindex 等全局属性已在 MathMLElement 中处理
};
```

```c++
// mathml_anchor_element.h

#ifndef THIRD_PARTY_BLINK_RENDERER_CORE_MATHML_MATHML_ANCHOR_ELEMENT_H_
#define THIRD_PARTY_BLINK_RENDERER_CORE_MATHML_MATHML_ANCHOR_ELEMENT_H_

#include "third_party/blink/renderer/core/mathml/mathml_element.h"
#include "third_party/blink/renderer/core/dom/element_rare_data_field.h"
#include "third_party/blink/renderer/platform/weborigin/kurl.h"

namespace blink {

class MathMLAnchorElement final : public MathMLElement {
  DEFINE_WRAPPERTYPEINFO();

 public:
  explicit MathMLAnchorElement(Document&);

  // 核心链接功能支持
  bool HasActivationBehavior() const override { return true; }
  void DefaultEventHandler(Event&) override;
  
  // 属性解析与状态
  void ParseAttribute(const AttributeModificationParams&) override;
  bool IsURLAttribute(const Attribute&) const override;
  bool IsFocusableState(UpdateBehavior) const override;
  int DefaultTabIndex() const override;
  
  // 布局关联
  LayoutObject* CreateLayoutObject(const ComputedStyle&) override;

  // IDL 接口实现
  KURL Href() const;
  void setHref(const String&);
  
  void Trace(Visitor*) const override;

 private:
  // 参考 HTMLAnchorElementBase 的逻辑
  void HandleClick(MouseEvent&);
  void NavigateToHyperlink(Event&, NavigationPolicy);
  
  unsigned link_relations_ : 16; // 存储 rel 属性关系
};

}  // namespace blink

#endif  // THIRD_PARTY_BLINK_RENDERER_CORE_MATHML_MATHML_ANCHOR_ELEMENT_H_
```



```c++
// mathml_anchor_element.cc
#include "third_party/blink/renderer/core/mathml/mathml_anchor_element.h"

#include "third_party/blink/renderer/core/events/mouse_event.h"
#include "third_party/blink/renderer/core/mathml_names.h"
#include "third_party/blink/renderer/core/layout/mathml/layout_mathml_block.h"
#include "third_party/blink/renderer/core/html/anchor_element_utils.h"

namespace blink {

MathMLAnchorElement::MathMLAnchorElement(Document& document)
    : MathMLElement(mathml_names::kATag, document), link_relations_(0) {}

LayoutObject* MathMLAnchorElement::CreateLayoutObject(const ComputedStyle& style) {
  // MathML <a> 应该是透明的容器，LayoutMathMLBlock 能够处理内部数学布局
  return new LayoutMathMLBlock(this);
}

void MathMLAnchorElement::ParseAttribute(const AttributeModificationParams& params) {
  if (params.name == mathml_names::kHrefAttr) {
    SetIsLink(!params.new_value.IsNull());
    PseudoStateChanged(CSSSelector::kPseudoAnyLink);
    PseudoStateChanged(CSSSelector::kPseudoLink);
  } else if (params.name == mathml_names::kRelAttr) {
    link_relations_ = AnchorElementUtils::ParseRelAttribute(params.new_value, GetDocument());
  } else {
    MathMLElement::ParseAttribute(params);
  }
}

void MathMLAnchorElement::DefaultEventHandler(Event& event) {
  if (IsLink()) {
    // 处理 Enter 键触发链接
    if (event.type() == event_type_names::kKeydown && IsEnterKeyKeydownEvent(event)) {
      event.SetDefaultHandled();
      DispatchSimulatedClick(&event);
      return;
    }
    // 处理鼠标点击
    if (event.type() == event_type_names::kClick && event.IsMouseEvent()) {
      HandleClick(To<MouseEvent>(event));
      return;
    }
  }
  MathMLElement::DefaultEventHandler(event);
}

void MathMLAnchorElement::HandleClick(MouseEvent& event) {
  event.SetDefaultHandled();
  
  KURL completed_url = GetDocument().CompleteURL(FastGetAttribute(mathml_names::kHrefAttr));
  
  // 发送 Ping 统计 (复用 HTML 的逻辑)
  AnchorElementUtils::SendPings(completed_url, GetDocument(), FastGetAttribute(mathml_names::kPingAttr));

  // 具体的跳转逻辑可以进一步抽象，或直接调用 Frame 导航
  // 参考 HTMLAnchorElementBase::NavigateToHyperlink
}

int MathMLAnchorElement::DefaultTabIndex() const {
  return 0; // 默认可聚焦
}

bool MathMLAnchorElement::IsFocusableState(UpdateBehavior update_behavior) const {
  if (IsLink()) return true;
  return MathMLElement::IsFocusableState(update_behavior);
}

bool MathMLAnchorElement::IsURLAttribute(const Attribute& attribute) const {
  return attribute.GetName() == mathml_names::kHrefAttr || MathMLElement::IsURLAttribute(attribute);
}

void MathMLAnchorElement::Trace(Visitor* visitor) const {
  MathMLElement::Trace(visitor);
}

}  // namespace blink

```


```css
/* renderer/core/css/mathml.css */
math a:-webkit-any-link {
    cursor: pointer;
    text-decoration: none; 数学公式通常不加下划线
}
```

```json
// mathml_tag_names.json5

```