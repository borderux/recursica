import{r as p,j as u}from"./iframe-kleCLvyU.js";import{F as d}from"./FileInput-DKU-avge.js";import{f as V}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-Dp1pzeXC.js";import"./Button-B0qUXOkB.js";import"./Loader-Be_gz4ql.js";import"./Loader-CyNKah3X.js";import"./get-size-D1xvcvcL.js";import"./factory-SJRKBzbr.js";import"./polymorphic-factory-BIatzRDB.js";import"./Transition-DJAhCNcs.js";import"./index-39xnBBca.js";import"./index-a2muMmct.js";import"./use-reduced-motion-vZ9Fuvhv.js";import"./UnstyledButton-lWoC7Bjb.js";import"./Chip-BwaiKs2w.js";import"./CheckIcon-DNE1jt0s.js";import"./create-optional-context-B6vzNrwk.js";import"./use-uncontrolled-8yj8lwKw.js";import"./use-id-CFfH4I3G.js";import"./FormControlWrapper-bcZ_v1j9.js";import"./use-resolved-styles-api-BqM1QCmQ.js";import"./CloseButton-B9-YsQWF.js";import"./AssistiveElement-DTMM763c.js";function o(r,l=1024){return new File([new Uint8Array(l)],r)}const ve={title:"UI-Kit/FileInput",component:d,tags:["autodocs"],parameters:{docs:{description:{component:'\nThe `FileInput` component is a single-line, `TextField`-shaped control for choosing files, integrated directly into the `FormControlWrapper` architecture. It shares `FileUpload`\'s selection/validation interface (`accept`/`maxSize`/`maxFiles`, `readOnly`) behind a different presentation — every selected file renders as a removable chip in a horizontally scrollable row, and a trailing `Button` clears the current selection.\n\n### Examples\n```tsx\n<FileInput\n  label="Resume"\n  files={files}\n  onFilesAdded={(added) => setFiles(added.map((file) => ({ file })))}\n  onFileRemove={() => setFiles([])}\n/>\n```\n'}}},argTypes:{...V,accept:{control:"text",description:"Native `accept` attribute for the file picker (e.g. `.pdf,.png`)."},multiple:{control:"boolean",description:"Whether more than one file can be selected/dropped at once. Defaults to `false`."},maxSize:{control:"number",description:"Maximum size per file, in bytes."},maxFiles:{control:"number",description:"Maximum total number of files allowed. Only meaningful when `multiple` is `true`."},readOnly:{control:"boolean",description:"Renders `files` as a static, non-interactive display with no clear/remove icons."},placeholder:{control:"text"},icon:{table:{disable:!0}},files:{table:{disable:!0}},onFilesAdded:{table:{disable:!0}},onFileRemove:{table:{disable:!0}},onFilesRejected:{table:{disable:!0}}}},m={args:{label:"Resume"},render:function({withLayer:l,layer:c,...t}){const[s,e]=p.useState([]);return u.jsx(d,{...t,files:s,onFilesAdded:n=>e(n.map(i=>({file:i}))),onFileRemove:()=>e([])})}},f={args:{label:"Resume"},render:function({withLayer:l,layer:c,...t}){const[s,e]=p.useState([{file:o("resume.pdf")}]);return u.jsx(d,{...t,files:s,onFilesAdded:n=>e(n.map(i=>({file:i}))),onFileRemove:()=>e([])})}},F={args:{label:"Attachments",assistiveText:"Up to 5 files",multiple:!0},render:function({withLayer:l,layer:c,...t}){const[s,e]=p.useState([{file:o("document.pdf")},{file:o("image.png")},{file:o("spreadsheet.xlsx")}]);return u.jsx(d,{...t,files:s,onFilesAdded:n=>e(i=>[...i,...n.map(a=>({file:a}))]),onFileRemove:n=>e(i=>i.filter(a=>(a.id??a.file.name)!==n))})}},y={args:{label:"Resume",assistiveText:"PDF or Word document",formLayout:"side-by-side"},render:function({withLayer:l,layer:c,...t}){const[s,e]=p.useState([]);return u.jsx(d,{...t,files:s,onFilesAdded:n=>e(n.map(i=>({file:i}))),onFileRemove:()=>e([])})}},g={args:{label:"Resume",disabled:!0},render:function({withLayer:l,layer:c,...t}){const[s]=p.useState([{file:o("resume.pdf")}]);return u.jsx(d,{...t,files:s})}},b={args:{label:"Resume",error:"A file is required."}},S={args:{label:"Attachments",assistiveText:"Submitted files cannot be changed",multiple:!0,readOnly:!0},render:function({withLayer:l,layer:c,...t}){const[s]=p.useState([{file:o("document.pdf")},{file:o("image.png")}]);return u.jsx(d,{...t,files:s})}},v={args:{label:"Resume",assistiveText:"Only .pdf files are accepted",accept:".pdf"},render:function({withLayer:l,layer:c,...t}){const[s,e]=p.useState([]);return u.jsx(d,{...t,files:s,onFilesAdded:n=>e(n.map(i=>({file:i}))),onFileRemove:()=>e([])})}},I={args:{label:"Attachments",assistiveText:"Up to 2 files allowed",multiple:!0,maxFiles:2},render:function({withLayer:l,layer:c,...t}){const[s,e]=p.useState([{file:o("document.pdf")},{file:o("image.png")}]);return u.jsx(d,{...t,files:s,onFilesAdded:n=>e(i=>[...i,...n.map(a=>({file:a}))]),onFileRemove:n=>e(i=>i.filter(a=>(a.id??a.file.name)!==n))})}};var h,R,x;m.parameters={...m.parameters,docs:{...(h=m.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    label: "Resume"
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return <FileInput {...args} files={files} onFilesAdded={added => setFiles(added.map(file => ({
      file
    })))} onFileRemove={() => setFiles([])} />;
  }
}`,...(x=(R=m.parameters)==null?void 0:R.docs)==null?void 0:x.source}}};var A,w,L;f.parameters={...f.parameters,docs:{...(A=f.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    label: "Resume"
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("resume.pdf")
    }]);
    return <FileInput {...args} files={files} onFilesAdded={added => setFiles(added.map(file => ({
      file
    })))} onFileRemove={() => setFiles([])} />;
  }
}`,...(L=(w=f.parameters)==null?void 0:w.docs)==null?void 0:L.source}}};var U,T,j;F.parameters={...F.parameters,docs:{...(U=F.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    label: "Attachments",
    assistiveText: "Up to 5 files",
    multiple: true
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("document.pdf")
    }, {
      file: mockFile("image.png")
    }, {
      file: mockFile("spreadsheet.xlsx")
    }]);
    return <FileInput {...args} files={files} onFilesAdded={added => setFiles(prev => [...prev, ...added.map(file => ({
      file
    }))])} onFileRemove={id => setFiles(prev => prev.filter(item => (item.id ?? item.file.name) !== id))} />;
  }
}`,...(j=(T=F.parameters)==null?void 0:T.docs)==null?void 0:j.source}}};var k,O,D;y.parameters={...y.parameters,docs:{...(k=y.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    label: "Resume",
    assistiveText: "PDF or Word document",
    formLayout: "side-by-side"
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return <FileInput {...args} files={files} onFilesAdded={added => setFiles(added.map(file => ({
      file
    })))} onFileRemove={() => setFiles([])} />;
  }
}`,...(D=(O=y.parameters)==null?void 0:O.docs)==null?void 0:D.source}}};var E,M,W;g.parameters={...g.parameters,docs:{...(E=g.parameters)==null?void 0:E.docs,source:{originalSource:`{
  args: {
    label: "Resume",
    disabled: true
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("resume.pdf")
    }]);
    return <FileInput {...args} files={files} />;
  }
}`,...(W=(M=g.parameters)==null?void 0:M.docs)==null?void 0:W.source}}};var z,B,q;b.parameters={...b.parameters,docs:{...(z=b.parameters)==null?void 0:z.docs,source:{originalSource:`{
  args: {
    label: "Resume",
    error: "A file is required."
  }
}`,...(q=(B=b.parameters)==null?void 0:B.docs)==null?void 0:q.source}}};var C,P,_;S.parameters={...S.parameters,docs:{...(C=S.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    label: "Attachments",
    assistiveText: "Submitted files cannot be changed",
    multiple: true,
    readOnly: true
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("document.pdf")
    }, {
      file: mockFile("image.png")
    }]);
    return <FileInput {...args} files={files} />;
  }
}`,...(_=(P=S.parameters)==null?void 0:P.docs)==null?void 0:_.source}}};var K,N,G;v.parameters={...v.parameters,docs:{...(K=v.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    label: "Resume",
    assistiveText: "Only .pdf files are accepted",
    accept: ".pdf"
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([]);
    return <FileInput {...args} files={files} onFilesAdded={added => setFiles(added.map(file => ({
      file
    })))} onFileRemove={() => setFiles([])} />;
  }
}`,...(G=(N=v.parameters)==null?void 0:N.docs)==null?void 0:G.source}}};var H,J,Q;I.parameters={...I.parameters,docs:{...(H=I.parameters)==null?void 0:H.docs,source:{originalSource:`{
  args: {
    label: "Attachments",
    assistiveText: "Up to 2 files allowed",
    multiple: true,
    maxFiles: 2
  },
  /* eslint-disable @typescript-eslint/no-unused-vars */
  render: function FileInputStory({
    withLayer,
    layer,
    ...args
  }: FileInputStoryArgs) {
    /* eslint-enable @typescript-eslint/no-unused-vars */
    const [files, setFiles] = useState<RecursicaFileUploadItem[]>([{
      file: mockFile("document.pdf")
    }, {
      file: mockFile("image.png")
    }]);
    return <FileInput {...args} files={files} onFilesAdded={added => setFiles(prev => [...prev, ...added.map(file => ({
      file
    }))])} onFileRemove={id => setFiles(prev => prev.filter(item => (item.id ?? item.file.name) !== id))} />;
  }
}`,...(Q=(J=I.parameters)==null?void 0:J.docs)==null?void 0:Q.source}}};const Ie=["Default","WithFile","MultipleFiles","SideBySide","Disabled","ErrorState","ReadOnly","AcceptRestriction","MaxFilesRestriction"];export{v as AcceptRestriction,m as Default,g as Disabled,b as ErrorState,I as MaxFilesRestriction,F as MultipleFiles,S as ReadOnly,y as SideBySide,f as WithFile,Ie as __namedExportsOrder,ve as default};
