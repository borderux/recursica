import{r as g,j as e,u as be,v as Se,f as E}from"./iframe-BlyjOLeZ.js";import{f as Je,c as xe,A as Qe}from"./AccordionChevron-DlYzb6mD.js";import{u as Ye}from"./use-resolved-styles-api-2MHpnRPU.js";import{f as q,u as _,B as ve,d as Ze,l as en,c as ye}from"./factory-DLKEpXnh.js";import{P as B,g as nn}from"./Popover-BpKYIAyi.js";import{c as tn}from"./create-safe-context-CRk0O2Fc.js";import{u as U}from"./use-merged-ref-CDkXI1t3.js";import{p as Ie}from"./polymorphic-factory-CAKH0E_l.js";import{u as je}from"./DirectionProvider-CQWcqr2e.js";import{U as De}from"./UnstyledButton-cwPISIpE.js";import{c as on}from"./create-optional-context-CuMWPfVc.js";import{i as sn}from"./is-element-CbOZpKwN.js";import{u as rn}from"./use-id-DcT11W9b.js";import{u as an}from"./use-uncontrolled-4Xxxmxi9.js";import{B as G}from"./Button-BCD_j59f.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-AZBW9FMn.js";import"./index-B7PH_peB.js";import"./index-DJkV7rdH.js";import"./Transition-Bar4Phoa.js";import"./use-reduced-motion-DlBLUqd4.js";import"./Loader-CG0knn21.js";function x(a,n){return t=>{a==null||a(t),n==null||n(t)}}function ln(a,n,t){var i;return t?Array.from(((i=Je(t,n))==null?void 0:i.querySelectorAll(a))||[]).findIndex(s=>s===t):null}function cn(a=!1,n={}){const[t,i]=g.useState(a),s=g.useCallback(()=>{i(c=>{var m;return c||((m=n.onOpen)==null||m.call(n),!0)})},[n.onOpen]),o=g.useCallback(()=>{i(c=>{var m;return c&&((m=n.onClose)==null||m.call(n),!1)})},[n.onClose]),l=g.useCallback(()=>{t?o():s()},[o,s,t]);return[t,{open:s,close:o,toggle:l}]}function _e({open:a,close:n,openDelay:t,closeDelay:i}){const s=g.useRef(-1),o=g.useRef(-1),l=()=>{window.clearTimeout(s.current),window.clearTimeout(o.current)},c=()=>{l(),t===0||t===void 0?a():s.current=window.setTimeout(a,t)},m=()=>{l(),i===0||i===void 0?n():o.current=window.setTimeout(n,i)};return g.useEffect(()=>l,[]),{openDropdown:c,closeDropdown:m}}const[un,T]=tn("Menu component was not found in the tree");var N={dropdown:"m_dc9b7c9f",label:"m_9bfac126",divider:"m_efdf90cb",item:"m_99ac2aa1",itemLabel:"m_5476e0d3",itemSection:"m_8b75e504",chevron:"m_b85b0bed"};const Q=q((a,n)=>{const{classNames:t,className:i,style:s,styles:o,vars:l,...c}=_("MenuDivider",null,a),m=T();return e.jsx(ve,{ref:n,...m.getStyles("divider",{className:i,style:s,styles:o,classNames:t}),...c})});Q.classes=N;Q.displayName="@mantine/core/MenuDivider";const Y=q((a,n)=>{const{classNames:t,className:i,style:s,styles:o,vars:l,onMouseEnter:c,onMouseLeave:m,onKeyDown:v,children:b,...y}=_("MenuDropdown",null,a),f=g.useRef(null),M=T(),p=x(v,S=>{var k,L;(S.key==="ArrowUp"||S.key==="ArrowDown")&&(S.preventDefault(),(L=(k=f.current)==null?void 0:k.querySelectorAll("[data-menu-item]:not(:disabled)")[0])==null||L.focus())}),u=x(c,()=>(M.trigger==="hover"||M.trigger==="click-hover")&&M.openDropdown()),d=x(m,()=>(M.trigger==="hover"||M.trigger==="click-hover")&&M.closeDropdown());return e.jsxs(B.Dropdown,{...y,onMouseEnter:u,onMouseLeave:d,role:"menu","aria-orientation":"vertical",ref:U(n,f),...M.getStyles("dropdown",{className:i,style:s,styles:o,classNames:t,withStaticClass:!1}),tabIndex:-1,"data-menu-dropdown":!0,onKeyDown:p,children:[M.withInitialFocusPlaceholder&&e.jsx("div",{tabIndex:-1,"data-autofocus":!0,"data-mantine-stop-propagation":!0,style:{outline:0}}),b]})});Y.classes=N;Y.displayName="@mantine/core/MenuDropdown";const[dn,H]=on(),Z=Ie((a,n)=>{const{classNames:t,className:i,style:s,styles:o,vars:l,color:c,closeMenuOnClick:m,leftSection:v,rightSection:b,children:y,disabled:f,"data-disabled":M,...p}=_("MenuItem",null,a),u=T(),d=H(),S=be(),{dir:k}=je(),L=g.useRef(null),D=p,I=x(D.onClick,()=>{M||(typeof m=="boolean"?m&&u.closeDropdownImmediately():u.closeOnItemClick&&u.closeDropdownImmediately())}),w=c?S.variantColorResolver({color:c,theme:S,variant:"light"}):void 0,j=c?Se({color:c,theme:S}):null,F=x(D.onKeyDown,P=>{P.key==="ArrowLeft"&&d&&(d.close(),d.focusParentItem())});return e.jsxs(De,{onMouseDown:P=>P.preventDefault(),...p,unstyled:u.unstyled,tabIndex:u.menuItemTabIndex,...u.getStyles("item",{className:i,style:s,styles:o,classNames:t}),ref:U(L,n),role:"menuitem",disabled:f,"data-menu-item":!0,"data-disabled":f||M||void 0,"data-mantine-stop-propagation":!0,onClick:I,onKeyDown:xe({siblingSelector:"[data-menu-item]:not([data-disabled])",parentSelector:"[data-menu-dropdown]",activateOnFocus:!1,loop:u.loop,dir:k,orientation:"vertical",onKeyDown:F}),__vars:{"--menu-item-color":j!=null&&j.isThemeColor&&(j==null?void 0:j.shade)===void 0?`var(--mantine-color-${j.color}-6)`:w==null?void 0:w.color,"--menu-item-hover":w==null?void 0:w.hover},children:[v&&e.jsx("div",{...u.getStyles("itemSection",{styles:o,classNames:t}),"data-position":"left",children:v}),y&&e.jsx("div",{...u.getStyles("itemLabel",{styles:o,classNames:t}),children:y}),b&&e.jsx("div",{...u.getStyles("itemSection",{styles:o,classNames:t}),"data-position":"right",children:b})]})});Z.classes=N;Z.displayName="@mantine/core/MenuItem";const ee=q((a,n)=>{const{classNames:t,className:i,style:s,styles:o,vars:l,...c}=_("MenuLabel",null,a),m=T();return e.jsx(ve,{ref:n,...m.getStyles("label",{className:i,style:s,styles:o,classNames:t}),...c})});ee.classes=N;ee.displayName="@mantine/core/MenuLabel";const ne=q((a,n)=>{const{classNames:t,className:i,style:s,styles:o,vars:l,onMouseEnter:c,onMouseLeave:m,onKeyDown:v,children:b,...y}=_("MenuSubDropdown",null,a),f=g.useRef(null),M=T(),p=H(),u=x(c,p==null?void 0:p.open),d=x(m,p==null?void 0:p.close);return e.jsx(B.Dropdown,{...y,onMouseEnter:u,onMouseLeave:d,role:"menu","aria-orientation":"vertical",ref:U(n,f),...M.getStyles("dropdown",{className:i,style:s,styles:o,classNames:t,withStaticClass:!1}),tabIndex:-1,"data-menu-dropdown":!0,children:b})});ne.classes=N;ne.displayName="@mantine/core/MenuSubDropdown";const te=Ie((a,n)=>{const{classNames:t,className:i,style:s,styles:o,vars:l,color:c,leftSection:m,rightSection:v,children:b,disabled:y,"data-disabled":f,closeMenuOnClick:M,...p}=_("MenuSubItem",null,a),u=T(),d=H(),S=be(),{dir:k}=je(),L=g.useRef(null),D=p,I=c?S.variantColorResolver({color:c,theme:S,variant:"light"}):void 0,w=c?Se({color:c,theme:S}):null,j=x(D.onKeyDown,A=>{A.key==="ArrowRight"&&(d==null||d.open(),d==null||d.focusFirstItem()),A.key==="ArrowLeft"&&(d!=null&&d.parentContext)&&(d.parentContext.close(),d.parentContext.focusParentItem())}),F=x(D.onClick,()=>{!f&&M&&u.closeDropdownImmediately()}),P=x(D.onMouseEnter,d==null?void 0:d.open),C=x(D.onMouseLeave,d==null?void 0:d.close);return e.jsxs(De,{onMouseDown:A=>A.preventDefault(),...p,unstyled:u.unstyled,tabIndex:u.menuItemTabIndex,...u.getStyles("item",{className:i,style:s,styles:o,classNames:t}),ref:U(L,n),role:"menuitem",disabled:y,"data-menu-item":!0,"data-sub-menu-item":!0,"data-disabled":y||f||void 0,"data-mantine-stop-propagation":!0,onMouseEnter:P,onMouseLeave:C,onClick:F,onKeyDown:xe({siblingSelector:"[data-menu-item]:not([data-disabled])",parentSelector:"[data-menu-dropdown]",activateOnFocus:!1,loop:u.loop,dir:k,orientation:"vertical",onKeyDown:j}),__vars:{"--menu-item-color":w!=null&&w.isThemeColor&&(w==null?void 0:w.shade)===void 0?`var(--mantine-color-${w.color}-6)`:I==null?void 0:I.color,"--menu-item-hover":I==null?void 0:I.hover},children:[m&&e.jsx("div",{...u.getStyles("itemSection",{styles:o,classNames:t}),"data-position":"left",children:m}),b&&e.jsx("div",{...u.getStyles("itemLabel",{styles:o,classNames:t}),children:b}),e.jsx("div",{...u.getStyles("itemSection",{styles:o,classNames:t}),"data-position":"right",children:v||e.jsx(Qe,{...u.getStyles("chevron"),size:14})})]})});te.classes=N;te.displayName="@mantine/core/MenuSubItem";function ke({children:a,refProp:n}){if(!sn(a))throw new Error("Menu.Sub.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");return T(),e.jsx(B.Target,{refProp:n,popupType:"menu",children:a})}ke.displayName="@mantine/core/MenuSubTarget";const mn={offset:0,position:"right-start",transitionProps:{duration:0},openDelay:0,middlewares:{shift:{crossAxis:!0}}};function O(a){const{children:n,closeDelay:t,openDelay:i,...s}=_("MenuSub",mn,a),o=rn(),[l,{open:c,close:m}]=cn(!1),v=H(),{openDropdown:b,closeDropdown:y}=_e({open:c,close:m,closeDelay:t,openDelay:i}),f=()=>window.setTimeout(()=>{var p,u;(u=(p=document.getElementById(`${o}-dropdown`))==null?void 0:p.querySelectorAll("[data-menu-item]:not([data-disabled])")[0])==null||u.focus()},16),M=()=>window.setTimeout(()=>{var p;(p=document.getElementById(`${o}-target`))==null||p.focus()},16);return e.jsx(dn,{value:{opened:l,close:y,open:b,focusFirstItem:f,focusParentItem:M,parentContext:v},children:e.jsx(B,{opened:l,withinPortal:!1,withArrow:!1,id:o,...s,children:n})})}O.extend=a=>a;O.displayName="@mantine/core/MenuSub";O.Target=ke;O.Dropdown=ne;O.Item=te;const pn={refProp:"ref"},Te=g.forwardRef((a,n)=>{const{children:t,refProp:i,...s}=_("MenuTarget",pn,a),o=nn(t);if(!o)throw new Error("Menu.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");const l=T(),c=o.props,m=x(c.onClick,()=>{l.trigger==="click"?l.toggleDropdown():l.trigger==="click-hover"&&(l.setOpenedViaClick(!0),l.opened||l.openDropdown())}),v=x(c.onMouseEnter,()=>(l.trigger==="hover"||l.trigger==="click-hover")&&l.openDropdown()),b=x(c.onMouseLeave,()=>{(l.trigger==="hover"||l.trigger==="click-hover"&&!l.openedViaClick)&&l.closeDropdown()});return e.jsx(B.Target,{refProp:i,popupType:"menu",ref:n,...s,children:g.cloneElement(o,{onClick:m,onMouseEnter:v,onMouseLeave:b,"data-expanded":l.opened?!0:void 0})})});Te.displayName="@mantine/core/MenuTarget";const hn={trapFocus:!0,closeOnItemClick:!0,withInitialFocusPlaceholder:!0,clickOutsideEvents:["mousedown","touchstart","keydown"],loop:!0,trigger:"click",openDelay:0,closeDelay:100,menuItemTabIndex:-1};function h(a){const n=_("Menu",hn,a),{children:t,onOpen:i,onClose:s,opened:o,defaultOpened:l,trapFocus:c,onChange:m,closeOnItemClick:v,loop:b,closeOnEscape:y,trigger:f,openDelay:M,closeDelay:p,classNames:u,styles:d,unstyled:S,variant:k,vars:L,menuItemTabIndex:D,keepMounted:I,withInitialFocusPlaceholder:w,attributes:j,...F}=n,P=Ze({name:"Menu",classes:N,props:n,classNames:u,styles:d,unstyled:S,attributes:j}),[C,A]=an({value:o,defaultValue:l,finalValue:!1,onChange:m}),[Ve,re]=g.useState(!1),$=()=>{A(!1),re(!1),C&&(s==null||s())},J=()=>{A(!0),!C&&(i==null||i())},ae=()=>{C?$():J()},{openDropdown:We,closeDropdown:qe}=_e({open:J,close:$,closeDelay:p,openDelay:M}),Ue=Xe=>ln("[data-menu-item]","[data-menu-dropdown]",Xe),{resolvedClassNames:Ge,resolvedStyles:He}=Ye({classNames:u,styles:d,props:n});return e.jsx(un,{value:{getStyles:P,opened:C,toggleDropdown:ae,getItemIndex:Ue,openedViaClick:Ve,setOpenedViaClick:re,closeOnItemClick:v,closeDropdown:f==="click"?$:qe,openDropdown:f==="click"?J:We,closeDropdownImmediately:$,loop:b,trigger:f,unstyled:S,menuItemTabIndex:D,withInitialFocusPlaceholder:w},children:e.jsx(B,{returnFocus:!0,...F,opened:C,onChange:ae,defaultOpened:l,trapFocus:I?!1:c,closeOnEscape:y,__staticSelector:"Menu",classNames:Ge,styles:He,unstyled:S,variant:k,keepMounted:I,children:t})})}h.extend=a=>a;h.withProps=en(h);h.classes=N;h.displayName="@mantine/core/Menu";h.Item=Z;h.Label=ee;h.Dropdown=Y;h.Target=Te;h.Divider=Q;h.Sub=O;const gn="Menu-module__dropdown___j4xuA",Mn="Menu-module__item___NMXha",fn="Menu-module__itemLabel___zvcqC",wn="Menu-module__itemSection___pRIcn",bn="Menu-module__divider___wPiNq",Sn="Menu-module__label___4FBGa",xn="Menu-module__chevron___hEEiy",R={dropdown:gn,item:Mn,itemLabel:fn,itemSection:wn,divider:bn,label:Sn,chevron:xn},Ne=function({overStyled:n=!1,...t}){const i=E(t,n),s={dropdown:R.dropdown,item:R.item,itemLabel:R.itemLabel,itemSection:R.itemSection,divider:R.divider,label:R.label,chevron:R.chevron},o=i.classNames;if(o&&typeof o=="object"&&!Array.isArray(o)){const l=o;Object.keys(l).forEach(c=>{s[c]?s[c]=`${s[c]} ${l[c]}`:s[c]=l[c]})}return e.jsx(h,{classNames:s,...i})};Ne.displayName="Menu";const Le=function(n){return e.jsx(h.Target,{...n})};Le.displayName="MenuTarget";const Pe=g.forwardRef(function({overStyled:n=!1,...t},i){const s=E(t,n),o=s.className;return e.jsx(h.Dropdown,{ref:i,className:o,...s})});Pe.displayName="MenuDropdown";const Ce=g.forwardRef(function({overStyled:n=!1,...t},i){const s=E(t,n),o=s;n||delete o.color;const l=o.className;return e.jsx(h.Item,{ref:i,className:l,...s})});Ce.displayName="MenuItem";const vn=ye(Ce),Ae=g.forwardRef(function({overStyled:n=!1,...t},i){const s=E(t,n),o=s.className;return e.jsx(h.Divider,{ref:i,className:o,...s})});Ae.displayName="MenuDivider";const Re=g.forwardRef(function({overStyled:n=!1,...t},i){const s=E(t,n),o=s.className;return e.jsx(h.Label,{ref:i,className:o,...s})});Re.displayName="MenuLabel";const Ee=function(n){return e.jsx(h.Sub,{...n})};Ee.displayName="MenuSub";const Be=function(n){return e.jsx(h.Sub.Target,{...n})};Be.displayName="MenuSubTarget";const Oe=g.forwardRef(function({overStyled:n=!1,...t},i){const s=E(t,n),o=s;n||delete o.color;const l=o.className;return e.jsx(h.Sub.Item,{ref:i,className:l,...s})});Oe.displayName="MenuSubItem";const yn=ye(Oe),Fe=g.forwardRef(function({overStyled:n=!1,...t},i){const s=E(t,n),o=s.className;return e.jsx(h.Sub.Dropdown,{ref:i,className:o,...s})});Fe.displayName="MenuSubDropdown";const X=Ee;X.Target=Be;X.Item=yn;X.Dropdown=Fe;const r=Ne;r.Target=Le;r.Dropdown=Pe;r.Item=vn;r.Divider=Ae;r.Label=Re;r.Sub=X;try{r.displayName="Menu",r.__docgenInfo={description:"",displayName:"Menu",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Menu/Menu.tsx",methods:[],props:{disabled:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"},{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"}],description:"If set, popover dropdown will not be rendered",name:"disabled",parent:{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const oe=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"12",cy:"12",r:"3"}),e.jsx("path",{d:"M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"})]}),$e=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("circle",{cx:"11",cy:"11",r:"8"}),e.jsx("line",{x1:"21",y1:"21",x2:"16.65",y2:"16.65"})]}),se=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})}),Ke=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("circle",{cx:"8.5",cy:"8.5",r:"1.5"}),e.jsx("polyline",{points:"21 15 16 10 5 21"})]}),ze=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"3 6 5 6 21 6"}),e.jsx("path",{d:"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"})]}),In=()=>e.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"14",height:"14",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("polyline",{points:"17 1 21 5 17 9"}),e.jsx("path",{d:"M3 11V9a4 4 0 0 1 4-4h14"}),e.jsx("polyline",{points:"7 23 3 19 7 15"}),e.jsx("path",{d:"M21 13v2a4 4 0 0 1-4 4H3"})]}),Gn={title:"UI-Kit/Menu",component:r,tags:["autodocs"],argTypes:{trigger:{control:"select",options:["click","hover","click-hover"],description:"Determines how the menu is triggered: click (default), hover, or both."},position:{control:"select",options:["bottom","bottom-start","bottom-end","top","top-start","top-end","left","left-start","left-end","right","right-start","right-end"],description:"The position of the dropdown relative to the target."},withArrow:{control:"boolean",description:"Whether to display an arrow pointing to the target."},offset:{control:"number",description:"Distance in px between the dropdown and the target element."},opened:{control:"boolean",description:"Controlled open state. Leave undefined for uncontrolled behavior."}},parameters:{docs:{description:{component:"\nThe `Menu` component combines a list of secondary actions into a single interactive overlay area, wrapping Mantine's composable `Menu` while enforcing strict Recursica design token styling.\n\n### Composable API\n\nMenu uses a dot-notation composition pattern:\n- `<Menu>` — Root container managing open/close state\n- `<Menu.Target>` — Wrapper for the trigger element (must be a single element supporting ref)\n- `<Menu.Dropdown>` — The popup panel\n- `<Menu.Item>` — An actionable item with optional `leftSection` / `rightSection`\n- `<Menu.Divider>` — A visual separator\n- `<Menu.Label>` — A non-interactive section header\n\n### Sub-menus\nNested menus are supported via `<Menu.Sub>`, `<Menu.Sub.Target>`, `<Menu.Sub.Item>`, and `<Menu.Sub.Dropdown>`.\n\n### Design Token Limitations\nMantine's `color` prop on `Menu.Item` is stripped in strict mode to enforce design token adherence. Use `overStyled={true}` to bypass this restriction.\n        "}}}},K={args:{trigger:"click",position:"bottom-start",withArrow:!1,offset:5,opened:void 0},render:({withLayer:a,layer:n,...t})=>e.jsxs(r,{...t,children:[e.jsx(r.Target,{children:e.jsx(G,{variant:"solid",children:"Toggle Menu"})}),e.jsxs(r.Dropdown,{children:[e.jsx(r.Label,{children:"Application"}),e.jsx(r.Item,{leftSection:e.jsx(oe,{}),children:"Settings"}),e.jsx(r.Item,{leftSection:e.jsx(se,{}),children:"Messages"}),e.jsx(r.Item,{leftSection:e.jsx(Ke,{}),children:"Gallery"}),e.jsx(r.Item,{leftSection:e.jsx($e,{}),children:"Search"}),e.jsx(r.Divider,{}),e.jsx(r.Label,{children:"Danger zone"}),e.jsx(r.Item,{leftSection:e.jsx(In,{}),children:"Transfer my data"}),e.jsx(r.Item,{leftSection:e.jsx(ze,{}),children:"Delete my account"})]})]})},z={args:{position:"bottom-start"},render:({withLayer:a,layer:n,...t})=>e.jsxs(r,{...t,children:[e.jsx(r.Target,{children:e.jsx(G,{variant:"solid",children:"Menu with Disabled"})}),e.jsxs(r.Dropdown,{children:[e.jsx(r.Item,{leftSection:e.jsx(oe,{}),children:"Settings"}),e.jsx(r.Item,{leftSection:e.jsx($e,{}),disabled:!0,children:"Search (disabled)"}),e.jsx(r.Item,{leftSection:e.jsx(se,{}),children:"Messages"}),e.jsx(r.Item,{leftSection:e.jsx(ze,{}),disabled:!0,children:"Delete (disabled)"})]})]})},V={args:{position:"bottom-start",width:200},render:({withLayer:a,layer:n,...t})=>e.jsxs(r,{...t,children:[e.jsx(r.Target,{children:e.jsx(G,{variant:"solid",children:"Menu with Submenus"})}),e.jsxs(r.Dropdown,{children:[e.jsx(r.Item,{children:"Dashboard"}),e.jsxs(r.Sub,{children:[e.jsx(r.Sub.Target,{children:e.jsx(r.Sub.Item,{children:"Products"})}),e.jsxs(r.Sub.Dropdown,{children:[e.jsx(r.Item,{children:"All products"}),e.jsx(r.Item,{children:"Categories"}),e.jsx(r.Item,{children:"Tags"})]})]}),e.jsxs(r.Sub,{children:[e.jsx(r.Sub.Target,{children:e.jsx(r.Sub.Item,{children:"Orders"})}),e.jsxs(r.Sub.Dropdown,{children:[e.jsx(r.Item,{children:"Open"}),e.jsx(r.Item,{children:"Completed"}),e.jsx(r.Item,{children:"Cancelled"})]})]})]})]})},W={args:{trigger:"click-hover",position:"bottom-start",openDelay:100,closeDelay:400},render:({withLayer:a,layer:n,...t})=>e.jsxs(r,{...t,children:[e.jsx(r.Target,{children:e.jsx(G,{variant:"solid",children:"Hover or Click"})}),e.jsxs(r.Dropdown,{children:[e.jsx(r.Item,{leftSection:e.jsx(oe,{}),children:"Settings"}),e.jsx(r.Item,{leftSection:e.jsx(se,{}),children:"Messages"}),e.jsx(r.Item,{leftSection:e.jsx(Ke,{}),children:"Gallery"})]})]})};var ie,le,ce;K.parameters={...K.parameters,docs:{...(ie=K.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    trigger: "click",
    position: "bottom-start",
    withArrow: false,
    offset: 5,
    opened: undefined
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: MenuStoryArgs) => {
    return <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Toggle Menu</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item leftSection={<SettingsIcon />}>Settings</Menu.Item>
          <Menu.Item leftSection={<MessageIcon />}>Messages</Menu.Item>
          <Menu.Item leftSection={<ImageIcon />}>Gallery</Menu.Item>
          <Menu.Item leftSection={<SearchIcon />}>Search</Menu.Item>

          <Menu.Divider />

          <Menu.Label>Danger zone</Menu.Label>
          <Menu.Item leftSection={<ArrowsIcon />}>Transfer my data</Menu.Item>
          <Menu.Item leftSection={<TrashIcon />}>Delete my account</Menu.Item>
        </Menu.Dropdown>
      </Menu>;
  }
}`,...(ce=(le=K.parameters)==null?void 0:le.docs)==null?void 0:ce.source}}};var ue,de,me;z.parameters={...z.parameters,docs:{...(ue=z.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    position: "bottom-start"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: MenuStoryArgs) => {
    return <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Menu with Disabled</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<SettingsIcon />}>Settings</Menu.Item>
          <Menu.Item leftSection={<SearchIcon />} disabled>
            Search (disabled)
          </Menu.Item>
          <Menu.Item leftSection={<MessageIcon />}>Messages</Menu.Item>
          <Menu.Item leftSection={<TrashIcon />} disabled>
            Delete (disabled)
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>;
  }
}`,...(me=(de=z.parameters)==null?void 0:de.docs)==null?void 0:me.source}}};var pe,he,ge;V.parameters={...V.parameters,docs:{...(pe=V.parameters)==null?void 0:pe.docs,source:{originalSource:`{
  args: {
    position: "bottom-start",
    width: 200
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: MenuStoryArgs) => {
    return <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Menu with Submenus</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item>Dashboard</Menu.Item>
          <Menu.Sub>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Products</Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              <Menu.Item>All products</Menu.Item>
              <Menu.Item>Categories</Menu.Item>
              <Menu.Item>Tags</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>
          <Menu.Sub>
            <Menu.Sub.Target>
              <Menu.Sub.Item>Orders</Menu.Sub.Item>
            </Menu.Sub.Target>
            <Menu.Sub.Dropdown>
              <Menu.Item>Open</Menu.Item>
              <Menu.Item>Completed</Menu.Item>
              <Menu.Item>Cancelled</Menu.Item>
            </Menu.Sub.Dropdown>
          </Menu.Sub>
        </Menu.Dropdown>
      </Menu>;
  }
}`,...(ge=(he=V.parameters)==null?void 0:he.docs)==null?void 0:ge.source}}};var Me,fe,we;W.parameters={...W.parameters,docs:{...(Me=W.parameters)==null?void 0:Me.docs,source:{originalSource:`{
  args: {
    trigger: "click-hover",
    position: "bottom-start",
    openDelay: 100,
    closeDelay: 400
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: MenuStoryArgs) => {
    return <Menu {...args}>
        <Menu.Target>
          <Button variant="solid">Hover or Click</Button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item leftSection={<SettingsIcon />}>Settings</Menu.Item>
          <Menu.Item leftSection={<MessageIcon />}>Messages</Menu.Item>
          <Menu.Item leftSection={<ImageIcon />}>Gallery</Menu.Item>
        </Menu.Dropdown>
      </Menu>;
  }
}`,...(we=(fe=W.parameters)==null?void 0:fe.docs)==null?void 0:we.source}}};const Hn=["Default","WithDisabledItems","WithSubmenus","HoverTrigger"];export{K as Default,W as HoverTrigger,z as WithDisabledItems,V as WithSubmenus,Hn as __namedExportsOrder,Gn as default};
