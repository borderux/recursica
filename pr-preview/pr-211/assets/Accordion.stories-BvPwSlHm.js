import{r as G,R as Ce,u as Ie,j as e,a as be}from"./iframe-CaYtvSrb.js";import{c as Pe,g as je}from"./Typography.css.ts.vanilla-BTGOHLvo.js";import{f as F,u as R,a as we,g as Re}from"./polymorphic-factory-BpB2RHWM.js";import{B as P}from"./Box-DI5237On.js";import{c as le}from"./create-safe-context-BkUSH4l_.js";import{A as de}from"./AccordionChevron-Ddvx9J-P.js";import{U as Se}from"./UnstyledButton-C-YKXJpa.js";import{g as _e}from"./get-style-object-DUJZA7T_.js";import{r as ke}from"./index-CtsFvaN8.js";import{u as De,a as Ne}from"./use-reduced-motion-ODZtj8LC.js";import{m as Te}from"./use-merged-ref-CFZ5V-L1.js";import{u as $e}from"./use-id-CLb0k7dv.js";import{u as Fe}from"./use-uncontrolled-B6Yp00Ct.js";import"./preload-helper-CZ_saIiD.js";import"./index-BJVoD4kg.js";function B(n,s){return t=>{if(typeof t!="string"||t.trim().length===0)throw new Error(s);return`${n}-${t}`}}function W(n,s){let t=n;for(;(t=t.parentElement)&&!t.matches(s););return t}function Ee(n,s,t){for(let o=n-1;o>=0;o-=1)if(!s[o].disabled)return o;if(t){for(let o=s.length-1;o>-1;o-=1)if(!s[o].disabled)return o}return n}function He(n,s,t){for(let o=n+1;o<s.length;o+=1)if(!s[o].disabled)return o;if(t){for(let o=0;o<s.length;o+=1)if(!s[o].disabled)return o}return n}function Me(n,s,t){return W(n,t)===W(s,t)}function We({parentSelector:n,siblingSelector:s,onKeyDown:t,loop:o=!0,activateOnFocus:p=!1,dir:u="rtl",orientation:v}){return i=>{var y;t==null||t(i);const c=Array.from(((y=W(i.currentTarget,n))==null?void 0:y.querySelectorAll(s))||[]).filter(g=>Me(i.currentTarget,g,n)),m=c.findIndex(g=>i.currentTarget===g),a=He(m,c,o),A=Ee(m,c,o);switch(i.key){case"ArrowRight":break;case"ArrowLeft":break;case"ArrowUp":{i.stopPropagation(),i.preventDefault(),c[A].focus(),p&&c[A].click();break}case"ArrowDown":{i.stopPropagation(),i.preventDefault(),c[a].focus(),p&&c[a].click();break}case"Home":{i.stopPropagation(),i.preventDefault(),!c[0].disabled&&c[0].focus();break}case"End":{i.stopPropagation(),i.preventDefault();const g=c.length-1;!c[g].disabled&&c[g].focus();break}}}}function qe(n){if(!n||typeof n=="string")return 0;const s=n/36;return Math.round((4+15*s**.25+s/5)*10)}function M(n){return n!=null&&n.current?n.current.scrollHeight:"auto"}const w=typeof window<"u"&&window.requestAnimationFrame,J=0,ze=n=>({height:0,overflow:"hidden",...n?{}:{display:"none"}});function Ue({transitionDuration:n,transitionTimingFunction:s="ease",onTransitionEnd:t=()=>{},opened:o,keepMounted:p=!1}){const u=G.useRef(null),v=ze(p),[i,c]=G.useState(o?{}:v),m=l=>{ke.flushSync(()=>c(l))},a=l=>{m(h=>({...h,...l}))};function A(l){const h=n||qe(l);return{transition:`height ${h}ms ${s}, opacity ${h}ms ${s}`}}De(()=>{typeof w=="function"&&w(o?()=>{a({willChange:"height",display:"block",overflow:"hidden"}),w(()=>{const l=M(u);a({...A(l),height:l})})}:()=>{const l=M(u);a({...A(l),willChange:"height",height:l}),w(()=>a({height:J,overflow:"hidden"}))})},[o]);const y=l=>{if(!(l.target!==u.current||l.propertyName!=="height"))if(o){const h=M(u);h===i.height?m({}):a({height:h}),t()}else i.height===J&&(m(v),t())};function g({style:l={},refKey:h="ref",...d}={}){const I=d[h],b={"aria-hidden":!o,...d,[h]:Te(u,I),onTransitionEnd:y,style:{boxSizing:"border-box",...l,...i}};return Ce.version.startsWith("18")?o||(b.inert=""):b.inert=!o,b}return g}const Le={transitionDuration:200,transitionTimingFunction:"ease",animateOpacity:!0},ue=F((n,s)=>{const{children:t,in:o,transitionDuration:p,transitionTimingFunction:u,style:v,onTransitionEnd:i,animateOpacity:c,keepMounted:m,...a}=R("Collapse",Le,n),A=Ie(),y=Ne(),l=(A.respectReducedMotion?y:!1)?0:p,h=Ue({opened:o,transitionDuration:l,transitionTimingFunction:u,onTransitionEnd:i,keepMounted:m});return l===0?o?e.jsx(P,{...a,children:t}):null:e.jsx(P,{...h({style:{opacity:o||!c?1:0,transition:c?`opacity ${l}ms ${u}`:"none",..._e(v,A)},ref:s,...a}),children:t})});ue.displayName="@mantine/core/Collapse";const[Oe,q]=le("Accordion component was not found in the tree"),[Ge,me]=le("Accordion.Item component was not found in the tree");var S={root:"m_9bdbb667",panel:"m_df78851f",content:"m_4ba554d4",itemTitle:"m_8fa820a0",control:"m_4ba585b8","control--default":"m_6939a5e9","control--contained":"m_4271d21b",label:"m_df3ffa0f",chevron:"m_3f35ae96",icon:"m_9bd771fe",item:"m_9bd7b098","item--default":"m_fe19b709","item--contained":"m_1f921b3b","item--filled":"m_2cdf939a","item--separated":"m_9f59b069"};const z=F((n,s)=>{const{classNames:t,className:o,style:p,styles:u,vars:v,chevron:i,icon:c,onClick:m,onKeyDown:a,children:A,disabled:y,mod:g,...l}=R("AccordionControl",null,n),{value:h}=me(),d=q(),I=d.isItemActive(h),b=typeof d.order=="number",E=`h${d.order}`,j=e.jsxs(Se,{...l,...d.getStyles("control",{className:o,classNames:t,style:p,styles:u,variant:d.variant}),unstyled:d.unstyled,mod:["accordion-control",{active:I,"chevron-position":d.chevronPosition,disabled:y},g],ref:s,onClick:_=>{m==null||m(_),d.onChange(h)},type:"button",disabled:y,"aria-expanded":I,"aria-controls":d.getRegionId(h),id:d.getControlId(h),onKeyDown:We({siblingSelector:"[data-accordion-control]",parentSelector:"[data-accordion]",activateOnFocus:!1,loop:d.loop,orientation:"vertical",onKeyDown:a}),children:[e.jsx(P,{component:"span",mod:{rotate:!d.disableChevronRotation&&I,position:d.chevronPosition},...d.getStyles("chevron",{classNames:t,styles:u}),children:i||d.chevron}),e.jsx("span",{...d.getStyles("label",{classNames:t,styles:u}),children:A}),c&&e.jsx(P,{component:"span",mod:{"chevron-position":d.chevronPosition},...d.getStyles("icon",{classNames:t,styles:u}),children:c})]});return b?e.jsx(E,{...d.getStyles("itemTitle",{classNames:t,styles:u}),children:j}):j});z.displayName="@mantine/core/AccordionControl";z.classes=S;const U=F((n,s)=>{const{classNames:t,className:o,style:p,styles:u,vars:v,value:i,mod:c,...m}=R("AccordionItem",null,n),a=q();return e.jsx(Ge,{value:{value:i},children:e.jsx(P,{ref:s,mod:[{active:a.isItemActive(i)},c],...a.getStyles("item",{className:o,classNames:t,styles:u,style:p,variant:a.variant}),...m})})});U.displayName="@mantine/core/AccordionItem";U.classes=S;const L=F((n,s)=>{const{classNames:t,className:o,style:p,styles:u,vars:v,children:i,...c}=R("AccordionPanel",null,n),{value:m}=me(),a=q();return e.jsx(ue,{ref:s,...a.getStyles("panel",{className:o,classNames:t,style:p,styles:u}),...c,in:a.isItemActive(m),transitionDuration:a.transitionDuration??200,role:"region",id:a.getRegionId(m),"aria-labelledby":a.getControlId(m),children:e.jsx("div",{...a.getStyles("content",{classNames:t,styles:u}),children:i})})});L.displayName="@mantine/core/AccordionPanel";L.classes=S;const Be={multiple:!1,disableChevronRotation:!1,chevronPosition:"right",variant:"default",chevronSize:"auto",chevronIconSize:16},Je=Pe((n,{transitionDuration:s,chevronSize:t,radius:o})=>({root:{"--accordion-transition-duration":s===void 0?void 0:`${s}ms`,"--accordion-chevron-size":t===void 0?void 0:be(t),"--accordion-radius":o===void 0?void 0:je(o)}}));function f(n){const s=R("Accordion",Be,n),{classNames:t,className:o,style:p,styles:u,unstyled:v,vars:i,children:c,multiple:m,value:a,defaultValue:A,onChange:y,id:g,loop:l,transitionDuration:h,disableChevronRotation:d,chevronPosition:I,chevronSize:b,order:E,chevron:j,variant:_,radius:Ye,chevronIconSize:he,attributes:pe,...ge}=s,H=$e(g),[x,fe]=Fe({value:a,defaultValue:A,finalValue:m?[]:null,onChange:y}),Ae=C=>Array.isArray(x)?x.includes(C):C===x,ve=C=>{const ye=Array.isArray(x)?x.includes(C)?x.filter(xe=>xe!==C):[...x,C]:C===x?null:C;fe(ye)},O=we({name:"Accordion",classes:S,props:s,className:o,style:p,classNames:t,styles:u,unstyled:v,attributes:pe,vars:i,varsResolver:Je});return e.jsx(Oe,{value:{isItemActive:Ae,onChange:ve,getControlId:B(`${H}-control`,"Accordion.Item component was rendered with invalid value or without value"),getRegionId:B(`${H}-panel`,"Accordion.Item component was rendered with invalid value or without value"),chevron:j===null?null:j||e.jsx(de,{size:he}),transitionDuration:h,disableChevronRotation:d,chevronPosition:I,order:E,loop:l,getStyles:O,variant:_,unstyled:v},children:e.jsx(P,{...O("root"),id:H,...ge,variant:_,"data-accordion":!0,children:c})})}const Ve=n=>n;f.extend=Ve;f.withProps=Re(f);f.classes=S;f.displayName="@mantine/core/Accordion";f.Item=U;f.Panel=L;f.Control=z;f.Chevron=de;var Qe={control:"recursica-1icfdyb0",label:"recursica-1icfdyb1",item:"recursica-1icfdyb2",content:"recursica-1icfdyb3"};const Xe=n=>e.jsx(f,{...n,classNames:{...n.classNames,...Qe}}),r=Object.assign(Xe,{Item:f.Item,Control:f.Control,Panel:f.Panel});try{r.displayName="Accordion",r.__docgenInfo={description:"",displayName:"Accordion",props:{}}}catch{}const po={title:"Accordion",component:r,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","contained","filled","separated"]},chevronPosition:{control:"select",options:["left","right"]},chevronSize:{control:"number"},multiple:{control:"boolean"},defaultValue:{control:"text"}}},k={args:{children:e.jsxs(e.Fragment,{children:[e.jsxs(r.Item,{value:"item-1",children:[e.jsx(r.Control,{children:"What is Recursica?"}),e.jsx(r.Panel,{children:"Recursica is a design system platform that helps teams create, manage, and distribute design tokens and components across their projects."})]}),e.jsxs(r.Item,{value:"item-2",children:[e.jsx(r.Control,{children:"How does it work?"}),e.jsx(r.Panel,{children:"Recursica connects your design tools (like Figma) with your development workflow, automatically syncing design tokens and generating code-ready components."})]}),e.jsxs(r.Item,{value:"item-3",children:[e.jsx(r.Control,{children:"What platforms are supported?"}),e.jsx(r.Panel,{children:"Recursica supports multiple platforms including React, Vue, Angular, and more. It also integrates with popular design tools and version control systems."})]})]})}},D={args:{multiple:!0,children:e.jsxs(e.Fragment,{children:[e.jsxs(r.Item,{value:"item-1",children:[e.jsx(r.Control,{children:"Design Tokens"}),e.jsx(r.Panel,{children:"Design tokens are the visual design atoms of the design system — specifically, they are named entities that store visual design attributes."})]}),e.jsxs(r.Item,{value:"item-2",children:[e.jsx(r.Control,{children:"Components"}),e.jsx(r.Panel,{children:"Components are reusable UI elements that can be combined to create more complex interfaces. They follow consistent design patterns and use design tokens."})]}),e.jsxs(r.Item,{value:"item-3",children:[e.jsx(r.Control,{children:"Themes"}),e.jsx(r.Panel,{children:"Themes define the visual appearance of your design system, including colors, typography, spacing, and other design attributes."})]})]})}},N={args:{variant:"contained",children:e.jsxs(e.Fragment,{children:[e.jsxs(r.Item,{value:"item-1",children:[e.jsx(r.Control,{children:"Getting Started"}),e.jsx(r.Panel,{children:"Follow our step-by-step guide to set up Recursica in your project and start syncing your design tokens."})]}),e.jsxs(r.Item,{value:"item-2",children:[e.jsx(r.Control,{children:"Configuration"}),e.jsx(r.Panel,{children:"Learn how to configure Recursica to match your project's specific needs and requirements."})]})]})}},T={args:{variant:"filled",children:e.jsxs(e.Fragment,{children:[e.jsxs(r.Item,{value:"item-1",children:[e.jsx(r.Control,{children:"Documentation"}),e.jsx(r.Panel,{children:"Comprehensive documentation covering all aspects of the Recursica platform, from basic usage to advanced features."})]}),e.jsxs(r.Item,{value:"item-2",children:[e.jsx(r.Control,{children:"API Reference"}),e.jsx(r.Panel,{children:"Detailed API documentation for developers who want to integrate Recursica into their custom workflows."})]})]})}},$={args:{chevronPosition:"left",children:e.jsxs(e.Fragment,{children:[e.jsxs(r.Item,{value:"item-1",children:[e.jsx(r.Control,{children:"Support"}),e.jsx(r.Panel,{children:"Get help from our support team or community when you encounter issues or have questions about Recursica."})]}),e.jsxs(r.Item,{value:"item-2",children:[e.jsx(r.Control,{children:"Community"}),e.jsx(r.Panel,{children:"Join our community of designers and developers to share experiences, ask questions, and contribute to the ecosystem."})]})]})}};var V,Q,X;k.parameters={...k.parameters,docs:{...(V=k.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: <>
        <Accordion.Item value="item-1">
          <Accordion.Control>What is Recursica?</Accordion.Control>
          <Accordion.Panel>
            Recursica is a design system platform that helps teams create,
            manage, and distribute design tokens and components across their
            projects.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>How does it work?</Accordion.Control>
          <Accordion.Panel>
            Recursica connects your design tools (like Figma) with your
            development workflow, automatically syncing design tokens and
            generating code-ready components.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Control>What platforms are supported?</Accordion.Control>
          <Accordion.Panel>
            Recursica supports multiple platforms including React, Vue, Angular,
            and more. It also integrates with popular design tools and version
            control systems.
          </Accordion.Panel>
        </Accordion.Item>
      </>
  }
}`,...(X=(Q=k.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,K;D.parameters={...D.parameters,docs:{...(Y=D.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    multiple: true,
    children: <>
        <Accordion.Item value="item-1">
          <Accordion.Control>Design Tokens</Accordion.Control>
          <Accordion.Panel>
            Design tokens are the visual design atoms of the design system —
            specifically, they are named entities that store visual design
            attributes.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>Components</Accordion.Control>
          <Accordion.Panel>
            Components are reusable UI elements that can be combined to create
            more complex interfaces. They follow consistent design patterns and
            use design tokens.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-3">
          <Accordion.Control>Themes</Accordion.Control>
          <Accordion.Panel>
            Themes define the visual appearance of your design system, including
            colors, typography, spacing, and other design attributes.
          </Accordion.Panel>
        </Accordion.Item>
      </>
  }
}`,...(K=(Z=D.parameters)==null?void 0:Z.docs)==null?void 0:K.source}}};var ee,oe,ne;N.parameters={...N.parameters,docs:{...(ee=N.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    variant: "contained",
    children: <>
        <Accordion.Item value="item-1">
          <Accordion.Control>Getting Started</Accordion.Control>
          <Accordion.Panel>
            Follow our step-by-step guide to set up Recursica in your project
            and start syncing your design tokens.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>Configuration</Accordion.Control>
          <Accordion.Panel>
            Learn how to configure Recursica to match your project's specific
            needs and requirements.
          </Accordion.Panel>
        </Accordion.Item>
      </>
  }
}`,...(ne=(oe=N.parameters)==null?void 0:oe.docs)==null?void 0:ne.source}}};var te,re,se;T.parameters={...T.parameters,docs:{...(te=T.parameters)==null?void 0:te.docs,source:{originalSource:`{
  args: {
    variant: "filled",
    children: <>
        <Accordion.Item value="item-1">
          <Accordion.Control>Documentation</Accordion.Control>
          <Accordion.Panel>
            Comprehensive documentation covering all aspects of the Recursica
            platform, from basic usage to advanced features.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>API Reference</Accordion.Control>
          <Accordion.Panel>
            Detailed API documentation for developers who want to integrate
            Recursica into their custom workflows.
          </Accordion.Panel>
        </Accordion.Item>
      </>
  }
}`,...(se=(re=T.parameters)==null?void 0:re.docs)==null?void 0:se.source}}};var ie,ce,ae;$.parameters={...$.parameters,docs:{...(ie=$.parameters)==null?void 0:ie.docs,source:{originalSource:`{
  args: {
    chevronPosition: "left",
    children: <>
        <Accordion.Item value="item-1">
          <Accordion.Control>Support</Accordion.Control>
          <Accordion.Panel>
            Get help from our support team or community when you encounter
            issues or have questions about Recursica.
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="item-2">
          <Accordion.Control>Community</Accordion.Control>
          <Accordion.Panel>
            Join our community of designers and developers to share experiences,
            ask questions, and contribute to the ecosystem.
          </Accordion.Panel>
        </Accordion.Item>
      </>
  }
}`,...(ae=(ce=$.parameters)==null?void 0:ce.docs)==null?void 0:ae.source}}};const go=["Default","Multiple","Contained","Filled","LeftChevron"];export{N as Contained,k as Default,T as Filled,$ as LeftChevron,D as Multiple,go as __namedExportsOrder,po as default};
