import{j as e}from"./iframe-DahVp6_-.js";import{T as t}from"./Timeline-BBuyXonO.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-aDX96fpj.js";import"./factory-D_NNwu8P.js";import"./create-safe-context-D6805Q9h.js";import"./get-auto-contrast-value-Da6zqqWm.js";const v={title:"UI-Kit/Timeline",component:t,tags:["autodocs"],argTypes:{defaultChecked:{table:{disable:!0}}}},r={args:{active:1},render:a=>e.jsxs(t,{...a,children:[e.jsx(t.Item,{title:"Commit created",timestamp:"Yesterday",bulletVariant:"default",children:"You pushed 3 new commits to the repository."}),e.jsx(t.Item,{title:"Pull request opened",timestamp:"2 days ago",bulletVariant:"default",children:"You opened a pull request for the feature branch."}),e.jsx(t.Item,{title:"Code review completed",timestamp:"1 week ago",bulletVariant:"default",children:"Your pull request was approved by 2 reviewers."}),e.jsx(t.Item,{title:"Branch merged",timestamp:"2 weeks ago",bulletVariant:"default",children:"Your feature branch was successfully merged into main."})]})},i={args:{active:1},render:a=>e.jsxs(t,{...a,children:[e.jsx(t.Item,{title:"Default Bullet",timestamp:"Standard configuration",bulletVariant:"default",children:"The default un-configured structural dot."}),e.jsx(t.Item,{title:"Icon Bullet",timestamp:"Standard sized icons",bulletVariant:"icon",bullet:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("polyline",{points:"20 6 9 17 4 12"})}),children:"A standard structural icon node mapping."}),e.jsx(t.Item,{title:"Alternative Icon",timestamp:"Larger structural bounds",bulletVariant:"icon-alternative",bullet:e.jsx("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("rect",{x:"3",y:"3",width:"18",height:"18",rx:"2",ry:"2"})}),children:"A slightly larger alternative bounding box for specialized icons."}),e.jsx(t.Item,{title:"Avatar Bullet",timestamp:"Profile pictures",bulletVariant:"avatar",bullet:e.jsx("img",{src:"https://avatars.githubusercontent.com/u/10353856?s=460&v=4",alt:"avatar",style:{width:"100%",height:"100%",objectFit:"cover",borderRadius:"inherit"}}),children:"Avatar mappings inherently drop borders and leverage specific opacity states."})]})};var n,l,s;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    active: 1
  },
  render: args => <Timeline {...args}>
      <Timeline.Item title="Commit created" timestamp="Yesterday" bulletVariant="default">
        You pushed 3 new commits to the repository.
      </Timeline.Item>
      <Timeline.Item title="Pull request opened" timestamp="2 days ago" bulletVariant="default">
        You opened a pull request for the feature branch.
      </Timeline.Item>
      <Timeline.Item title="Code review completed" timestamp="1 week ago" bulletVariant="default">
        Your pull request was approved by 2 reviewers.
      </Timeline.Item>
      <Timeline.Item title="Branch merged" timestamp="2 weeks ago" bulletVariant="default">
        Your feature branch was successfully merged into main.
      </Timeline.Item>
    </Timeline>
}`,...(s=(l=r.parameters)==null?void 0:l.docs)==null?void 0:s.source}}};var o,u,m;i.parameters={...i.parameters,docs:{...(o=i.parameters)==null?void 0:o.docs,source:{originalSource:`{
  args: {
    active: 1
  },
  render: args => <Timeline {...args}>
      <Timeline.Item title="Default Bullet" timestamp="Standard configuration" bulletVariant="default">
        The default un-configured structural dot.
      </Timeline.Item>
      <Timeline.Item title="Icon Bullet" timestamp="Standard sized icons" bulletVariant="icon" bullet={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>}>
        A standard structural icon node mapping.
      </Timeline.Item>
      <Timeline.Item title="Alternative Icon" timestamp="Larger structural bounds" bulletVariant="icon-alternative" bullet={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>}>
        A slightly larger alternative bounding box for specialized icons.
      </Timeline.Item>
      <Timeline.Item title="Avatar Bullet" timestamp="Profile pictures" bulletVariant="avatar" bullet={<img src="https://avatars.githubusercontent.com/u/10353856?s=460&v=4" alt="avatar" style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "inherit"
    }} />}>
        Avatar mappings inherently drop borders and leverage specific opacity
        states.
      </Timeline.Item>
    </Timeline>
}`,...(m=(u=i.parameters)==null?void 0:u.docs)==null?void 0:m.source}}};const x=["Default","BulletVariants"];export{i as BulletVariants,r as Default,x as __namedExportsOrder,v as default};
