export interface DomNodeData {
  tagName: string;
  classes: string[];
  attributes: Record<string, string>;
  text?: string;
  children: DomNodeData[];
  styles: Record<string, string>;
}

export function extractDomNode(
  el: Element,
  stylesToCapture: string[],
): DomNodeData {
  const data: DomNodeData = {
    tagName: el.tagName.toLowerCase(),
    classes: Array.from(el.classList),
    attributes: {},
    children: [],
    styles: {},
  };

  // Capture all attributes except class and style (which we handle separately)
  for (const attr of Array.from(el.attributes)) {
    if (attr.name !== "class" && attr.name !== "style") {
      data.attributes[attr.name] = attr.value;
    }
  }

  // Capture text content if this node has direct text children
  let text = "";
  for (const child of Array.from(el.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += (child.textContent || "").trim();
    }
  }
  if (text) {
    data.text = text;
  }

  // Capture computed styles
  const computed = window.getComputedStyle(el);
  for (const prop of stylesToCapture) {
    data.styles[prop] = computed.getPropertyValue(prop);
  }

  // Recursively capture element children
  for (const child of Array.from(el.children)) {
    data.children.push(extractDomNode(child, stylesToCapture));
  }

  return data;
}

export const COMMON_STYLES_TO_CAPTURE = [
  "color",
  "background-color",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "border-radius",
  "font-size",
  "font-weight",
  "line-height",
  "display",
  "flex-direction",
  "justify-content",
  "align-items",
  "gap",
  "height",
  "min-height",
];
