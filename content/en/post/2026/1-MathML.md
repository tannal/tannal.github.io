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
// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// https://mathml-refresh.github.io/mathml-core/#dom-and-global-attributes
[Exposed=Window]
interface MathMLAnchorElement : MathMLElement {
    [CEReactions, Reflect] attribute USVString href;
    [CEReactions, Reflect] attribute DOMString target;
    [CEReactions, Reflect] attribute DOMString download;
    [CEReactions, Reflect] attribute DOMString rel;
    [CEReactions, Reflect, ReflectOnly="noreferrer", ReflectOnly="no-referrer", ReflectOnly="origin", ReflectOnly="no-referrer-when-downgrade", ReflectOnly="origin-when-cross-origin", ReflectOnly="unsafe-url"] attribute DOMString referrerpolicy;
    [PutForwards=value] readonly attribute DOMTokenList relList;

    // 添加 Ping 属性以对齐 HTML/SVG 的功能
    [CEReactions, Reflect] attribute DOMString ping;
};
```

```c++
// mathml_anchor_element.h

// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#ifndef THIRD_PARTY_BLINK_RENDERER_CORE_MATHML_MATHML_ANCHOR_ELEMENT_H_
#define THIRD_PARTY_BLINK_RENDERER_CORE_MATHML_MATHML_ANCHOR_ELEMENT_H_

#include "third_party/blink/renderer/core/core_export.h"
#include "third_party/blink/renderer/core/dom/rel_list.h"
#include "third_party/blink/renderer/core/mathml/mathml_element.h"

namespace blink {

class MouseEvent;

class CORE_EXPORT MathMLAnchorElement final : public MathMLElement {
  DEFINE_WRAPPERTYPEINFO();

 public:
  explicit MathMLAnchorElement(Document&);

  void Trace(Visitor*) const override;

  // 链接核心状态
  bool HasActivationBehavior() const override;
  void DefaultEventHandler(Event&) override;
  bool IsInteractiveContent() const override { return true; }

  // 属性解析
  void ParseAttribute(const AttributeModificationParams&) override;
  bool IsURLAttribute(const Attribute&) const override;
  
  // 布局与焦点
  LayoutObject* CreateLayoutObject(const ComputedStyle&) override;
  FocusableState SupportsFocus(UpdateBehavior) const override;
  int DefaultTabIndex() const override;

  RelList* relList() const { return rel_list_.Get(); }

 private:
  void HandleClick(MouseEvent&);
  
  Member<RelList> rel_list_;
  unsigned link_relations_ : 16;
};

}  // namespace blink

#endif  // THIRD_PARTY_BLINK_RENDERER_CORE_MATHML_MATHML_ANCHOR_ELEMENT_H_
```



```c++
// mathml_anchor_element.cc
// Copyright 2026 The Chromium Authors
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

#include "third_party/blink/renderer/core/mathml/mathml_anchor_element.h"

#include "third_party/blink/renderer/core/dom/document.h"
#include "third_party/blink/renderer/core/events/mouse_event.h"
#include "third_party/blink/renderer/core/html/anchor_element_utils.h"
#include "third_party/blink/renderer/core/html/html_anchor_element.h"
#include "third_party/blink/renderer/core/layout/mathml/layout_mathml_block.h"
#include "third_party/blink/renderer/core/mathml_names.h"
#include "third_party/blink/renderer/core/loader/frame_load_request.h"
#include "third_party/blink/renderer/platform/weborigin/security_origin.h"

