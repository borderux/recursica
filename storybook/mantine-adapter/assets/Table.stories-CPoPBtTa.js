import{j as n}from"./iframe-C3SWO55l.js";import{T as e}from"./Table-Rvhb9Fvw.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-Ducn9enw.js";import"./factory-Dz1TPLtm.js";import"./create-safe-context-BXc7tRjk.js";import"./ScrollArea-CFRGJffE.js";import"./floating-ui.react-Dj868ezB.js";import"./index-BWvEnbio.js";import"./index-C6v8ZWlP.js";import"./use-merged-ref-DqfW-Wu5.js";import"./DirectionProvider-_O4bm55E.js";import"./to-int-PQE0s6ay.js";const g={title:"UI-Kit/Table",component:e,tags:["autodocs"]},m=[{position:6,mass:12.011,symbol:"C",name:"Carbon"},{position:7,mass:14.007,symbol:"N",name:"Nitrogen"},{position:8,mass:15.999,symbol:"O",name:"Oxygen"},{position:9,mass:18.998,symbol:"F",name:"Fluorine"},{position:10,mass:20.18,symbol:"Ne",name:"Neon"}],o={render:()=>{const l=m.map(s=>n.jsxs(e.Tr,{children:[n.jsx(e.Td,{children:s.position}),n.jsx(e.Td,{children:s.name}),n.jsx(e.Td,{children:s.symbol}),n.jsx(e.Td,{children:s.mass})]},s.name));return n.jsxs(e,{children:[n.jsx(e.Thead,{children:n.jsxs(e.Tr,{children:[n.jsx(e.Th,{children:"Element position"}),n.jsx(e.Th,{children:"Element name"}),n.jsx(e.Th,{children:"Symbol"}),n.jsx(e.Th,{children:"Atomic mass"})]})}),n.jsx(e.Tbody,{children:l})]})}};var a,r,T;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  render: () => {
    const rows = elements.map(element => <Table.Tr key={element.name}>
        <Table.Td>{element.position}</Table.Td>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>{element.symbol}</Table.Td>
        <Table.Td>{element.mass}</Table.Td>
      </Table.Tr>);
    return <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Element position</Table.Th>
            <Table.Th>Element name</Table.Th>
            <Table.Th>Symbol</Table.Th>
            <Table.Th>Atomic mass</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>;
  }
}`,...(T=(r=o.parameters)==null?void 0:r.docs)==null?void 0:T.source}}};const N=["Default"];export{o as Default,N as __namedExportsOrder,g as default};
