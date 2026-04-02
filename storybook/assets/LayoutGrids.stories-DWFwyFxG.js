import{j as p,G as _}from"./iframe-B1nsR4E1.js";import"./preload-helper-Dp1pzeXC.js";const y=/^\{([^}]+)\}$/;function v(s,n){const e=n.split(".");let t=s;for(const l of e){if(t==null||typeof t!="object")return;t=t[l]}return t}function P(s,n,e=0){if(e>5)return s;const t=s.trim().match(y);if(!t)return s;const l=t[1];let o=v(n,l);if(o==null){const a=l.replace(/\.size\./,".sizes.");o=v(n,a)}if(o!=null&&typeof o=="object"&&"$value"in o){const a=o.$value;if(typeof a=="string"&&y.test(a))return P(a,n,e+1)}return o}function j(s){if(s==null||typeof s!="object")return null;const e=s.$value;if(e!=null&&typeof e=="object"&&"value"in e&&"unit"in e){const t=e;if(t.unit==="px")return t.value}return typeof e=="number"?e:null}function R(s,n){const e=s.brand["layout-grids"];return Object.entries(e).filter(([t])=>!t.startsWith("$")).filter(([,t])=>t&&typeof t=="object").map(([t,l])=>{const o=l["max-width"],a=(o==null?void 0:o.$value)!=null&&typeof o.$value=="number"?o.$value:800,i=l.columns,m=(i==null?void 0:i.$value)!=null&&typeof i.$value=="number"?i.$value:6;let d=16;const u=l.gutter,c=u==null?void 0:u.$value;if(typeof c=="string"&&y.test(c)){const x=P(c,n),r=j(x);r!=null&&(d=r)}return{name:t,maxWidthPx:a,columns:m,gutterPx:d}})}function k(s){const n=s.find(r=>r.name==="desktop"),e=s.find(r=>r.name==="tablet"),t=s.find(r=>r.name==="mobile"),l=(n==null?void 0:n.maxWidthPx)??1280,o=(e==null?void 0:e.maxWidthPx)??810,a=(t==null?void 0:t.maxWidthPx)??480,i=(n==null?void 0:n.columns)??6,m=(n==null?void 0:n.gutterPx)??16,d=(e==null?void 0:e.columns)??6,u=(e==null?void 0:e.gutterPx)??16,c=(t==null?void 0:t.columns)??4,x=(t==null?void 0:t.gutterPx)??16;return`
    .layout-grids-responsive-demo {
      display: grid;
      grid-template-columns: repeat(var(--layout-cols), 1fr);
      gap: var(--layout-gutter);
      max-width: var(--layout-max-width);
      margin: 0 auto;
    }
    /* Mobile: default (< 810px) */
    .layout-grids-responsive-demo {
      --layout-cols: ${c};
      --layout-gutter: ${x}px;
      --layout-max-width: ${a}px;
    }
    /* Tablet: 810px to < 1280px */
    @media (min-width: ${o}px) and (max-width: ${l-1}px) {
      .layout-grids-responsive-demo {
        --layout-cols: ${d};
        --layout-gutter: ${u}px;
        --layout-max-width: ${o}px;
      }
    }
    /* Desktop: 1280px and above */
    @media (min-width: ${l}px) {
      .layout-grids-responsive-demo {
        --layout-cols: ${i};
        --layout-gutter: ${m}px;
        --layout-max-width: ${l}px;
      }
    }
  `}function w(){const{brandJson:s,tokensJson:n}=_(),e={...n,brand:s==null?void 0:s.brand},t=R(s,e),l=t.find(r=>r.name==="desktop"),o=t.find(r=>r.name==="tablet"),a=t.find(r=>r.name==="mobile"),i=(l==null?void 0:l.maxWidthPx)??1280,m=(o==null?void 0:o.maxWidthPx)??810,d=(l==null?void 0:l.columns)??6,u=(o==null?void 0:o.columns)??6,c=(a==null?void 0:a.columns)??4,x=Math.max(d*2,u*2,c*2);return p.jsxs("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",display:"flex",flexDirection:"column",gap:24},children:[p.jsx("style",{dangerouslySetInnerHTML:{__html:k(t)}}),p.jsxs("p",{style:{margin:0,fontSize:14,color:"#666"},children:["One responsive grid: desktop ≥",i,"px (",d," ","cols), tablet ",m,"–",i-1,"px (",u," cols), mobile <",m,"px (",c," cols). Resize the viewport to see the grid change."]}),p.jsx("div",{className:"layout-grids-responsive-demo",children:Array.from({length:x},(r,g)=>p.jsx("div",{style:{minHeight:48,backgroundColor:"rgba(0,0,0,0.08)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#666"},children:g+1},g))})]})}const N={title:"Theme/Layout Grids",parameters:{layout:"padded"},tags:["autodocs"]},f={render:()=>p.jsx(w,{})};var h,b,$;f.parameters={...f.parameters,docs:{...(h=f.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <LayoutGridsStory />
}`,...($=(b=f.parameters)==null?void 0:b.docs)==null?void 0:$.source}}};const W=["Default"];export{f as Default,W as __namedExportsOrder,N as default};