namespace blink {

MathMLAnchorElement::MathMLAnchorElement(Document& document)
    : MathMLElement(mathml_names::kATag, document),
      rel_list_(MakeGarbageCollected<RelList>(this, mathml_names::kRelAttr)),
      link_relations_(0) {}

void MathMLAnchorElement::Trace(Visitor* visitor) const {
  visitor->Trace(rel_list_);
  MathMLElement::Trace(visitor);
}

LayoutObject* MathMLAnchorElement::CreateLayoutObject(const ComputedStyle& style) {
  // 借鉴 SVG：MathML <a> 作为一个“透明”的容器块
  // LayoutMathMLBlock 会根据 MathML 规则排列其子元素
  return MakeGarbageCollected<LayoutMathMLBlock>(this);
}

void MathMLAnchorElement::ParseAttribute(const AttributeModificationParams& params) {
  if (params.name == mathml_names::kHrefAttr) {
    bool was_link = IsLink();
    SetIsLink(!params.new_value.IsNull());
    if (was_link != IsLink()) {
      PseudoStateChanged(CSSSelector::kPseudoLink);
      PseudoStateChanged(CSSSelector::kPseudoVisited);
      PseudoStateChanged(CSSSelector::kPseudoAnyLink);
    }
  } else if (params.name == mathml_names::kRelAttr) {
    link_relations_ = AnchorElementUtils::ParseRelAttribute(params.new_value, GetDocument());
    rel_list_->DidUpdateAttributeValue(params.old_value, params.new_value);
  } else {
    MathMLElement::ParseAttribute(params);
  }
}

bool MathMLAnchorElement::IsURLAttribute(const Attribute& attribute) const {
  return attribute.GetName() == mathml_names::kHrefAttr ||
         MathMLElement::IsURLAttribute(attribute);
}

bool MathMLAnchorElement::HasActivationBehavior() const {
  return IsLink();
}

void MathMLAnchorElement::DefaultEventHandler(Event& event) {
  if (IsLink()) {
    // 1. 处理键盘激活 (Enter)
    if (IsFocused() && IsEnterKeyKeydownEvent(event)) {
      event.SetDefaultHandled();
      DispatchSimulatedClick(&event);
      return;
    }

    // 2. 处理鼠标点击
    if (IsLinkClick(event)) {
      HandleClick(To<MouseEvent>(event));
      return;
    }
  }
  MathMLElement::DefaultEventHandler(event);
}

void MathMLAnchorElement::HandleClick(MouseEvent& event) {
  event.SetDefaultHandled();

  LocalDOMWindow* window = GetDocument().domWindow();
  if (!window || !window->GetFrame()) return;

  const KURL& completed_url = GetDocument().CompleteURL(
      StripLeadingAndTrailingHtmlSpaces(FastGetAttribute(mathml_names::kHrefAttr)));

  AnchorElementUtils::SendPings(completed_url, GetDocument(), FastGetAttribute(mathml_names::kPingAttr));

  ResourceRequest request(completed_url);
  AnchorElementUtils::HandleReferrerPolicyAttribute(
request, FastGetAttribute(mathml_names::kReferrerpolicyAttr), link_relations_, GetDocument());

    if (AnchorElementUtils::HasRel(link_relations_, kRelationNoReferrer)) {
        request.SetReferrerPolicy(network::mojom::ReferrerPolicy::kNever);
    }
  
  request.SetHasUserGesture(LocalFrame::HasTransientUserActivation(window->GetFrame()));
  NavigationPolicy navigation_policy = NavigationPolicyFromEvent(&event);

  if (FastHasAttribute(mathml_names::kDownloadAttr) &&
      navigation_policy != kNavigationPolicyDownload &&
      window->GetSecurityOrigin()->CanReadContent(completed_url)) {
    const String download_attr = FastGetAttribute(mathml_names::kDownloadAttr);
    AnchorElementUtils::HandleDownloadAttribute(this, download_attr, completed_url, window, event.isTrusted(), std::move(request));
    return;
  }

  FrameLoadRequest frame_request(window, request);
  frame_request.SetNavigationPolicy(navigation_policy);
  frame_request.SetClientNavigationReason(ClientNavigationReason::kAnchorClick);
  frame_request.SetSourceElement(this);

  // 建议在 NavigateToHyperlink 或 HandleClick 中加入针对隐私的逻辑
    if (AnchorElementUtils::HasRel(link_relations_, kRelationNoOpener)) {
        frame_request.SetNoOpener();
    }
  
  AtomicString target(FastGetAttribute(mathml_names::kTargetAttr));
  frame_request.SetTriggeringEventInfo(event.isTrusted() ? mojom::blink::TriggeringEventInfo::kFromTrustedEvent : mojom::blink::TriggeringEventInfo::kFromUntrustedEvent);

  if (Frame* target_frame = window->GetFrame()->Tree().FindOrCreateFrameForNavigation(frame_request, target).frame) {
    target_frame->Navigate(frame_request, WebFrameLoadType::kStandard);
  }
}

FocusableState MathMLAnchorElement::SupportsFocus(UpdateBehavior update_behavior) const {
  if (IsLink()) return FocusableState::kFocusable;
  return MathMLElement::SupportsFocus(update_behavior);
}

int MathMLAnchorElement::DefaultTabIndex() const {
  return 0;
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
// third_party/blink/renderer/core/mathml_tag_names.json5
{
  name: "a",
  interfaceName: "MathMLAnchorElement",
},
```

```gni
// third_party/blink/renderer/core/core_idl_files.gni
mathml_anchor_element.idl
```

```gni
// third_party/blink/renderer/core/mathml/build.gni
mathml_anchor_element.cc
mathml_anchor_element.h
```