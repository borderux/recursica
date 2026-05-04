import{r as x,j as t,f as oe,$ as ie}from"./iframe-BlyjOLeZ.js";import{f as le,u as Y,d as F,B as K,e as X,c as ce}from"./factory-DLKEpXnh.js";import{e as pe,b as de,g as ue}from"./get-size-AZBW9FMn.js";import{p as me}from"./polymorphic-factory-CAKH0E_l.js";import"./preload-helper-Dp1pzeXC.js";var j={group:"m_11def92b",root:"m_f85678b6",image:"m_11f8ac07",placeholder:"m_104cd71f"};const Q=x.createContext(null),ve=Q.Provider;function ge(){return{withinGroup:!!x.useContext(Q)}}const fe=X((r,{spacing:a})=>({group:{"--ag-spacing":pe(a)}})),z=le((r,a)=>{const e=Y("AvatarGroup",null,r),{classNames:s,className:p,style:c,styles:v,unstyled:d,vars:g,spacing:n,attributes:l,...y}=e,h=F({name:"AvatarGroup",classes:j,props:e,className:p,style:c,classNames:s,styles:v,unstyled:d,attributes:l,vars:g,varsResolver:fe,rootSelector:"group"});return t.jsx(ve,{value:!0,children:t.jsx(K,{ref:a,...h("group"),...y})})});z.classes=j;z.displayName="@mantine/core/AvatarGroup";function ye(r){return t.jsx("svg",{...r,"data-avatar-placeholder-icon":!0,viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:t.jsx("path",{d:"M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd"})})}function he(r){let a=0;for(let e=0;e<r.length;e+=1){const s=r.charCodeAt(e);a=(a<<5)-a+s,a|=0}return a}const xe=["blue","cyan","grape","green","indigo","lime","orange","pink","red","teal","violet"];function Ae(r,a=xe){const e=he(r),s=Math.abs(e)%a.length;return a[s]}function _e(r,a=2){const e=r.split(" ");return e.length===1?r.slice(0,a).toUpperCase():e.map(s=>s[0]).slice(0,a).join("").toUpperCase()}const we=X((r,{size:a,radius:e,variant:s,gradient:p,color:c,autoContrast:v,name:d,allowedInitialsColors:g})=>{const n=c==="initials"&&typeof d=="string"?Ae(d,g):c,l=r.variantColorResolver({color:n||"gray",theme:r,gradient:p,variant:s||"light",autoContrast:v});return{root:{"--avatar-size":ue(a,"avatar-size"),"--avatar-radius":e===void 0?void 0:de(e),"--avatar-bg":n||s?l.background:void 0,"--avatar-color":n||s?l.color:void 0,"--avatar-bd":n||s?l.border:void 0}}}),L=me((r,a)=>{const e=Y("Avatar",null,r),{classNames:s,className:p,style:c,styles:v,unstyled:d,vars:g,src:n,alt:l,radius:y,color:h,gradient:A,imageProps:o,children:f,autoContrast:S,mod:u,name:G,allowedInitialsColors:Re,attributes:ae,...re}=e,te=ge(),[se,P]=x.useState(!n),R=F({name:"Avatar",props:e,classes:j,className:p,style:c,classNames:s,styles:v,unstyled:d,attributes:ae,vars:g,varsResolver:we});return x.useEffect(()=>P(!n),[n]),t.jsx(K,{...R("root"),mod:[{"within-group":te.withinGroup},u],ref:a,...re,children:se||!n?t.jsx("span",{...R("placeholder"),title:l,children:f||typeof G=="string"&&_e(G)||t.jsx(ye,{})}):t.jsx("img",{...o,...R("image"),src:n,alt:l,onError:ne=>{var M;P(!0),(M=o==null?void 0:o.onError)==null||M.call(o,ne)}})})});L.classes=j;L.displayName="@mantine/core/Avatar";L.Group=z;const Ce="Avatar-module__root___fXu-J",be="Avatar-module__iconWrapper___ojly2",Ne="Avatar-module__textWrapper___zp-jD",je="Avatar-module__image___ieqGp",Le="Avatar-module__placeholder___IDW7-",i={root:Ce,iconWrapper:be,textWrapper:Ne,image:je,placeholder:Le},ee=x.forwardRef(function({size:a="default",variant:e="solid",icon:s,children:p,src:c,overStyled:v=!1,...d},g){const n={solid:"filled",outline:"outline",ghost:"transparent"},l={default:"md",small:"sm",large:"lg"},y=oe(d,v),h=y;let A="text";c?A="image":s&&(A="icon");const o={root:i.root,image:i.image,placeholder:i.placeholder},f=h.classNames;if(f&&typeof f=="object"&&!Array.isArray(f)){const u=f;o.root=u.root?`${i.root} ${u.root}`:i.root,o.image=u.image?`${i.image} ${u.image}`:i.image,o.placeholder=u.placeholder?`${i.placeholder} ${u.placeholder}`:i.placeholder}const S=h.className;return t.jsx(L,{ref:g,className:S,classNames:o,variant:n[e],size:l[a],src:c,"data-variant":e,"data-size":a,"data-style":A,...y,children:s!=null?t.jsx("span",{className:i.iconWrapper,"aria-hidden":!0,children:s}):p!=null?t.jsx("span",{className:i.textWrapper,children:p}):void 0})});ee.displayName="Avatar";const m=ce(ee);try{m.displayName="Avatar",m.__docgenInfo={description:"Recursica Avatar component wrapping Mantine's Avatar.\n\nSupports polymorphism via the `component` prop or `renderRoot` for custom element rendering.",displayName:"Avatar",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Avatar/Avatar.tsx",methods:[],props:{variant:{defaultValue:{value:"solid"},declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"variant",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"enum",raw:'"solid" | "outline" | "ghost" | undefined',value:[{value:"undefined"},{value:'"solid"'},{value:'"outline"'},{value:'"ghost"'}]}},size:{defaultValue:{value:"default"},declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"size",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"enum",raw:'"default" | "small" | "large" | undefined',value:[{value:"undefined"},{value:'"default"'},{value:'"small"'},{value:'"large"'}]}},icon:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"icon",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"ReactNode"}},component:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"component",required:!1,tags:{},type:{name:'"symbol" | "object" | "style" | "p" | "td" | "button" | "text" | "small" | "a" | "abbr" | "address" | "area" | "article" | "aside" | "audio" | "b" | "base" | "bdi" | "bdo" | "big" | ... 160 more ... | undefined'}},renderRoot:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"},{fileName:"recursica/node_modules/@mantine/core/lib/core/factory/create-polymorphic-component.d.ts",name:"TypeLiteral"}],description:"",name:"renderRoot",required:!1,tags:{},type:{name:"((props: any) => any) | ((props: Record<string, any>) => any) | undefined"}}},tags:{}}}catch{}const ke={title:"UI-Kit/Avatar",component:m,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","ghost"],description:"The visual variant of the avatar (applies to icon/text styles)"},size:{control:"radio",options:["default","small","large"],description:"The size of the avatar"},src:{control:"text",description:"Image URL for the image style avatar"},icon:{table:{disable:!0}}}},_={args:{size:"default",variant:"solid"},render:({withLayer:r,layer:a,...e})=>t.jsx(m,{...e})},w={args:{children:"JD",variant:"solid",size:"default"},render:({withLayer:r,layer:a,...e})=>t.jsx(m,{...e})},C={args:{src:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",size:"large"},render:({withLayer:r,layer:a,...e})=>t.jsx(m,{...e})},b={args:{size:"small",variant:"ghost",icon:t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),t.jsx("circle",{cx:"12",cy:"7",r:"4"})]})},render:({withLayer:r,layer:a,...e})=>t.jsx(m,{...e})},N={args:{children:"L1",variant:"outline",size:"default"},render:({withLayer:r,layer:a,...e})=>t.jsx(ie,{layer:1,style:{padding:"24px",display:"inline-block"},children:t.jsx(m,{...e})})};var k,W,D;_.parameters={..._.parameters,docs:{...(k=_.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    size: "default",
    variant: "solid"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => {
    return <Avatar {...args} />;
  }
}`,...(D=(W=_.parameters)==null?void 0:W.docs)==null?void 0:D.source}}};var I,B,T;w.parameters={...w.parameters,docs:{...(I=w.parameters)==null?void 0:I.docs,source:{originalSource:`{
  args: {
    children: "JD",
    variant: "solid",
    size: "default"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Avatar {...args} />
}`,...(T=(B=w.parameters)==null?void 0:B.docs)==null?void 0:T.source}}};var V,$,q;C.parameters={...C.parameters,docs:{...(V=C.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    size: "large"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Avatar {...args} />
}`,...(q=($=C.parameters)==null?void 0:$.docs)==null?void 0:q.source}}};var H,E,O;b.parameters={...b.parameters,docs:{...(H=b.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    size: "small",
    variant: "ghost",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Avatar {...args} />
}`,...(O=(E=b.parameters)==null?void 0:E.docs)==null?void 0:O.source}}};var Z,U,J;N.parameters={...N.parameters,docs:{...(Z=N.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    children: "L1",
    variant: "outline",
    size: "default"
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  render: ({
    withLayer,
    layer,
    ...args
  }: any) => <Layer layer={1} style={{
    padding: "24px",
    display: "inline-block"
  }}>
      <Avatar {...args} />
    </Layer>
}`,...(J=(U=N.parameters)==null?void 0:U.docs)==null?void 0:J.source}}};const We=["Default","TextSolidDefault","ImageLarge","IconSmallGhost","LayerOneOutline"];export{_ as Default,b as IconSmallGhost,C as ImageLarge,N as LayerOneOutline,w as TextSolidDefault,We as __namedExportsOrder,ke as default};
