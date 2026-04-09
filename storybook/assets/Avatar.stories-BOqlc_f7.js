import{r as f,j as r}from"./iframe-CphPjEVK.js";import{e as se,a as ne,d as le}from"./get-size-Cyen0TVy.js";import{f as ie,u as U,b as J,c as Y,B as F}from"./factory-B-0KiR2C.js";import{p as ce}from"./polymorphic-factory-BY4dselc.js";import{T as K}from"./adapter-common-BLbBFVzm.js";import"./preload-helper-Dp1pzeXC.js";var z={group:"m_11def92b",root:"m_f85678b6",image:"m_11f8ac07",placeholder:"m_104cd71f"};const X=f.createContext(null),de=X.Provider;function pe(){return{withinGroup:!!f.useContext(X)}}const ue=Y((e,{spacing:a})=>({group:{"--ag-spacing":se(a)}})),R=ie((e,a)=>{const t=U("AvatarGroup",null,e),{classNames:o,className:g,style:n,styles:p,unstyled:u,vars:m,spacing:s,attributes:c,...h}=t,x=J({name:"AvatarGroup",classes:z,props:t,className:g,style:n,classNames:o,styles:p,unstyled:u,attributes:c,vars:m,varsResolver:ue,rootSelector:"group"});return r.jsx(de,{value:!0,children:r.jsx(F,{ref:a,...x("group"),...h})})});R.classes=z;R.displayName="@mantine/core/AvatarGroup";function me(e){return r.jsx("svg",{...e,"data-avatar-placeholder-icon":!0,viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:r.jsx("path",{d:"M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd"})})}function ve(e){let a=0;for(let t=0;t<e.length;t+=1){const o=e.charCodeAt(t);a=(a<<5)-a+o,a|=0}return a}const ge=["blue","cyan","grape","green","indigo","lime","orange","pink","red","teal","violet"];function fe(e,a=ge){const t=ve(e),o=Math.abs(t)%a.length;return a[o]}function he(e,a=2){const t=e.split(" ");return t.length===1?e.slice(0,a).toUpperCase():t.map(o=>o[0]).slice(0,a).join("").toUpperCase()}const xe=Y((e,{size:a,radius:t,variant:o,gradient:g,color:n,autoContrast:p,name:u,allowedInitialsColors:m})=>{const s=n==="initials"&&typeof u=="string"?fe(u,m):n,c=e.variantColorResolver({color:s||"gray",theme:e,gradient:g,variant:o||"light",autoContrast:p});return{root:{"--avatar-size":le(a,"avatar-size"),"--avatar-radius":t===void 0?void 0:ne(t),"--avatar-bg":s||o?c.background:void 0,"--avatar-color":s||o?c.color:void 0,"--avatar-bd":s||o?c.border:void 0}}}),b=ce((e,a)=>{const t=U("Avatar",null,e),{classNames:o,className:g,style:n,styles:p,unstyled:u,vars:m,src:s,alt:c,radius:h,color:x,gradient:y,imageProps:l,children:v,autoContrast:je,mod:Q,name:G,allowedInitialsColors:ze,attributes:ee,...ae}=t,re=pe(),[te,N]=f.useState(!s),S=J({name:"Avatar",props:t,classes:z,className:g,style:n,classNames:o,styles:p,unstyled:u,attributes:ee,vars:m,varsResolver:xe});return f.useEffect(()=>N(!s),[s]),r.jsx(F,{...S("root"),mod:[{"within-group":re.withinGroup},Q],ref:a,...ae,children:te||!s?r.jsx("span",{...S("placeholder"),title:c,children:v||typeof G=="string"&&he(G)||r.jsx(me,{})}):r.jsx("img",{...l,...S("image"),src:s,alt:c,onError:oe=>{var k;N(!0),(k=l==null?void 0:l.onError)==null||k.call(l,oe)}})})});b.classes=z;b.displayName="@mantine/core/Avatar";b.Group=R;const ye="Avatar-module__root___fXu-J",Ae="Avatar-module__iconWrapper___ojly2",_e="Avatar-module__textWrapper___zp-jD",Ce="Avatar-module__image___ieqGp",we="Avatar-module__placeholder___IDW7-",i={root:ye,iconWrapper:Ae,textWrapper:_e,image:Ce,placeholder:we},d=f.forwardRef(function({size:a="default",variant:t="solid",icon:o,className:g,classNames:n,children:p,style:u,src:m,...s},c){const h={solid:"filled",outline:"outline",ghost:"transparent"},x={default:"md",small:"sm",large:"lg"};let y="text";m?y="image":o&&(y="icon");const l={root:i.root,image:i.image,placeholder:i.placeholder};if(n&&typeof n=="object"&&!Array.isArray(n)){const v=n;l.root=v.root?`${i.root} ${v.root}`:i.root,l.image=v.image?`${i.image} ${v.image}`:i.image,l.placeholder=v.placeholder?`${i.placeholder} ${v.placeholder}`:i.placeholder}return r.jsx(b,{ref:c,className:g,classNames:l,variant:h[t],size:x[a],style:u,src:m,"data-variant":t,"data-size":a,"data-style":y,...s,children:o!=null?r.jsx("span",{className:i.iconWrapper,"aria-hidden":!0,children:o}):p!=null?r.jsx("span",{className:i.textWrapper,children:p}):void 0})});d.displayName="Avatar";try{d.displayName="Avatar",d.__docgenInfo={description:"",displayName:"Avatar",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/Avatar/Avatar.tsx",methods:[],props:{size:{defaultValue:{value:"default"},declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"size",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"enum",raw:'"small" | "default" | "large" | undefined',value:[{value:"undefined"},{value:'"small"'},{value:'"default"'},{value:'"large"'}]}},variant:{defaultValue:{value:"solid"},declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"variant",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"enum",raw:'"solid" | "outline" | "ghost" | undefined',value:[{value:"undefined"},{value:'"solid"'},{value:'"outline"'},{value:'"ghost"'}]}},icon:{defaultValue:null,declarations:[{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"}],description:"",name:"icon",parent:{fileName:"mantine-adapter/src/components/Avatar/Avatar.tsx",name:"RecursicaAvatarProps"},required:!1,tags:{},type:{name:"ReactNode"}}},tags:{}}}catch{}const Le={title:"UI-Kit/Avatar",component:d,tags:["autodocs"],argTypes:{variant:{control:"select",options:["solid","outline","ghost"],description:"The visual variant of the avatar (applies to icon/text styles)"},size:{control:"radio",options:["default","small","large"],description:"The size of the avatar"},src:{control:"text",description:"Image URL for the image style avatar"},layer:{control:"radio",options:[0,1,2,3],description:"The design system layer context",table:{category:"Story Controls"}}}},A={args:{size:"default",variant:"solid",layer:0,children:"AB"},render:({layer:e=0,...a})=>r.jsx(K,{layer:e,style:{padding:"24px",display:"inline-block"},children:r.jsx(d,{...a})})},_={args:{children:"JD",variant:"solid",size:"default"},render:e=>r.jsx(d,{...e})},C={args:{src:"https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",size:"large"},render:e=>r.jsx(d,{...e})},w={args:{size:"small",variant:"ghost",icon:r.jsxs("svg",{xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[r.jsx("path",{d:"M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"}),r.jsx("circle",{cx:"12",cy:"7",r:"4"})]})},render:e=>r.jsx(d,{...e})},j={args:{children:"L1",variant:"outline",size:"default"},render:e=>r.jsx(K,{layer:1,style:{padding:"24px",display:"inline-block"},children:r.jsx(d,{...e})})};var L,M,W;A.parameters={...A.parameters,docs:{...(L=A.parameters)==null?void 0:L.docs,source:{originalSource:`{
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
}`,...(W=(M=A.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};var D,I,B;_.parameters={..._.parameters,docs:{...(D=_.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    children: "JD",
    variant: "solid",
    size: "default"
  },
  render: args => <Avatar {...args} />
}`,...(B=(I=_.parameters)==null?void 0:I.docs)==null?void 0:B.source}}};var H,P,$;C.parameters={...C.parameters,docs:{...(H=C.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
    size: "large"
  },
  render: args => <Avatar {...args} />
}`,...($=(P=C.parameters)==null?void 0:P.docs)==null?void 0:$.source}}};var E,T,V;w.parameters={...w.parameters,docs:{...(E=w.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    size: "small",
    variant: "ghost",
    icon: <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
  },
  render: args => <Avatar {...args} />
}`,...(V=(T=w.parameters)==null?void 0:T.docs)==null?void 0:V.source}}};var q,O,Z;j.parameters={...j.parameters,docs:{...(q=j.parameters)==null?void 0:q.docs,source:{originalSource:`{
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
}`,...(Z=(O=j.parameters)==null?void 0:O.docs)==null?void 0:Z.source}}};const Me=["Default","TextSolidDefault","ImageLarge","IconSmallGhost","LayerOneOutline"];export{A as Default,w as IconSmallGhost,C as ImageLarge,j as LayerOneOutline,_ as TextSolidDefault,Me as __namedExportsOrder,Le as default};
