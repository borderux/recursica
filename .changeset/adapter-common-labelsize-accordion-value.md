---
"@recursica/adapter-common": patch
---

Removed the never-real `"md"` `labelSize` option (`RecursicaLabelProps`, `RecursicaFormControlLayoutProps`) and made `Accordion.Item`'s `value` required — both were already true in practice, now enforced by the type. `wrapComponent` also now guards ref-forwarding to only components that can accept one (class/forwardRef/memo), warning in dev instead of letting React's generic "function components cannot be given refs" warning fire blind.
