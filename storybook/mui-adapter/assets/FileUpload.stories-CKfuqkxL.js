import{r as c,j as a}from"./iframe-DYWv6D9f.js";import{F as p}from"./FileUpload-DNpaifKm.js";import{f as $}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./Button-Cbz_W6I7.js";import"./Loader-B04UuvAi.js";import"./Button-BmIlTF6T.js";import"./memoTheme-BSkcHbfI.js";import"./createSimplePaletteValueFilter-bm0fmN_7.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./ButtonBase-CYmuvHat.js";import"./useTimeout-CBIRdUMa.js";import"./useForkRef-DwiI9xvK.js";import"./useEventCallback-AL4LP9ud.js";import"./isFocusVisible-B8k4qzLc.js";import"./CircularProgress-DZVgjqKK.js";import"./Chip-DFDUSWn7.js";import"./Chip-DAuD5jMS.js";import"./createSvgIcon-BH5OdSyP.js";import"./useSlot-B9kPOFCr.js";import"./mergeSlotProps-12Ia89rE.js";import"./isHostComponent-DVu5iVWx.js";import"./FormControlWrapper-DB8zQIR2.js";import"./AssistiveElement-AR95nA1g.js";import"./useFormControl-C3p9w39B.js";import"./isMuiElement-A3-nll8A.js";function n(o,d=1024){return new File([new Uint8Array(d)],o)}const Le={title:"UI-Kit/FileUpload",component:p,tags:["autodocs"],parameters:{docs:{description:{component:`
The \`FileUpload\` component is a drag-and-drop dropzone with a native browse-button fallback, integrated directly into the \`FormControlWrapper\` architecture. Selected files render as a removable-chip list below the dropzone.

### Examples
\`\`\`tsx
<FileUpload
  label="Upload Files"
  assistiveText="Max file size 5MB"
  files={files}
  onFilesAdded={(added) =>
    setFiles((prev) => [...prev, ...added.map((file) => ({ file }))])
  }
  onFileRemove={(id) =>
    setFiles((prev) => prev.filter((item) => (item.id ?? item.file.name) !== id))
  }
/>
\`\`\`
`}}},argTypes:{...$,accept:{control:"text",description:"Native `accept` attribute for the file picker (e.g. `.pdf,.png`)."},multiple:{control:"boolean",description:"Whether multiple files can be selected/dropped at once."},maxSize:{control:"number",description:"Maximum size per file, in bytes."},maxFiles:{control:"number",description:"Maximum total number of files allowed."},readOnly:{control:"boolean",description:"Renders `files` as a static chip list with no remove icon, and hides the dropzone."},dropzoneLabel:{control:"text"},browseButtonLabel:{control:"text"},icon:{table:{disable:!0}},files:{table:{disable:!0}},onFilesAdded:{table:{disable:!0}},onFileRemove:{table:{disable:!0}},onFilesRejected:{table:{disable:!0}}}},f={args:{label:"Upload Files",assistiveText:"Max file size 5MB"},render:function({withLayer:d,layer:m,...r}){const[t,l]=c.useState([]);return a.jsx(p,{...r,files:t,onFilesAdded:i=>l(s=>[...s,...i.map(e=>({file:e}))]),onFileRemove:i=>l(s=>s.filter(e=>(e.id??e.file.name)!==i))})}},u={args:{label:"Upload Files",assistiveText:"Max file size 5MB"},render:function({withLayer:d,layer:m,...r}){const[t,l]=c.useState([{file:n("document.pdf")},{file:n("image.png")},{file:n("spreadsheet.xlsx")}]);return a.jsx(p,{...r,files:t,onFilesAdded:i=>l(s=>[...s,...i.map(e=>({file:e}))]),onFileRemove:i=>l(s=>s.filter(e=>(e.id??e.file.name)!==i))})}},F={args:{label:"Upload Files"}},y={args:{label:"Upload Files",disabled:!0},render:function({withLayer:d,layer:m,...r}){const[t]=c.useState([{file:n("document.pdf")}]);return a.jsx(p,{...r,files:t})}},g={args:{label:"Upload Files",error:"File upload failed. Please try again."}};function ee(){return a.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24",fill:"currentColor","aria-hidden":!0,children:a.jsx("path",{d:"M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8-6.2 3.8 1.6-7L2 9.2l7.1-.6z"})})}const v={args:{label:"Upload Files",icon:a.jsx(ee,{})},render:function({withLayer:d,layer:m,...r}){const[t,l]=c.useState([]);return a.jsx(p,{...r,files:t,onFilesAdded:i=>l(s=>[...s,...i.map(e=>({file:e}))]),onFileRemove:i=>l(s=>s.filter(e=>(e.id??e.file.name)!==i))})}},b={args:{label:"Upload Files"},render:function({withLayer:d,layer:m,...r}){const[t,l]=c.useState([{file:n("quarterly-financial-report-final-version-approved.pdf")},{file:n("2026-08-team-offsite-photos-and-notes.zip")},{file:n("resume.docx")}]);return a.jsx(p,{...r,files:t,onFilesAdded:i=>l(s=>[...s,...i.map(e=>({file:e}))]),onFileRemove:i=>l(s=>s.filter(e=>(e.id??e.file.name)!==i))})}},U={args:{label:"Upload Files",assistiveText:"Submitted files cannot be changed",readOnly:!0},render:function({withLayer:d,layer:m,...r}){const[t]=c.useState([{file:n("document.pdf")},{file:n("image.png")}]);return a.jsx(p,{...r,files:t})}},S={args:{label:"Upload Files",assistiveText:"Only .pdf and .png files are accepted",accept:".pdf,.png"},render:function({withLayer:d,layer:m,...r}){const[t,l]=c.useState([]);return a.jsx(p,{...r,files:t,onFilesAdded:i=>l(s=>[...s,...i.map(e=>({file:e}))]),onFileRemove:i=>l(s=>s.filter(e=>(e.id??e.file.name)!==i))})}},x={args:{label:"Upload Files",assistiveText:"Up to 2 files allowed",maxFiles:2},render:function({withLayer:d,layer:m,...r}){const[t,l]=c.useState([{file:n("document.pdf")},{file:n("image.png")}]);return a.jsx(p,{...r,files:t,onFilesAdded:i=>l(s=>[...s,...i.map(e=>({file:e}))]),onFileRemove:i=>l(s=>s.filter(e=>(e.id??e.file.name)!==i))})}};var h,w,R;f.parameters={...f.parameters,docs:{...(h=f.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Upload Files",
    assistiveText: "Max file size 5MB"
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return <FileUpload {...args} files={files} onFilesAdded={added => setFiles(prev => [...prev, ...added.map(file => ({
      file
    }))])} onFileRemove={id => setFiles(prev => prev.filter(item => (item.id ?? item.file.name) !== id))} />;
  }
}`,...(R=(w=f.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};var A,L,M;u.parameters={...u.parameters,docs:{...(A=u.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    label: "Upload Files",
    assistiveText: "Max file size 5MB"
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("document.pdf")
    }, {
      file: mockFile("image.png")
    }, {
      file: mockFile("spreadsheet.xlsx")
    }]);
    return <FileUpload {...args} files={files} onFilesAdded={added => setFiles(prev => [...prev, ...added.map(file => ({
      file
    }))])} onFileRemove={id => setFiles(prev => prev.filter(item => (item.id ?? item.file.name) !== id))} />;
  }
}`,...(M=(L=u.parameters)==null?void 0:L.docs)==null?void 0:M.source}}};var j,k,z;F.parameters={...F.parameters,docs:{...(j=F.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    label: "Upload Files"
  }
}`,...(z=(k=F.parameters)==null?void 0:k.docs)==null?void 0:z.source}}};var T,I,E;y.parameters={...y.parameters,docs:{...(T=y.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    label: "Upload Files",
    disabled: true
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("document.pdf")
    }]);
    return <FileUpload {...args} files={files} />;
  }
}`,...(E=(I=y.parameters)==null?void 0:I.docs)==null?void 0:E.source}}};var O,B,C;g.parameters={...g.parameters,docs:{...(O=g.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    label: "Upload Files",
    error: "File upload failed. Please try again."
  }
}`,...(C=(B=g.parameters)==null?void 0:B.docs)==null?void 0:C.source}}};var D,W,q;v.parameters={...v.parameters,docs:{...(D=v.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    label: "Upload Files",
    icon: <StarIcon />
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return <FileUpload {...args} files={files} onFilesAdded={added => setFiles(prev => [...prev, ...added.map(file => ({
      file
    }))])} onFileRemove={id => setFiles(prev => prev.filter(item => (item.id ?? item.file.name) !== id))} />;
  }
}`,...(q=(W=v.parameters)==null?void 0:W.docs)==null?void 0:q.source}}};var P,_,K;b.parameters={...b.parameters,docs:{...(P=b.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    label: "Upload Files"
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("quarterly-financial-report-final-version-approved.pdf")
    }, {
      file: mockFile("2026-08-team-offsite-photos-and-notes.zip")
    }, {
      file: mockFile("resume.docx")
    }]);
    return <FileUpload {...args} files={files} onFilesAdded={added => setFiles(prev => [...prev, ...added.map(file => ({
      file
    }))])} onFileRemove={id => setFiles(prev => prev.filter(item => (item.id ?? item.file.name) !== id))} />;
  }
}`,...(K=(_=b.parameters)==null?void 0:_.docs)==null?void 0:K.source}}};var N,G,H;U.parameters={...U.parameters,docs:{...(N=U.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    label: "Upload Files",
    assistiveText: "Submitted files cannot be changed",
    readOnly: true
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("document.pdf")
    }, {
      file: mockFile("image.png")
    }]);
    return <FileUpload {...args} files={files} />;
  }
}`,...(H=(G=U.parameters)==null?void 0:G.docs)==null?void 0:H.source}}};var J,Q,V;S.parameters={...S.parameters,docs:{...(J=S.parameters)==null?void 0:J.docs,source:{originalSource:`{
  args: {
    label: "Upload Files",
    assistiveText: "Only .pdf and .png files are accepted",
    accept: ".pdf,.png"
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return <FileUpload {...args} files={files} onFilesAdded={added => setFiles(prev => [...prev, ...added.map(file => ({
      file
    }))])} onFileRemove={id => setFiles(prev => prev.filter(item => (item.id ?? item.file.name) !== id))} />;
  }
}`,...(V=(Q=S.parameters)==null?void 0:Q.docs)==null?void 0:V.source}}};var X,Y,Z;x.parameters={...x.parameters,docs:{...(X=x.parameters)==null?void 0:X.docs,source:{originalSource:`{
  args: {
    label: "Upload Files",
    assistiveText: "Up to 2 files allowed",
    maxFiles: 2
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileUploadStory({
    withLayer,
    layer,
    ...args
  }: FileUploadStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("document.pdf")
    }, {
      file: mockFile("image.png")
    }]);
    return <FileUpload {...args} files={files} onFilesAdded={added => setFiles(prev => [...prev, ...added.map(file => ({
      file
    }))])} onFileRemove={id => setFiles(prev => prev.filter(item => (item.id ?? item.file.name) !== id))} />;
  }
}`,...(Z=(Y=x.parameters)==null?void 0:Y.docs)==null?void 0:Z.source}}};const Me=["Default","WithFiles","EmptyState","Disabled","ErrorState","CustomIcon","LongFilenames","ReadOnly","AcceptRestriction","MaxFilesRestriction"];export{S as AcceptRestriction,v as CustomIcon,f as Default,y as Disabled,F as EmptyState,g as ErrorState,b as LongFilenames,x as MaxFilesRestriction,U as ReadOnly,u as WithFiles,Me as __namedExportsOrder,Le as default};
