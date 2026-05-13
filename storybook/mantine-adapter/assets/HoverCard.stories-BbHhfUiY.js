import{r as h,j as o,f as O}from"./iframe-BddUskqo.js";import{u as x}from"./factory-CvawFnU2.js";import{P as C}from"./Popover-D1vT6S9B.js";import{c as ee}from"./create-safe-context-CaDDsYik.js";import{c as f}from"./create-event-handler-C3eq9ghx.js";import{F as oe,g as re,u as ne,e as te,j as ae,k as se,m as ie,n as de}from"./OptionalPortal-DnSnYc9F.js";import{u as pe}from"./use-id-BZWRHC0D.js";import{B as T}from"./Button-CEa3jSjb.js";import{T as D}from"./Text-DixFJgzJ.js";import{G as le}from"./Group-D3t2UoDm.js";import{S as ce}from"./Stack-h-TWIS18.js";import{A as ue}from"./Avatar-aLlN3Vag.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-D6NM-3-T.js";import"./use-resolved-styles-api--I-5TNCE.js";import"./DirectionProvider-DjTUUivo.js";import"./get-floating-position-C1INe6H3.js";import"./FocusTrap-DLA-lvPr.js";import"./use-reduced-motion-D8B25LG2.js";import"./polymorphic-factory-htL0-wIS.js";import"./use-merged-ref-Cl8K9XVP.js";import"./Transition-vit5SB2P.js";import"./index-BBeRe09c.js";import"./index-BTPdDwiY.js";import"./use-uncontrolled-CF5v_IMa.js";import"./is-element-ClLpo7Gl.js";import"./Loader-Cr3KaCVt.js";import"./UnstyledButton-Cpkh_G9M.js";import"./Text-CkYKvh3X.js";import"./Group-DDKVGcYi.js";const[me,W]=ee("HoverCard component was not found in the tree"),I=h.createContext(!1),he=I.Provider,P=()=>h.useContext(I);function $(e){const{children:n,onMouseEnter:t,onMouseLeave:d,...a}=x("HoverCardDropdown",null,e),r=W();if(P()&&r.getFloatingProps&&r.floating){const l=r.getFloatingProps();return o.jsx(C.Dropdown,{ref:r.floating,...l,onMouseEnter:f(t,l.onMouseEnter),onMouseLeave:f(d,l.onMouseLeave),...a,children:n})}const i=f(t,r.openDropdown),p=f(d,r.closeDropdown);return o.jsx(C.Dropdown,{onMouseEnter:i,onMouseLeave:p,...a,children:n})}$.displayName="@mantine/core/HoverCardDropdown";const ve={openDelay:0,closeDelay:0};function b(e){const{openDelay:n,closeDelay:t,children:d}=x("HoverCardGroup",ve,e);return o.jsx(he,{value:!0,children:o.jsx(oe,{delay:{open:n,close:t},children:d})})}b.displayName="@mantine/core/HoverCardGroup";b.extend=e=>e;const fe={refProp:"ref"},U=h.forwardRef((e,n)=>{const{children:t,refProp:d,eventPropsWrapperName:a,...r}=x("HoverCardTarget",fe,e),s=re(t);if(!s)throw new Error("HoverCard.Target component children should be an element or a component that accepts ref. Fragments, strings, numbers and other primitive values are not supported");const i=W();if(P()&&i.getReferenceProps&&i.reference){const w=i.getReferenceProps();return o.jsx(C.Target,{refProp:d,ref:n,...r,children:h.cloneElement(s,a?{[a]:{...w,ref:i.reference}}:{...w,ref:i.reference})})}const l=f(s.props.onMouseEnter,i.openDropdown),m=f(s.props.onMouseLeave,i.closeDropdown),c={onMouseEnter:l,onMouseLeave:m};return o.jsx(C.Target,{refProp:d,ref:n,...r,children:h.cloneElement(s,a?{[a]:c}:c)})});U.displayName="@mantine/core/HoverCardTarget";function we(e){const[n,t]=h.useState(e.defaultOpened),a=typeof e.opened=="boolean"?e.opened:n,r=P(),s=pe(),i=h.useRef(-1),p=h.useRef(-1),l=h.useCallback(()=>{window.clearTimeout(i.current),window.clearTimeout(p.current)},[]),m=h.useCallback(j=>{var _,k;t(j),j?(V(s),(_=e.onOpen)==null||_.call(e)):(k=e.onClose)==null||k.call(e)},[s,e.onOpen,e.onClose]),{context:c,refs:w}=ne({open:a,onOpenChange:m}),{delay:K,setCurrentId:V}=te(c,{id:s}),{getReferenceProps:Q,getFloatingProps:X}=ae([se(c,{enabled:!0,delay:r?K:{open:e.openDelay,close:e.closeDelay}}),ie(c,{role:"dialog"}),de(c,{enabled:r})]),Y=h.useCallback(()=>{r||(l(),e.openDelay===0||e.openDelay===void 0?m(!0):i.current=window.setTimeout(()=>m(!0),e.openDelay))},[r,l,e.openDelay,m]),Z=h.useCallback(()=>{r||(l(),e.closeDelay===0||e.closeDelay===void 0?m(!1):p.current=window.setTimeout(()=>m(!1),e.closeDelay))},[r,l,e.closeDelay,m]);return h.useEffect(()=>()=>l(),[l]),{opened:a,reference:w.setReference,floating:w.setFloating,getReferenceProps:Q,getFloatingProps:X,openDropdown:Y,closeDropdown:Z}}const Ce={openDelay:0,closeDelay:150,initiallyOpened:!1};function v(e){const{children:n,onOpen:t,onClose:d,openDelay:a,closeDelay:r,initiallyOpened:s,...i}=x("HoverCard",Ce,e),p=we({openDelay:a,closeDelay:r,defaultOpened:s,onOpen:t,onClose:d});return o.jsx(me,{value:{openDropdown:p.openDropdown,closeDropdown:p.closeDropdown,getReferenceProps:p.getReferenceProps,getFloatingProps:p.getFloatingProps,reference:p.reference,floating:p.floating},children:o.jsx(C,{...i,opened:p.opened,__staticSelector:"HoverCard",children:n})})}v.displayName="@mantine/core/HoverCard";v.Target=U;v.Dropdown=$;v.Group=b;v.extend=e=>e;const ge="HoverCard-module__dropdown___FBPFW",ye="HoverCard-module__arrow___S9AkE",B={dropdown:ge,arrow:ye},q=function({overStyled:n=!1,withBeak:t=!0,...d}){const a=O(d,n),r={dropdown:B.dropdown,arrow:B.arrow},s=a.classNames;if(s&&typeof s=="object"&&!Array.isArray(s)){const m=s;Object.keys(m).forEach(c=>{r[c]?r[c]=`${r[c]} ${m[c]}`:r[c]=m[c]})}const i=a.arrowSize??16,p=a.withArrow,l=t??p;return o.jsx(v,{position:"top",arrowSize:i,withArrow:l,classNames:r,...a})};q.displayName="HoverCard";const z=function(n){return o.jsx(v.Target,{...n})};z.displayName="HoverCardTarget";const J=function({overStyled:n=!1,...t}){const d=O(t,n),a=d.className;return o.jsx(v.Dropdown,{className:a,...d})};J.displayName="HoverCardDropdown";const u=q;u.Target=z;u.Dropdown=J;try{u.displayName="HoverCard",u.__docgenInfo={description:"",displayName:"HoverCard",filePath:"/home/runner/work/recursica/recursica/packages/mantine-adapter/src/components/HoverCard/HoverCard.tsx",methods:[],props:{disabled:{defaultValue:null,declarations:[{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"},{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"}],description:"If set, popover dropdown will not be rendered",name:"disabled",parent:{fileName:"recursica/node_modules/@mantine/core/lib/components/Popover/Popover.d.ts",name:"__PopoverProps"},required:!1,tags:{},type:{name:"boolean | undefined"}},withBeak:{defaultValue:{value:"true"},declarations:[{fileName:"mantine-adapter/src/components/HoverCard/HoverCard.tsx",name:"RecursicaHoverCardProps"},{fileName:"mantine-adapter/src/components/HoverCard/HoverCard.tsx",name:"RecursicaHoverCardProps"}],description:"Whether to display a beak (arrow) pointing from the dropdown to the target.\nThis is the Recursica equivalent of Mantine's `withArrow`.\nWhen both `withBeak` and `withArrow` are provided, `withBeak` takes precedence.",name:"withBeak",parent:{fileName:"mantine-adapter/src/components/HoverCard/HoverCard.tsx",name:"RecursicaHoverCardProps"},required:!1,tags:{},type:{name:"boolean | undefined"}}},tags:{}}}catch{}const Xe={title:"UI-Kit/HoverCard",component:u,tags:["autodocs"],argTypes:{position:{control:"select",options:["bottom","bottom-start","bottom-end","top","top-start","top-end","left","left-start","left-end","right","right-start","right-end"],description:"The position of the dropdown relative to the target."},withBeak:{control:"boolean",description:"Whether to display a beak (arrow) pointing to the target. Recursica equivalent of Mantine's withArrow."},offset:{control:"number",description:"Distance in px between the dropdown and the target element."},openDelay:{control:"number",description:"Delay in ms before the dropdown opens on hover."},closeDelay:{control:"number",description:"Delay in ms before the dropdown closes when hover ends."},disabled:{control:"boolean",description:"If set, the hover card dropdown will not be rendered."}},parameters:{layout:"centered",docs:{description:{component:"\nThe `HoverCard` component displays a popover-style dropdown when the user hovers over a target element. It wraps Mantine's composable `HoverCard` while enforcing strict Recursica design token styling.\n\n### Composable API\n\nHoverCard uses a dot-notation composition pattern:\n- `<HoverCard>` — Root container managing open/close state on hover\n- `<HoverCard.Target>` — Wrapper for the trigger element (must be a single element supporting ref)\n- `<HoverCard.Dropdown>` — The popup panel displaying content on hover\n\n### Key Behaviors\n- The dropdown opens when the user hovers over the target and closes when they move away\n- `openDelay` and `closeDelay` control the timing of open/close transitions\n- The dropdown stays open while the user hovers over it, allowing interaction with its content\n        "}}}},g={args:{position:"top",withBeak:!0,offset:5,openDelay:0,closeDelay:150},render:({withLayer:e,layer:n,...t})=>o.jsxs(u,{...t,children:[o.jsx(u.Target,{children:o.jsx(T,{variant:"solid",children:"Hover me"})}),o.jsx(u.Dropdown,{children:o.jsx(D,{children:"This is a hover card with informational content that appears when you hover over the target element."})})]})},y={args:{position:"top",withBeak:!1,offset:5},render:({withLayer:e,layer:n,...t})=>o.jsxs(u,{...t,children:[o.jsx(u.Target,{children:o.jsx(T,{variant:"outline",children:"Without Beak"})}),o.jsx(u.Dropdown,{children:o.jsx(D,{children:"This hover card has the beak disabled, showing a clean dropdown without the pointing indicator."})})]})},H={args:{position:"top",offset:5},render:({withLayer:e,layer:n,...t})=>o.jsxs(u,{...t,children:[o.jsx(u.Target,{children:o.jsx(T,{variant:"solid",children:"User Profile"})}),o.jsx(u.Dropdown,{children:o.jsxs(le,{children:[o.jsx(ue,{src:null,alt:"User avatar"}),o.jsxs(ce,{children:[o.jsx(D,{children:"Jane Doe"}),o.jsx(D,{children:"Software Engineer at Recursica"})]})]})})]})};var N,R,E;g.parameters={...g.parameters,docs:{...(N=g.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    position: "top",
    withBeak: true,
    offset: 5,
    openDelay: 0,
    closeDelay: 150
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: HoverCardStoryArgs) => {
    return <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="solid">Hover me</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Text>
            This is a hover card with informational content that appears when
            you hover over the target element.
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>;
  }
}`,...(E=(R=g.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};var S,G,A;y.parameters={...y.parameters,docs:{...(S=y.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    position: "top",
    withBeak: false,
    offset: 5
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: HoverCardStoryArgs) => {
    return <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="outline">Without Beak</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Text>
            This hover card has the beak disabled, showing a clean dropdown
            without the pointing indicator.
          </Text>
        </HoverCard.Dropdown>
      </HoverCard>;
  }
}`,...(A=(G=y.parameters)==null?void 0:G.docs)==null?void 0:A.source}}};var M,L,F;H.parameters={...H.parameters,docs:{...(M=H.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    position: "top",
    offset: 5
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: ({
    withLayer,
    layer,
    ...args
  }: HoverCardStoryArgs) => {
    return <HoverCard {...args}>
        <HoverCard.Target>
          <Button variant="solid">User Profile</Button>
        </HoverCard.Target>

        <HoverCard.Dropdown>
          <Group>
            <Avatar src={null} alt="User avatar" />
            <Stack>
              <Text>Jane Doe</Text>
              <Text>Software Engineer at Recursica</Text>
            </Stack>
          </Group>
        </HoverCard.Dropdown>
      </HoverCard>;
  }
}`,...(F=(L=H.parameters)==null?void 0:L.docs)==null?void 0:F.source}}};const Ye=["Default","WithoutBeak","RichContent"];export{g as Default,H as RichContent,y as WithoutBeak,Ye as __namedExportsOrder,Xe as default};
