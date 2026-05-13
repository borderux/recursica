import{j as e,a as re,r as x,f as Y}from"./iframe-CPRD1BZ_.js";import{d as k}from"./OptionalPortal-BH0pv5qp.js";import{f as w,u as P,d as ae,e as se}from"./factory-DllH8HeB.js";import{M as oe,a as le,N as ie,b as ce,c as de,d as ue,e as pe,f as me}from"./NativeScrollArea-CDc2bHvN.js";import{c as he}from"./create-safe-context-DSDxV5O1.js";import{g as fe}from"./get-size-lAorsOFx.js";import{u as ye}from"./DirectionProvider-CPEYBNBb.js";import{S as ge}from"./ScrollArea-C7GYjqR1.js";import{c as xe}from"./create-optional-context-y3J1oJwf.js";import{B as g}from"./Button-Cip-dCT5.js";import{T as R}from"./Text-CAypzHJq.js";import"./preload-helper-Dp1pzeXC.js";import"./is-element-MCYbaCYi.js";import"./index-DZtT_QSa.js";import"./index-DCSwIWTv.js";import"./use-merged-ref-DmCu7ozy.js";import"./use-reduced-motion-Be97HhIq.js";import"./use-id-Daj1AFU7.js";import"./FocusTrap-Bzyxp8Ra.js";import"./polymorphic-factory-cyn4qPiC.js";import"./CloseButton-zN3TM6ao.js";import"./UnstyledButton-DZIk5CDo.js";import"./Paper-C5mvTR7S.js";import"./Transition-tlfS5Czj.js";import"./to-int-PQE0s6ay.js";import"./Loader-DvAuwtdx.js";import"./Text-BaLAlZtB.js";var f={root:"m_f11b401e",header:"m_5a7c2c9",content:"m_b8a05bbd",inner:"m_31cd769a"};const[we,v]=he("Drawer component was not found in tree"),N=w((s,t)=>{const n=P("DrawerBody",null,s),{classNames:r,className:l,style:o,styles:i,vars:c,...d}=n,a=v();return e.jsx(oe,{ref:t,...a.getStyles("body",{classNames:r,style:o,styles:i,className:l}),...d})});N.classes=f;N.displayName="@mantine/core/DrawerBody";const j=w((s,t)=>{const n=P("DrawerCloseButton",null,s),{classNames:r,className:l,style:o,styles:i,vars:c,...d}=n,a=v();return e.jsx(le,{ref:t,...a.getStyles("close",{classNames:r,style:o,styles:i,className:l}),...d})});j.classes=f;j.displayName="@mantine/core/DrawerCloseButton";const D=w((s,t)=>{const n=P("DrawerContent",null,s),{classNames:r,className:l,style:o,styles:i,vars:c,children:d,radius:a,__hidden:h,...b}=n,u=v(),_=u.scrollAreaComponent||ie;return e.jsx(ce,{...u.getStyles("content",{className:l,style:o,styles:i,classNames:r}),innerProps:u.getStyles("inner",{className:l,style:o,styles:i,classNames:r}),ref:t,...b,radius:a||u.radius||0,"data-hidden":h||void 0,children:e.jsx(_,{style:{height:"calc(100vh - var(--drawer-offset) * 2)"},children:d})})});D.classes=f;D.displayName="@mantine/core/DrawerContent";const H=w((s,t)=>{const n=P("DrawerHeader",null,s),{classNames:r,className:l,style:o,styles:i,vars:c,...d}=n,a=v();return e.jsx(de,{ref:t,...a.getStyles("header",{classNames:r,style:o,styles:i,className:l}),...d})});H.classes=f;H.displayName="@mantine/core/DrawerHeader";const A=w((s,t)=>{const n=P("DrawerOverlay",null,s),{classNames:r,className:l,style:o,styles:i,vars:c,...d}=n,a=v();return e.jsx(ue,{ref:t,...a.getStyles("overlay",{classNames:r,style:o,styles:i,className:l}),...d})});A.classes=f;A.displayName="@mantine/core/DrawerOverlay";function Pe(s){switch(s){case"top":return"flex-start";case"bottom":return"flex-end";default:return}}function ve(s){if(s==="top"||s==="bottom")return"0 0 calc(100% - var(--drawer-offset, 0rem) * 2)"}const be={top:"slide-down",bottom:"slide-up",left:"slide-right",right:"slide-left"},_e={top:"slide-down",bottom:"slide-up",right:"slide-right",left:"slide-left"},Ce={closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:k("modal"),position:"left"},Se=se((s,{position:t,size:n,offset:r})=>({root:{"--drawer-size":fe(n,"drawer-size"),"--drawer-flex":ve(t),"--drawer-height":t==="left"||t==="right"?void 0:"var(--drawer-size)","--drawer-align":Pe(t),"--drawer-justify":t==="right"?"flex-end":void 0,"--drawer-offset":re(r)}})),F=w((s,t)=>{const n=P("DrawerRoot",Ce,s),{classNames:r,className:l,style:o,styles:i,unstyled:c,vars:d,scrollAreaComponent:a,position:h,transitionProps:b,radius:u,attributes:_,...I}=n,{dir:L}=ye(),z=ae({name:"Drawer",classes:f,props:n,className:l,style:o,classNames:r,styles:i,unstyled:c,attributes:_,vars:d,varsResolver:Se}),ne=(L==="rtl"?_e:be)[h];return e.jsx(we,{value:{scrollAreaComponent:a,getStyles:z,radius:u},children:e.jsx(pe,{ref:t,...z("root"),transitionProps:{transition:ne,...b},"data-offset-scrollbars":a===ge.Autosize||void 0,unstyled:c,...I})})});F.classes=f;F.displayName="@mantine/core/DrawerRoot";const[Be,Oe]=xe();function ee({children:s}){const[t,n]=x.useState([]),[r,l]=x.useState(k("modal"));return e.jsx(Be,{value:{stack:t,addModal:(o,i)=>{n(c=>[...new Set([...c,o])]),l(c=>typeof i=="number"&&typeof c=="number"?Math.max(c,i):c)},removeModal:o=>n(i=>i.filter(c=>c!==o)),getZIndex:o=>`calc(${r} + ${t.indexOf(o)} + 1)`,currentId:t[t.length-1],maxZIndex:r},children:s})}ee.displayName="@mantine/core/DrawerStack";const M=w((s,t)=>{const n=P("DrawerTitle",null,s),{classNames:r,className:l,style:o,styles:i,vars:c,...d}=n,a=v();return e.jsx(me,{ref:t,...a.getStyles("title",{classNames:r,style:o,styles:i,className:l}),...d})});M.classes=f;M.displayName="@mantine/core/DrawerTitle";const Te={closeOnClickOutside:!0,withinPortal:!0,lockScroll:!0,trapFocus:!0,returnFocus:!0,closeOnEscape:!0,keepMounted:!1,zIndex:k("modal"),withOverlay:!0,withCloseButton:!0},p=w((s,t)=>{const{title:n,withOverlay:r,overlayProps:l,withCloseButton:o,closeButtonProps:i,children:c,opened:d,stackId:a,zIndex:h,...b}=P("Drawer",Te,s),u=Oe(),_=!!n||o,I=u&&a?{closeOnEscape:u.currentId===a,trapFocus:u.currentId===a,zIndex:u.getZIndex(a)}:{},L=r===!1?!1:a&&u?u.currentId===a:d;return x.useEffect(()=>{u&&a&&(d?u.addModal(a,h||k("modal")):u.removeModal(a))},[d,a,h]),e.jsxs(F,{ref:t,opened:d,zIndex:u&&a?u.getZIndex(a):h,...b,...I,children:[r&&e.jsx(A,{visible:L,transitionProps:u&&a?{duration:0}:void 0,...l}),e.jsxs(D,{__hidden:u&&a&&d?a!==u.currentId:!1,children:[_&&e.jsxs(H,{children:[n&&e.jsx(M,{children:n}),o&&e.jsx(j,{...i})]}),e.jsx(N,{children:c})]})]})});p.classes=f;p.displayName="@mantine/core/Drawer";p.Root=F;p.Overlay=A;p.Content=D;p.Body=N;p.Header=H;p.Title=M;p.CloseButton=j;p.Stack=ee;const ke="Panel-module__content___wdGo-",Ne="Panel-module__inner___ruA2b",je="Panel-module__header___o7SiC",De="Panel-module__title___181OP recursica_brand_typography_h3",He="Panel-module__titleTruncate___fuP6V Panel-module__title___181OP recursica_brand_typography_h3",Ae="Panel-module__body___SEC3T",Fe="Panel-module__footer___t6-hz",y={content:ke,inner:Ne,header:je,title:De,titleTruncate:He,body:Ae,footer:Fe},te=function({overStyled:t=!1,position:n="right",keepMounted:r=!0,wrapHeaderText:l=!1,...o}){const i=Y(o,t),c={content:y.content,header:y.header,title:l?y.titleTruncate:y.title,body:y.body,inner:y.inner},d=i.classNames;if(d&&typeof d=="object"&&!Array.isArray(d)){const a=d;Object.keys(a).forEach(h=>{c[h]?c[h]=`${c[h]} ${a[h]}`:c[h]=a[h]})}return e.jsx(p,{position:n,keepMounted:r,closeOnClickOutside:o.closeOnClickOutside??!!o.opened,...i,classNames:c})};te.displayName="Panel";const T=x.forwardRef(function({overStyled:t=!1,...n},r){const l=Y(n,t),o=l.className,i=o?`${y.footer} ${o}`:y.footer;return e.jsx("div",{ref:r,className:i,...l})});T.displayName="PanelFooter";const m=te;m.Root=p.Root;m.Overlay=p.Overlay;m.Content=p.Content;m.Header=p.Header;m.Title=p.Title;m.CloseButton=p.CloseButton;m.Body=p.Body;m.Stack=p.Stack;m.Footer=T;try{T.displayName="PanelFooter",T.__docgenInfo={description:`Panel footer section with action buttons.
Separated from the body by a divider. Remains fixed at the bottom.
This is a Recursica-specific sub-component; Mantine Drawer does not
natively provide a footer.`,displayName:"PanelFooter",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Panel/Panel.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}try{m.displayName="Panel",m.__docgenInfo={description:"",displayName:"Panel",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Panel/Panel.tsx",methods:[],props:{defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}},wrapHeaderText:{defaultValue:{value:"false"},declarations:[{fileName:"mantine-adapter/src/components/Panel/Panel.tsx",name:"RecursicaPanelProps"},{fileName:"mantine-adapter/src/components/Panel/Panel.tsx",name:"RecursicaPanelProps"}],description:"If true, forces the header text to a single line and truncates with an ellipsis.\nNote: While the prop is named `wrapHeaderText` for backward compatibility,\nsetting it to `true` actually PREVENTS wrapping (it forces truncation).",name:"wrapHeaderText",parent:{fileName:"mantine-adapter/src/components/Panel/Panel.tsx",name:"RecursicaPanelProps"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const ct={title:"UI-Kit/Panel",component:m,tags:["autodocs"],argTypes:{position:{control:"select",options:["left","right","top","bottom"],description:"Side of the screen the panel slides in from."},title:{control:"text",description:"Panel title displayed in the header."},withOverlay:{control:"boolean",description:"Whether to display a background overlay."},withCloseButton:{control:"boolean",description:"Whether to display the close button in the header."},wrapHeaderText:{control:"boolean",description:"If true, forces the header text to a single line and truncates with an ellipsis."},defaultChecked:{table:{disable:!0}},defaultValue:{table:{disable:!0}},suppressContentEditableWarning:{table:{disable:!0}},suppressHydrationWarning:{table:{disable:!0}}},parameters:{layout:"fullscreen",docs:{description:{component:`
The \`Panel\` component slides in or expands from the edge of the screen to reveal additional content or functionality. Built on Mantine's \`Drawer\`, it enforces Recursica design tokens for styling.

### Anatomy
1. **Header** — Title and close icon, remains fixed on scroll
2. **Divider** — Separates header/footer from content
3. **Body (Slot)** — Scrollable content area for custom content
4. **Footer** — Fixed action buttons (Recursica-specific)

### Usage
\`\`\`tsx
const [opened, { open, close }] = useDisclosure(false);

<Button onClick={open}>Open Panel</Button>
<Panel opened={opened} onClose={close} title="Settings" position="right">
  Content goes here
  <Panel.Footer>
    <Button variant="outline">Cancel</Button>
    <Button variant="solid">Save</Button>
  </Panel.Footer>
</Panel>
\`\`\`
        `}}}},C={args:{position:"right",title:"Panel Title",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({wrapHeaderText:s,...t})=>{const[n,r]=x.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(g,{variant:"solid",onClick:()=>r(!0),children:"Open Panel"}),e.jsxs(m,{...t,opened:n,onClose:()=>r(!1),title:"Panel Title",position:"right",wrapHeaderText:s,children:[e.jsx(R,{children:"This is the panel body content area. Panels slide in from the edge of the screen to reveal supplementary information, navigation options, or toolsets."}),e.jsxs(m.Footer,{children:[e.jsx(g,{variant:"outline",onClick:()=>r(!1),children:"Cancel"}),e.jsx(g,{variant:"solid",children:"Save"})]})]})]})}},S={args:{position:"left",title:"Navigation",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:s,layer:t,...n})=>{const[r,l]=x.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(g,{variant:"outline",onClick:()=>l(!0),children:"Open Left Panel"}),e.jsx(m,{...n,opened:r,onClose:()=>l(!1),children:e.jsx(R,{children:"A panel sliding in from the left, commonly used for navigation menus or sidebars."})})]})}},B={args:{position:"right",title:"Scrollable Panel",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:s,layer:t,...n})=>{const[r,l]=x.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(g,{variant:"solid",onClick:()=>l(!0),children:"Open Scrollable Panel"}),e.jsxs(m,{...n,opened:r,onClose:()=>l(!1),children:[Array.from({length:20}).map((o,i)=>e.jsxs("p",{style:{marginBottom:"1rem"},children:["Paragraph ",i+1,": This is sample content to demonstrate the scrollable behavior of the panel when content exceeds the viewport height."]},i)),e.jsxs(m.Footer,{children:[e.jsx(g,{variant:"outline",onClick:()=>l(!1),children:"Close"}),e.jsx(g,{variant:"solid",children:"Apply"})]})]})]})}},O={args:{position:"right",title:"This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!0},render:({...s})=>{const[t,n]=x.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(g,{variant:"solid",onClick:()=>n(!0),children:"Open Long Title Panel"}),e.jsx(m,{...s,opened:t,onClose:()=>n(!1),children:e.jsx(R,{children:"Check the header to see if the long title is handled gracefully without pushing the close button off screen."})})]})}};var E,V,$;C.parameters={...C.parameters,docs:{...(E=C.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "Panel Title",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
  },
  render: ({
    wrapHeaderText,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)} title="Panel Title" position="right" wrapHeaderText={wrapHeaderText}>
          <Text>
            This is the panel body content area. Panels slide in from the edge
            of the screen to reveal supplementary information, navigation
            options, or toolsets.
          </Text>
          <Panel.Footer>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button variant="solid">Save</Button>
          </Panel.Footer>
        </Panel>
      </>;
  }
}`,...($=(V=C.parameters)==null?void 0:V.docs)==null?void 0:$.source}}};var Z,W,q;S.parameters={...S.parameters,docs:{...(Z=S.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    position: "left",
    title: "Navigation",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="outline" onClick={() => setOpened(true)}>
          Open Left Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          <Text>
            A panel sliding in from the left, commonly used for navigation menus
            or sidebars.
          </Text>
        </Panel>
      </>;
  }
}`,...(q=(W=S.parameters)==null?void 0:W.docs)==null?void 0:q.source}}};var U,G,K;B.parameters={...B.parameters,docs:{...(U=B.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "Scrollable Panel",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: false
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Scrollable Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          {Array.from({
          length: 20
        }).map((_, i) => <p key={i} style={{
          marginBottom: "1rem"
        }}>
              Paragraph {i + 1}: This is sample content to demonstrate the
              scrollable behavior of the panel when content exceeds the viewport
              height.
            </p>)}
          <Panel.Footer>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Close
            </Button>
            <Button variant="solid">Apply</Button>
          </Panel.Footer>
        </Panel>
      </>;
  }
}`,...(K=(G=B.parameters)==null?void 0:G.docs)==null?void 0:K.source}}};var J,Q,X;O.parameters={...O.parameters,docs:{...(J=O.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    position: "right",
    title: "This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",
    withOverlay: true,
    withCloseButton: true,
    wrapHeaderText: true
  },
  render: ({
    ...args
  }: PanelStoryArgs) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [opened, setOpened] = useState(false);
    return <>
        <Button variant="solid" onClick={() => setOpened(true)}>
          Open Long Title Panel
        </Button>
        <Panel {...args as PanelProps} opened={opened} onClose={() => setOpened(false)}>
          <Text>
            Check the header to see if the long title is handled gracefully
            without pushing the close button off screen.
          </Text>
        </Panel>
      </>;
  }
}`,...(X=(Q=O.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};const dt=["Default","LeftPosition","ScrollableContent","LongTitle"];export{C as Default,S as LeftPosition,O as LongTitle,B as ScrollableContent,dt as __namedExportsOrder,ct as default};
