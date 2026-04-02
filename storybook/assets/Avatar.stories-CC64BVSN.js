import{r as h,j as r}from"./iframe-B1nsR4E1.js";import{f as se,u as J,a as Y,c as F,B as K,g as ne,p as le,b as ie,d as ce}from"./polymorphic-factory-ERwGRmfx.js";import{T as P}from"./adapter-common-C2VKK8Dt.js";import"./preload-helper-Dp1pzeXC.js";const X=h.createContext(null),de=X.Provider;function pe(){return{withinGroup:!!h.useContext(X)}}var z={group:"m_11def92b",root:"m_f85678b6",image:"m_11f8ac07",placeholder:"m_104cd71f"};const ue=F((e,{spacing:a})=>({group:{"--ag-spacing":ne(a)}})),G=se((e,a)=>{const t=J("AvatarGroup",null,e),{classNames:o,className:v,style:n,styles:p,unstyled:u,vars:g,spacing:s,attributes:c,...f}=t,x=Y({name:"AvatarGroup",classes:z,props:t,className:v,style:n,classNames:o,styles:p,unstyled:u,attributes:c,vars:g,varsResolver:ue,rootSelector:"group"});return r.jsx(de,{value:!0,children:r.jsx(K,{ref:a,...x("group"),...f})})});G.classes=z;G.displayName="@mantine/core/AvatarGroup";function ge(e){return r.jsx("svg",{...e,"data-avatar-placeholder-icon":!0,viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:r.jsx("path",{d:"M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd"})})}function me(e){let a=0;for(let t=0;t<e.length;t+=1){const o=e.charCodeAt(t);a=(a<<5)-a+o,a|=0}return a}const ve=["blue","cyan","grape","green","indigo","lime","orange","pink","red","teal","violet"];function he(e,a=ve){const t=me(e),o=Math.abs(t)%a.length;return a[o]}function fe(e,a=2){const t=e.split(" ");return t.length===1?e.slice(0,a).toUpperCase():t.map(o=>o[0]).slice(0,a).join("").toUpperCase()}const xe=F((e,{size:a,radius:t,variant:o,gradient:v,color:n,autoContrast:p,name:u,allowedInitialsColors:g})=>{const s=n==="initials"&&typeof u=="string"?he(u,g):n,c=e.variantColorResolver({color:s||"gray",theme:e,gradient:v,variant:o||"light",autoContrast:p});return{root:{"--avatar-size":ce(a,"avatar-size"),"--avatar-radius":t===void 0?void 0:ie(t),"--avatar-bg":s||o?c.background:void 0,"--avatar-color":s||o?c.color:void 0,"--avatar-bd":s||o?c.border:void 0}}}),b=le((e,a)=>{const t=J("Avatar",null,e),{classNames:o,className:v,style:n,styles:p,unstyled:u,vars:g,src:s,alt:c,radius:f,color:x,gradient:y,imageProps:l,children:m,autoContrast:we,mod:Q,name:L,allowedInitialsColors:ze,attributes:ee,...ae}=t,re=pe(),[te,k]=h.useState(!s),S=Y({name:"Avatar",props:t,classes:z,className:v,style:n,classNames:o,styles:p,unstyled:u,attributes:ee,vars:g,varsResolver:xe});return h.useEffect(()=>k(!s),[s]),r.jsx(K,{...S("root"),mod:[{"within-group":re.withinGroup},Q],ref:a,...ae,children:te||!s?r.jsx("span",{...S("placeholder"),title:c,children:m||typeof L=="string"&&fe(L)||r.jsx(ge,{})}):r.jsx("img",{...l,...S("image"),src:s,alt:c,onError:oe=>{var M;k(!0),(M=l==null?void 0:l.onError)==null||M.call(l,oe)}})})});b.classes=z;b.displayName="@mantine/core/Avatar";b.Group=G;const ye="Avatar-module__root___fXu-J",_e="Avatar-module__iconWrapper___ojly2",Ce="Avatar-module__textWrapper___zp-jD",Ae="Avatar-module__image___ieqGp",je="Avatar-module__placeholder___IDW7-",i={root:ye,iconWrapper:_e,textWrapper:Ce,image:Ae,placeholder:je},d=h.forwardRef(function({size:a="default",variant:t="solid",icon:o,className:v,classNames:n,children:p,style:u,src:g,...s},c){const f={solid:"filled",outline:"outline",ghost:"transparent"},x={default:"md",small:"sm",large:"lg"};let y="text";g?y="image":o&&(y="icon");const l={root:i.root,image:i.image,placeholder:i.placeholder};if(n&&typeof n=="object"&&!Array.isArray(n)){const m=n;l.root=m.root?`${i.root} ${m.root}`:i.root,l.image=m.image?`${i.image} ${m.image}`:i.image,l.placeholder=m.placeholder?`${i.placeholder} ${m.placeholder}`:i.placeholder}return r.jsx(b,{ref:c,className:v,classNames:l,variant:f[t],size:x[a],style:u,src:g,"data-variant":t,"data-size":a,"data-style":y,...s,children:o!=null?r.jsx("span",{className:i.iconWrapper,"aria-hidden":!0,children:o}):p!=null?r.jsx("span",{className:i.textWrapper,children:p}):void 0})});d.displayName="Avatar";try{d.displayName="Avatar",d.__docgenInfo={description:"",displayName:"Avatar",props:{size:{defaultValue:{value:"default"},description:"",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"small"'},{value:'"default"'},{value:'"large"'}]}},variant:{defaultValue:{value:"solid"},description:"",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"solid"'},{value:'"outline"'},{value:'"ghost"'}]}},icon:{defaultValue:null,description:"",name:"icon",required:!1,type:{name:"ReactNode"}}}}}catch{}const ke={title:"UI-Kit/Avatar",component:d,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","ghost"],description:"The visual variant of the avatar (applies to icon/text styles)"},size:{control:"radio",options:["default","small","large"],description:"The size of the avatar"},src:{control:"text",description:"Image URL for the image style avatar"},layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}}}},_={args:{size:"default",variant:"solid",layer:0,children:"AB"},render:({layer:e=0,...a})=>r.jsx(P,{layer:e,style:{padding:"24px",display:"inline-block"},children:r.jsx(d,{...a})})},C={args:{children:"JD",variant:"solid",size:"default"},render:e=>r.jsx(d,{...e})},A={args:{src:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",size:"large"},render:e=>r.jsx(d,{...e})},j={args:{size:"small",variant:"ghost",icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),r.jsx("circle",{cx:"12",cy:"7",r:"4"})]})},render:e=>r.jsx(d,{...e})},w={args:{children:"L1",variant:"outline",size:"default"},render:e=>r.jsx(P,{layer:1,style:{padding:"24px",display:"inline-block"},children:r.jsx(d,{...e})})};var W,D,I;_.parameters={..._.parameters,docs:{...(W=_.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    size: "default",
    variant: "solid",
    layer: 0,
    children: "AB"
  },
  render: ({
    layer = 0,
    ...args
  }) => {
    return <Layer layer={layer as 0 | 1 | 2 | 3} style={{
      padding: "24px",
      display: "inline-block"
    }}>
        <Avatar {...args} />
      </Layer>;
  }
}`,...(I=(D=_.parameters)==null?void 0:D.docs)==null?void 0:I.source}}};var R,B,N;C.parameters={...C.parameters,docs:{...(R=C.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    children: "JD",
    variant: "solid",
    size: "default"
  },
  render: args => <Avatar {...args} />
}`,...(N=(B=C.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};var H,$,E;A.parameters={...A.parameters,docs:{...(H=A.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    size: "large"
  },
  render: args => <Avatar {...args} />
}`,...(E=($=A.parameters)==null?void 0:$.docs)==null?void 0:E.source}}};var T,V,q;j.parameters={...j.parameters,docs:{...(T=j.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    size: "small",
    variant: "ghost",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
  },
  render: args => <Avatar {...args} />
}`,...(q=(V=j.parameters)==null?void 0:V.docs)==null?void 0:q.source}}};var O,Z,U;w.parameters={...w.parameters,docs:{...(O=w.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    children: "L1",
    variant: "outline",
    size: "default"
  },
  render: args => <Layer layer={1} style={{
    padding: "24px",
    display: "inline-block"
  }}>
      <Avatar {...args} />
    </Layer>
}`,...(U=(Z=w.parameters)==null?void 0:Z.docs)==null?void 0:U.source}}};const Me=["Default","TextSolidDefault","ImageLarge","IconSmallGhost","LayerOneOutline"];export{_ as Default,j as IconSmallGhost,A as ImageLarge,w as LayerOneOutline,C as TextSolidDefault,Me as __namedExportsOrder,ke as default};
