import{r as h,j as t,$ as se}from"./iframe-DCvb_qQa.js";import{e as ne,b as oe,g as ie}from"./get-size-D3jWN7Ok.js";import{f as le,u as U,b as J,B as Y,c as F}from"./factory-CFGMTXsj.js";import{p as ce}from"./polymorphic-factory-DlsFFMxY.js";import"./preload-helper-Dp1pzeXC.js";var b={group:"m_11def92b",root:"m_f85678b6",image:"m_11f8ac07",placeholder:"m_104cd71f"};const K=h.createContext(null),de=K.Provider;function pe(){return{withinGroup:!!h.useContext(K)}}const ue=F((r,{spacing:a})=>({group:{"--ag-spacing":ne(a)}})),R=le((r,a)=>{const e=U("AvatarGroup",null,r),{classNames:s,className:g,style:o,styles:p,unstyled:u,vars:m,spacing:n,attributes:c,...f}=e,y=J({name:"AvatarGroup",classes:b,props:e,className:g,style:o,classNames:s,styles:p,unstyled:u,attributes:c,vars:m,varsResolver:ue,rootSelector:"group"});return t.jsx(de,{value:!0,children:t.jsx(Y,{ref:a,...y("group"),...f})})});R.classes=b;R.displayName="@mantine/core/AvatarGroup";function me(r){return t.jsx("svg",{...r,"data-avatar-placeholder-icon":!0,viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:t.jsx("path",{d:"M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd"})})}function ve(r){let a=0;for(let e=0;e<r.length;e+=1){const s=r.charCodeAt(e);a=(a<<5)-a+s,a|=0}return a}const ge=["blue","cyan","grape","green","indigo","lime","orange","pink","red","teal","violet"];function he(r,a=ge){const e=ve(r),s=Math.abs(e)%a.length;return a[s]}function fe(r,a=2){const e=r.split(" ");return e.length===1?r.slice(0,a).toUpperCase():e.map(s=>s[0]).slice(0,a).join("").toUpperCase()}const ye=F((r,{size:a,radius:e,variant:s,gradient:g,color:o,autoContrast:p,name:u,allowedInitialsColors:m})=>{const n=o==="initials"&&typeof u=="string"?he(u,m):o,c=r.variantColorResolver({color:n||"gray",theme:r,gradient:g,variant:s||"light",autoContrast:p});return{root:{"--avatar-size":ie(a,"avatar-size"),"--avatar-radius":e===void 0?void 0:oe(e),"--avatar-bg":n||s?c.background:void 0,"--avatar-color":n||s?c.color:void 0,"--avatar-bd":n||s?c.border:void 0}}}),L=ce((r,a)=>{const e=U("Avatar",null,r),{classNames:s,className:g,style:o,styles:p,unstyled:u,vars:m,src:n,alt:c,radius:f,color:y,gradient:x,imageProps:i,children:v,autoContrast:je,mod:X,name:S,allowedInitialsColors:be,attributes:Q,...ee}=e,ae=pe(),[re,G]=h.useState(!n),z=J({name:"Avatar",props:e,classes:b,className:g,style:o,classNames:s,styles:p,unstyled:u,attributes:Q,vars:m,varsResolver:ye});return h.useEffect(()=>G(!n),[n]),t.jsx(Y,{...z("root"),mod:[{"within-group":ae.withinGroup},X],ref:a,...ee,children:re||!n?t.jsx("span",{...z("placeholder"),title:c,children:v||typeof S=="string"&&fe(S)||t.jsx(me,{})}):t.jsx("img",{...i,...z("image"),src:n,alt:c,onError:te=>{var N;G(!0),(N=i==null?void 0:i.onError)==null||N.call(i,te)}})})});L.classes=b;L.displayName="@mantine/core/Avatar";L.Group=R;const xe="Avatar-module__root___fXu-J",Ae="Avatar-module__iconWrapper___ojly2",we="Avatar-module__textWrapper___zp-jD",_e="Avatar-module__image___ieqGp",Ce="Avatar-module__placeholder___IDW7-",l={root:xe,iconWrapper:Ae,textWrapper:we,image:_e,placeholder:Ce},d=h.forwardRef(function({size:a="default",variant:e="solid",icon:s,className:g,classNames:o,children:p,style:u,src:m,...n},c){const f={solid:"filled",outline:"outline",ghost:"transparent"},y={default:"md",small:"sm",large:"lg"};let x="text";m?x="image":s&&(x="icon");const i={root:l.root,image:l.image,placeholder:l.placeholder};if(o&&typeof o=="object"&&!Array.isArray(o)){const v=o;i.root=v.root?`${l.root} ${v.root}`:l.root,i.image=v.image?`${l.image} ${v.image}`:l.image,i.placeholder=v.placeholder?`${l.placeholder} ${v.placeholder}`:l.placeholder}return t.jsx(L,{ref:c,className:g,classNames:i,variant:f[e],size:y[a],style:u,src:m,"data-variant":e,"data-size":a,"data-style":x,...n,children:s!=null?t.jsx("span",{className:l.iconWrapper,"aria-hidden":!0,children:s}):p!=null?t.jsx("span",{className:l.textWrapper,children:p}):void 0})});d.displayName="Avatar";try{d.displayName="Avatar",d.__docgenInfo={description:"",displayName:"Avatar",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Avatar/Avatar.tsx",methods:[],props:{size:{defaultValue:{value:"default"},declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"size",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"enum",raw:'"small" | "default" | "large" | undefined',value:[{value:"undefined"},{value:'"small"'},{value:'"default"'},{value:'"large"'}]}},variant:{defaultValue:{value:"solid"},declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"variant",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"enum",raw:'"solid" | "outline" | "ghost" | undefined',value:[{value:"undefined"},{value:'"solid"'},{value:'"outline"'},{value:'"ghost"'}]}},icon:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"icon",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"ReactNode"}}},tags:{}}}catch{}const Ne={title:"UI-Kit/Avatar",component:d,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","ghost"],description:"The visual variant of the avatar (applies to icon/text styles)"},size:{control:"radio",options:["default","small","large"],description:"The size of the avatar"},src:{control:"text",description:"Image URL for the image style avatar"},icon:{table:{disable:!0}}}},A={args:{size:"default",variant:"solid"},render:({withLayer:r,layer:a,...e})=>t.jsx(d,{...e})},w={args:{children:"JD",variant:"solid",size:"default"},render:({withLayer:r,layer:a,...e})=>t.jsx(d,{...e})},_={args:{src:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",size:"large"},render:({withLayer:r,layer:a,...e})=>t.jsx(d,{...e})},C={args:{size:"small",variant:"ghost",icon:t.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[t.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),t.jsx("circle",{cx:"12",cy:"7",r:"4"})]})},render:({withLayer:r,layer:a,...e})=>t.jsx(d,{...e})},j={args:{children:"L1",variant:"outline",size:"default"},render:({withLayer:r,layer:a,...e})=>t.jsx(se,{layer:1,style:{padding:"24px",display:"inline-block"},children:t.jsx(d,{...e})})};var k,M,W;A.parameters={...A.parameters,docs:{...(k=A.parameters)==null?void 0:k.docs,source:{originalSource:`{
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
}`,...(W=(M=A.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};var D,I,B;w.parameters={...w.parameters,docs:{...(D=w.parameters)==null?void 0:D.docs,source:{originalSource:`{
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
}`,...(B=(I=w.parameters)==null?void 0:I.docs)==null?void 0:B.source}}};var $,H,P;_.parameters={..._.parameters,docs:{...($=_.parameters)==null?void 0:$.docs,source:{originalSource:`{
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
}`,...(P=(H=_.parameters)==null?void 0:H.docs)==null?void 0:P.source}}};var E,V,q;C.parameters={...C.parameters,docs:{...(E=C.parameters)==null?void 0:E.docs,source:{originalSource:`{
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
}`,...(q=(V=C.parameters)==null?void 0:V.docs)==null?void 0:q.source}}};var O,T,Z;j.parameters={...j.parameters,docs:{...(O=j.parameters)==null?void 0:O.docs,source:{originalSource:`{
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
}`,...(Z=(T=j.parameters)==null?void 0:T.docs)==null?void 0:Z.source}}};const ke=["Default","TextSolidDefault","ImageLarge","IconSmallGhost","LayerOneOutline"];export{A as Default,C as IconSmallGhost,_ as ImageLarge,j as LayerOneOutline,w as TextSolidDefault,ke as __namedExportsOrder,Ne as default};
