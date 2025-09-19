import{r as d,j as o}from"./iframe-CaYtvSrb.js";import{c as Va,a as Qa,g as Xa,b as Ya}from"./Typography.css.ts.vanilla-BTGOHLvo.js";import{I as ar}from"./Icon-P8eDKGJe.js";import{f as rr,u as qa,a as Ma,p as er}from"./polymorphic-factory-BpB2RHWM.js";import{B as Ta,c as sr}from"./Box-DI5237On.js";import"./preload-helper-CZ_saIiD.js";const Za=d.createContext(null),tr=Za.Provider;function or(){return{withinGroup:!!d.useContext(Za)}}var W={group:"m_11def92b",root:"m_f85678b6",image:"m_11f8ac07",placeholder:"m_104cd71f"};const ir=Va((r,{spacing:a})=>({group:{"--ag-spacing":Qa(a)}})),B=rr((r,a)=>{const e=qa("AvatarGroup",null,r),{classNames:s,className:c,style:i,styles:m,unstyled:n,vars:p,spacing:t,attributes:l,...R}=e,E=Ma({name:"AvatarGroup",classes:W,props:e,className:c,style:i,classNames:s,styles:m,unstyled:n,attributes:l,vars:p,varsResolver:ir,rootSelector:"group"});return o.jsx(tr,{value:!0,children:o.jsx(Ta,{ref:a,...E("group"),...R})})});B.classes=W;B.displayName="@mantine/core/AvatarGroup";function nr(r){return o.jsx("svg",{...r,"data-avatar-placeholder-icon":!0,viewBox:"0 0 15 15",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:o.jsx("path",{d:"M0.877014 7.49988C0.877014 3.84219 3.84216 0.877045 7.49985 0.877045C11.1575 0.877045 14.1227 3.84219 14.1227 7.49988C14.1227 11.1575 11.1575 14.1227 7.49985 14.1227C3.84216 14.1227 0.877014 11.1575 0.877014 7.49988ZM7.49985 1.82704C4.36683 1.82704 1.82701 4.36686 1.82701 7.49988C1.82701 8.97196 2.38774 10.3131 3.30727 11.3213C4.19074 9.94119 5.73818 9.02499 7.50023 9.02499C9.26206 9.02499 10.8093 9.94097 11.6929 11.3208C12.6121 10.3127 13.1727 8.97172 13.1727 7.49988C13.1727 4.36686 10.6328 1.82704 7.49985 1.82704ZM10.9818 11.9787C10.2839 10.7795 8.9857 9.97499 7.50023 9.97499C6.01458 9.97499 4.71624 10.7797 4.01845 11.9791C4.97952 12.7272 6.18765 13.1727 7.49985 13.1727C8.81227 13.1727 10.0206 12.727 10.9818 11.9787ZM5.14999 6.50487C5.14999 5.207 6.20212 4.15487 7.49999 4.15487C8.79786 4.15487 9.84999 5.207 9.84999 6.50487C9.84999 7.80274 8.79786 8.85487 7.49999 8.85487C6.20212 8.85487 5.14999 7.80274 5.14999 6.50487ZM7.49999 5.10487C6.72679 5.10487 6.09999 5.73167 6.09999 6.50487C6.09999 7.27807 6.72679 7.90487 7.49999 7.90487C8.27319 7.90487 8.89999 7.27807 8.89999 6.50487C8.89999 5.73167 8.27319 5.10487 7.49999 5.10487Z",fill:"currentColor",fillRule:"evenodd",clipRule:"evenodd"})})}function lr(r){let a=0;for(let e=0;e<r.length;e+=1){const s=r.charCodeAt(e);a=(a<<5)-a+s,a|=0}return a}const cr=["blue","cyan","grape","green","indigo","lime","orange","pink","red","teal","violet"];function mr(r,a=cr){const e=lr(r),s=Math.abs(e)%a.length;return a[s]}function pr(r,a=2){const e=r.split(" ");return e.length===1?r.slice(0,a).toUpperCase():e.map(s=>s[0]).slice(0,a).join("").toUpperCase()}const ur=Va((r,{size:a,radius:e,variant:s,gradient:c,color:i,autoContrast:m,name:n,allowedInitialsColors:p})=>{const t=i==="initials"&&typeof n=="string"?mr(n,p):i,l=r.variantColorResolver({color:t||"gray",theme:r,gradient:c,variant:s||"light",autoContrast:m});return{root:{"--avatar-size":Ya(a,"avatar-size"),"--avatar-radius":e===void 0?void 0:Xa(e),"--avatar-bg":t||s?l.background:void 0,"--avatar-color":t||s?l.color:void 0,"--avatar-bd":t||s?l.border:void 0}}}),j=er((r,a)=>{const e=qa("Avatar",null,r),{classNames:s,className:c,style:i,styles:m,unstyled:n,vars:p,src:t,alt:l,radius:R,color:E,gradient:gr,imageProps:u,children:ka,autoContrast:hr,mod:Fa,name:L,allowedInitialsColors:fr,attributes:Ua,...$a}=e,Oa=or(),[Ha,V]=d.useState(!t),P=Ma({name:"Avatar",props:e,classes:W,className:c,style:i,classNames:s,styles:m,unstyled:n,attributes:Ua,vars:p,varsResolver:ur});return d.useEffect(()=>V(!t),[t]),o.jsx(Ta,{...P("root"),mod:[{"within-group":Oa.withinGroup},Fa],ref:a,...$a,children:Ha||!t?o.jsx("span",{...P("placeholder"),title:l,children:ka||typeof L=="string"&&pr(L)||o.jsx(nr,{})}):o.jsx("img",{...u,...P("image"),src:t,alt:l,onError:Ka=>{var q;V(!0),(q=u==null?void 0:u.onError)==null||q.call(u,Ka)}})})});j.classes=W;j.displayName="@mantine/core/Avatar";j.Group=B;var dr={root:"recursica-1ug8evi0",image:"recursica-1ug8evi1",placeholder:"recursica-1ug8evi2",icon:"recursica-1ug8evi3"};const N=d.forwardRef(({initials:r,variant:a="primary",size:e="default",src:s,alt:c,border:i=!1,...m},n)=>{const p=a!=="primary"&&a!=="ghost"?r:void 0;return o.jsx(j,{ref:n,size:e,src:a==="image"?s:void 0,alt:a==="image"?c:void 0,"data-variant":a,"data-border":i,"aria-label":p,classNames:dr,...m,children:a==="primary"||a==="ghost"?o.jsx(ar,{size:e==="small"?16:e==="large"?24:20,color:a==="primary"?"avatar/color/label-primary":"avatar/color/label-ghost",name:"user_outline"}):r})});N.displayName="Avatar";const M=sr(N);try{M.displayName="Avatar",M.__docgenInfo={description:"Avatar component for displaying user avatars with different variants",displayName:"Avatar",props:{initials:{defaultValue:null,description:"The initials to display (mandatory)",name:"initials",required:!0,type:{name:"string"}},variant:{defaultValue:{value:"primary"},description:"The variant of the avatar",name:"variant",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"primary"'},{value:'"ghost"'},{value:'"image"'}]}},size:{defaultValue:{value:"default"},description:"The size of the avatar",name:"size",required:!1,type:{name:"enum",value:[{value:"undefined"},{value:'"default"'},{value:'"large"'},{value:'"small"'}]}},src:{defaultValue:null,description:"The image source for image variant",name:"src",required:!1,type:{name:"string | undefined"}},alt:{defaultValue:null,description:"The alt text for image variant",name:"alt",required:!1,type:{name:"string | undefined"}},border:{defaultValue:{value:"false"},description:"Whether to show border style",name:"border",required:!1,type:{name:"boolean | undefined"}}}}}catch{}const Cr={title:"Avatar",component:N,parameters:{layout:"centered"},tags:["autodocs"],argTypes:{variant:{control:{type:"select"},options:["primary","ghost","image"]},size:{control:{type:"select"},options:["small","default","large"]},border:{control:{type:"boolean"}}}},g={args:{initials:"JD",variant:"primary",size:"default"}},h={args:{initials:"JD",variant:"primary",size:"small"}},f={args:{initials:"JD",variant:"primary",size:"large"}},v={args:{initials:"JD",variant:"primary",size:"default",border:!0}},y={args:{initials:"JD",variant:"primary",size:"default"}},D={args:{initials:"JD",variant:"primary",size:"default",border:!0}},J={args:{initials:"JD",variant:"ghost",size:"default"}},b={args:{initials:"JD",variant:"ghost",size:"small"}},z={args:{initials:"JD",variant:"ghost",size:"large"}},C={args:{initials:"JD",variant:"ghost",size:"default",border:!0}},S={args:{initials:"JD",variant:"ghost",size:"default"}},x={args:{initials:"JD",variant:"ghost",size:"default",border:!0}},I={args:{initials:"JD",variant:"image",src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",alt:"John Doe",size:"default"}},A={args:{initials:"JD",variant:"image",src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",alt:"John Doe",size:"small"}},w={args:{initials:"JD",variant:"image",src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",alt:"John Doe",size:"large"}},G={args:{initials:"JD",variant:"image",src:"https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",alt:"John Doe",size:"default",border:!0}},_={args:{initials:"JD",variant:"image",src:"https://invalid-url-that-will-fail.com/image.jpg",alt:"John Doe",size:"default"}};var T,Z,k;g.parameters={...g.parameters,docs:{...(T=g.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "primary",
    size: "default"
  }
}`,...(k=(Z=g.parameters)==null?void 0:Z.docs)==null?void 0:k.source}}};var F,U,$;h.parameters={...h.parameters,docs:{...(F=h.parameters)==null?void 0:F.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "primary",
    size: "small"
  }
}`,...($=(U=h.parameters)==null?void 0:U.docs)==null?void 0:$.source}}};var O,H,K;f.parameters={...f.parameters,docs:{...(O=f.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "primary",
    size: "large"
  }
}`,...(K=(H=f.parameters)==null?void 0:H.docs)==null?void 0:K.source}}};var Q,X,Y;v.parameters={...v.parameters,docs:{...(Q=v.parameters)==null?void 0:Q.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "primary",
    size: "default",
    border: true
  }
}`,...(Y=(X=v.parameters)==null?void 0:X.docs)==null?void 0:Y.source}}};var aa,ra,ea;y.parameters={...y.parameters,docs:{...(aa=y.parameters)==null?void 0:aa.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "primary",
    size: "default"
  }
}`,...(ea=(ra=y.parameters)==null?void 0:ra.docs)==null?void 0:ea.source}}};var sa,ta,oa;D.parameters={...D.parameters,docs:{...(sa=D.parameters)==null?void 0:sa.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "primary",
    size: "default",
    border: true
  }
}`,...(oa=(ta=D.parameters)==null?void 0:ta.docs)==null?void 0:oa.source}}};var ia,na,la;J.parameters={...J.parameters,docs:{...(ia=J.parameters)==null?void 0:ia.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "ghost",
    size: "default"
  }
}`,...(la=(na=J.parameters)==null?void 0:na.docs)==null?void 0:la.source}}};var ca,ma,pa;b.parameters={...b.parameters,docs:{...(ca=b.parameters)==null?void 0:ca.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "ghost",
    size: "small"
  }
}`,...(pa=(ma=b.parameters)==null?void 0:ma.docs)==null?void 0:pa.source}}};var ua,da,ga;z.parameters={...z.parameters,docs:{...(ua=z.parameters)==null?void 0:ua.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "ghost",
    size: "large"
  }
}`,...(ga=(da=z.parameters)==null?void 0:da.docs)==null?void 0:ga.source}}};var ha,fa,va;C.parameters={...C.parameters,docs:{...(ha=C.parameters)==null?void 0:ha.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "ghost",
    size: "default",
    border: true
  }
}`,...(va=(fa=C.parameters)==null?void 0:fa.docs)==null?void 0:va.source}}};var ya,Da,Ja;S.parameters={...S.parameters,docs:{...(ya=S.parameters)==null?void 0:ya.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "ghost",
    size: "default"
  }
}`,...(Ja=(Da=S.parameters)==null?void 0:Da.docs)==null?void 0:Ja.source}}};var ba,za,Ca;x.parameters={...x.parameters,docs:{...(ba=x.parameters)==null?void 0:ba.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "ghost",
    size: "default",
    border: true
  }
}`,...(Ca=(za=x.parameters)==null?void 0:za.docs)==null?void 0:Ca.source}}};var Sa,xa,Ia;I.parameters={...I.parameters,docs:{...(Sa=I.parameters)==null?void 0:Sa.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "image",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    size: "default"
  }
}`,...(Ia=(xa=I.parameters)==null?void 0:xa.docs)==null?void 0:Ia.source}}};var Aa,wa,Ga;A.parameters={...A.parameters,docs:{...(Aa=A.parameters)==null?void 0:Aa.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "image",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    size: "small"
  }
}`,...(Ga=(wa=A.parameters)==null?void 0:wa.docs)==null?void 0:Ga.source}}};var _a,Wa,ja;w.parameters={...w.parameters,docs:{...(_a=w.parameters)==null?void 0:_a.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "image",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    size: "large"
  }
}`,...(ja=(Wa=w.parameters)==null?void 0:Wa.docs)==null?void 0:ja.source}}};var Pa,Ba,Na;G.parameters={...G.parameters,docs:{...(Pa=G.parameters)==null?void 0:Pa.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "image",
    src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    alt: "John Doe",
    size: "default",
    border: true
  }
}`,...(Na=(Ba=G.parameters)==null?void 0:Ba.docs)==null?void 0:Na.source}}};var Ra,Ea,La;_.parameters={..._.parameters,docs:{...(Ra=_.parameters)==null?void 0:Ra.docs,source:{originalSource:`{
  args: {
    initials: "JD",
    variant: "image",
    src: "https://invalid-url-that-will-fail.com/image.jpg",
    alt: "John Doe",
    size: "default"
  }
}`,...(La=(Ea=_.parameters)==null?void 0:Ea.docs)==null?void 0:La.source}}};const Sr=["Primary","PrimarySmall","PrimaryLarge","PrimaryWithBorder","PrimaryWithIcon","PrimaryWithIconAndBorder","Ghost","GhostSmall","GhostLarge","GhostWithBorder","GhostWithIcon","GhostWithIconAndBorder","Image","ImageSmall","ImageLarge","ImageWithBorder","ImageWithFallback"];export{J as Ghost,z as GhostLarge,b as GhostSmall,C as GhostWithBorder,S as GhostWithIcon,x as GhostWithIconAndBorder,I as Image,w as ImageLarge,A as ImageSmall,G as ImageWithBorder,_ as ImageWithFallback,g as Primary,f as PrimaryLarge,h as PrimarySmall,v as PrimaryWithBorder,y as PrimaryWithIcon,D as PrimaryWithIconAndBorder,Sr as __namedExportsOrder,Cr as default};
