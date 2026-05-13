import{r as s,j as i,u as ke,w as je,m as $e,f as Ie}from"./iframe-BddUskqo.js";import{d as We,g as Ee,b as Le}from"./get-size-D6NM-3-T.js";import{f as re,u as oe,d as se,B as L,e as ae}from"./factory-CvawFnU2.js";import{g as Oe}from"./get-env-uyVen0u2.js";import{t as j}from"./to-int-PQE0s6ay.js";import{u as le}from"./use-merged-ref-Cl8K9XVP.js";import{r as H,u as ze}from"./use-id-BZWRHC0D.js";import{u as Te}from"./use-uncontrolled-CF5v_IMa.js";import"./preload-helper-Dp1pzeXC.js";function Fe(n,e){if(n===e||Number.isNaN(n)&&Number.isNaN(e))return!0;if(!(n instanceof Object)||!(e instanceof Object))return!1;const t=Object.keys(n),{length:o}=t;if(o!==Object.keys(e).length)return!1;for(let l=0;l<o;l+=1){const r=t[l];if(!(r in e)||n[r]!==e[r]&&!(Number.isNaN(n[r])&&Number.isNaN(e[r])))return!1}return!0}function Me(n,e){if(!n||!e)return!1;if(n===e)return!0;if(n.length!==e.length)return!1;for(let t=0;t<n.length;t+=1)if(!Fe(n[t],e[t]))return!1;return!0}function Pe(n){const e=s.useRef([]),t=s.useRef(0);return Me(e.current,n)||(e.current=n,t.current+=1),[t.current]}function Ae(n,e){s.useEffect(n,Pe(e))}function De(n,e,t={autoInvoke:!1}){const o=s.useRef(null),l=s.useCallback((...m)=>{o.current||(o.current=window.setTimeout(()=>{n(m),o.current=null},e))},[e]),r=s.useCallback(()=>{o.current&&(window.clearTimeout(o.current),o.current=null)},[]);return s.useEffect(()=>(t.autoInvoke&&l(),r),[r,l]),{start:l,clear:r}}function Be(n,e,t){const o=s.useRef(null),l=s.useRef(null);return s.useEffect(()=>{const r=typeof t=="function"?t():t;return(r||l.current)&&(o.current=new MutationObserver(n),o.current.observe(r||l.current,e)),()=>{var m;(m=o.current)==null||m.disconnect()}},[n,e]),l}function qe(){const[n,e]=s.useState(!1);return s.useEffect(()=>e(!0),[]),n}var ie={root:"m_96b553a6"};function He(n,e){if(!e||!n)return!1;let t=e.parentNode;for(;t!=null;){if(t===n)return!0;t=t.parentNode}return!1}function Ve({target:n,parent:e,ref:t,displayAfterTransitionEnd:o}){const l=s.useRef(-1),[r,m]=s.useState(!1),[y,N]=s.useState(typeof o=="boolean"?o:!1),f=()=>{if(!n||!e||!t.current)return;const c=n.getBoundingClientRect(),d=e.getBoundingClientRect(),g=window.getComputedStyle(n),b=window.getComputedStyle(e),w=j(g.borderTopWidth)+j(b.borderTopWidth),_=j(g.borderLeftWidth)+j(b.borderLeftWidth),v={top:c.top-d.top-w,left:c.left-d.left-_,width:c.width,height:c.height};t.current.style.transform=`translateY(${v.top}px) translateX(${v.left}px)`,t.current.style.width=`${v.width}px`,t.current.style.height=`${v.height}px`},p=()=>{window.clearTimeout(l.current),t.current&&(t.current.style.transitionDuration="0ms"),f(),l.current=window.setTimeout(()=>{t.current&&(t.current.style.transitionDuration="")},30)},S=s.useRef(null),h=s.useRef(null);return s.useEffect(()=>{if(f(),n)return S.current=new ResizeObserver(p),S.current.observe(n),e&&(h.current=new ResizeObserver(p),h.current.observe(e)),()=>{var c,d;(c=S.current)==null||c.disconnect(),(d=h.current)==null||d.disconnect()}},[e,n]),s.useEffect(()=>{if(e){const c=d=>{He(d.target,e)&&(p(),N(!1))};return e.addEventListener("transitionend",c),()=>{e.removeEventListener("transitionend",c)}}},[e]),De(()=>{Oe()!=="test"&&m(!0)},20,{autoInvoke:!0}),Be(c=>{c.forEach(d=>{d.type==="attributes"&&d.attributeName==="dir"&&p()})},{attributes:!0,attributeFilter:["dir"]},()=>document.documentElement),{initialized:r,hidden:y}}const Je=ae((n,{transitionDuration:e})=>({root:{"--transition-duration":typeof e=="number"?`${e}ms`:e}})),M=re((n,e)=>{const t=oe("FloatingIndicator",null,n),{classNames:o,className:l,style:r,styles:m,unstyled:y,vars:N,target:f,parent:p,transitionDuration:S,mod:h,displayAfterTransitionEnd:c,attributes:d,...g}=t,b=se({name:"FloatingIndicator",classes:ie,props:t,className:l,style:r,classNames:o,styles:m,unstyled:y,attributes:d,vars:N,varsResolver:Je}),w=s.useRef(null),{initialized:_,hidden:v}=Ve({target:f,parent:p,ref:w,displayAfterTransitionEnd:c}),k=le(e,w);return!f||!p?null:i.jsx(L,{ref:k,mod:[{initialized:_,hidden:v},h],...b("root"),...g})});M.displayName="@mantine/core/FloatingIndicator";M.classes=ie;var ce={root:"m_cf365364",indicator:"m_9e182ccd",label:"m_1738fcb2",input:"m_1714d588",control:"m_69686b9b",innerLabel:"m_78882f40"};const Ke={withItemsBorders:!0},Ue=ae((n,{radius:e,color:t,transitionDuration:o,size:l,transitionTimingFunction:r})=>({root:{"--sc-radius":e===void 0?void 0:Le(e),"--sc-color":t?$e(t,n):void 0,"--sc-shadow":t?void 0:"var(--mantine-shadow-xs)","--sc-transition-duration":o===void 0?void 0:`${o}ms`,"--sc-transition-timing-function":r,"--sc-padding":Ee(l,"sc-padding"),"--sc-font-size":We(l)}})),P=re((n,e)=>{var B,q;const t=oe("SegmentedControl",Ke,n),{classNames:o,className:l,style:r,styles:m,unstyled:y,vars:N,data:f,value:p,defaultValue:S,onChange:h,size:c,name:d,disabled:g,readOnly:b,fullWidth:w,orientation:_,radius:v,color:k,transitionDuration:et,transitionTimingFunction:tt,variant:ue,autoContrast:me,withItemsBorders:fe,mod:pe,attributes:ge,...ye}=t,x=se({name:"SegmentedControl",props:t,classes:ce,className:l,style:r,classNames:o,styles:m,unstyled:y,attributes:ge,vars:N,varsResolver:Ue}),A=ke(),D=f.map(a=>typeof a=="string"?{label:a,value:a}:a),he=qe(),[be,ve]=s.useState(H()),[Ce,Se]=s.useState(null),[O,we]=s.useState({}),_e=(a,T)=>{O[T]=a,we(O)},[R,xe]=Te({value:p,defaultValue:S,finalValue:Array.isArray(f)?((B=D.find(a=>!a.disabled))==null?void 0:B.value)??((q=f[0])==null?void 0:q.value)??null:null,onChange:h}),z=ze(d),Ne=D.map(a=>s.createElement(L,{...x("control"),mod:{active:R===a.value,orientation:_},key:a.value},s.createElement("input",{...x("input"),disabled:g||a.disabled,type:"radio",name:z,value:a.value,id:`${z}-${a.value}`,checked:R===a.value,onChange:()=>!b&&xe(a.value),"data-focus-ring":A.focusRing,key:`${a.value}-input`}),s.createElement(L,{component:"label",...x("label"),mod:{active:R===a.value&&!(g||a.disabled),disabled:g||a.disabled,"read-only":b},htmlFor:`${z}-${a.value}`,ref:T=>_e(T,a.value),__vars:{"--sc-label-color":k!==void 0?je({color:k,theme:A,autoContrast:me}):void 0},key:`${a.value}-label`},i.jsx("span",{...x("innerLabel"),children:a.label})))),Re=le(e,a=>Se(a));return Ae(()=>{ve(H())},[f.length]),f.length===0?null:i.jsxs(L,{...x("root"),variant:ue,size:c,ref:Re,mod:[{"full-width":w,orientation:_,initialized:he,"with-items-borders":fe},pe],...ye,role:"radiogroup","data-disabled":g,children:[typeof R=="string"&&i.jsx(M,{target:O[R],parent:Ce,component:"span",transitionDuration:"var(--sc-transition-duration)",...x("indicator")},be),Ne]})});P.classes=ce;P.displayName="@mantine/core/SegmentedControl";const Qe="SegmentedControl-module__root___JFRhg",Xe="SegmentedControl-module__label___mS17q",Ye="SegmentedControl-module__control___znOdQ",Ze="SegmentedControl-module__indicator___ZMcJy",u={root:Qe,label:Xe,control:Ye,indicator:Ze};function Ge(n){const e={root:u.root,control:u.control,label:u.label,indicator:u.indicator},t=n.classNames;if(t&&typeof t=="object"&&!Array.isArray(t)){const r=t;e.root=r.root?`${u.root} ${r.root}`:u.root,e.control=r.control?`${u.control} ${r.control}`:u.control,e.label=r.label?`${u.label} ${r.label}`:u.label,e.indicator=r.indicator?`${u.indicator} ${r.indicator}`:u.indicator}const o=n.className;return{className:o?`${u.root} ${o}`:u.root,classNames:e}}const de=s.forwardRef(function({overStyled:e=!1,orientation:t="horizontal",fullWidth:o,...l},r){const m=Ie(l,e),y=Ge(m);return i.jsx(P,{ref:r,className:y.className,classNames:y.classNames,orientation:t,fullWidth:o,"data-orientation":t,...m})});de.displayName="SegmentedControl";const C=de;try{C.displayName="SegmentedControl",C.__docgenInfo={description:"Recursica SegmentedControl component wrapping Mantine's SegmentedControl.",displayName:"SegmentedControl",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/SegmentedControl/SegmentedControl.tsx",methods:[],props:{disabled:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/components/SegmentedControl/SegmentedControl.d.ts",name:"SegmentedControlProps"},{fileName:"recursica/node_modules/@mantine/core/lib/components/SegmentedControl/SegmentedControl.d.ts",name:"SegmentedControlProps"}],description:"Determines whether the component is disabled",name:"disabled",parent:{fileName:"recursica/node_modules/@mantine/core/lib/components/SegmentedControl/SegmentedControl.d.ts",name:"SegmentedControlProps"},required:!1,tags:{},type:{name:"boolean | undefined"}},defaultChecked:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"}],description:"",name:"defaultChecked",parent:{fileName:"recursica/node_modules/@types/react/index.d.ts",name:"HTMLAttributes"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const ut={title:"UI-Kit/SegmentedControl",component:C,tags:["autodocs"],parameters:{docs:{description:{component:"SegmentedControl provides a linear set of two or more segments, each of which functions as a mutually exclusive button."}}},argTypes:{orientation:{control:"radio",options:["horizontal","vertical"]},fullWidth:{control:"boolean"},disabled:{control:"boolean"},data:{table:{disable:!0}},defaultChecked:{table:{disable:!0}}}},$={args:{data:["React","Angular","Vue","Svelte"],orientation:"horizontal",fullWidth:!1,disabled:!1},render:({withLayer:n,layer:e,...t})=>i.jsx(C,{...t})},I={args:{data:["Daily","Weekly","Monthly"],fullWidth:!0},render:({withLayer:n,layer:e,...t})=>i.jsx(C,{...t})},W={args:{data:["Option 1","Option 2","Option 3"],orientation:"vertical"},render:({withLayer:n,layer:e,...t})=>i.jsx(C,{...t})},F=()=>i.jsx("svg",{viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:i.jsx("polyline",{points:"20 6 9 17 4 12"})}),E={args:{data:[{value:"daily",label:i.jsxs(i.Fragment,{children:[i.jsx(F,{}),i.jsx("span",{children:"Daily"})]})},{value:"weekly",label:i.jsxs(i.Fragment,{children:[i.jsx(F,{}),i.jsx("span",{children:"Weekly"})]})},{value:"monthly",label:i.jsxs(i.Fragment,{children:[i.jsx(F,{}),i.jsx("span",{children:"Monthly"})]})}]},render:({withLayer:n,layer:e,...t})=>i.jsx(C,{...t})};var V,J,K;$.parameters={...$.parameters,docs:{...(V=$.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    data: ["React", "Angular", "Vue", "Svelte"],
    orientation: "horizontal",
    fullWidth: false,
    disabled: false
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(K=(J=$.parameters)==null?void 0:J.docs)==null?void 0:K.source}}};var U,Q,X;I.parameters={...I.parameters,docs:{...(U=I.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    data: ["Daily", "Weekly", "Monthly"],
    fullWidth: true
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(X=(Q=I.parameters)==null?void 0:Q.docs)==null?void 0:X.source}}};var Y,Z,G;W.parameters={...W.parameters,docs:{...(Y=W.parameters)==null?void 0:Y.docs,source:{originalSource:`{
  args: {
    data: ["Option 1", "Option 2", "Option 3"],
    orientation: "vertical"
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(G=(Z=W.parameters)==null?void 0:Z.docs)==null?void 0:G.source}}};var ee,te,ne;E.parameters={...E.parameters,docs:{...(ee=E.parameters)==null?void 0:ee.docs,source:{originalSource:`{
  args: {
    data: [{
      value: "daily",
      label: <>
            <CheckIcon />
            <span>Daily</span>
          </>
    }, {
      value: "weekly",
      label: <>
            <CheckIcon />
            <span>Weekly</span>
          </>
    }, {
      value: "monthly",
      label: <>
            <CheckIcon />
            <span>Monthly</span>
          </>
    }]
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <SegmentedControl {...args} />;
  }
}`,...(ne=(te=E.parameters)==null?void 0:te.docs)==null?void 0:ne.source}}};const mt=["Default","FullWidth","Vertical","WithIcons"];export{$ as Default,I as FullWidth,W as Vertical,E as WithIcons,mt as __namedExportsOrder,ut as default};
