import{j as n}from"./iframe-ui3vHneJ.js";import{T as e}from"./Table-4h9P1jmK.js";import"./preload-helper-Dp1pzeXC.js";import"./get-size-C3KF_bQQ.js";import"./factory-Bm8Z26Jt.js";import"./create-safe-context-BRQ5OSXb.js";import"./ScrollArea-BeQ3XGAD.js";import"./floating-ui.react-BcXehHo9.js";import"./index-D8T0xS7x.js";import"./index-DrSfN2HQ.js";import"./use-merged-ref-DzAJhlw3.js";import"./DirectionProvider-CvtOTCV8.js";import"./to-int-PQE0s6ay.js";const O={title:"UI-Kit/Table",component:e,tags:["autodocs"]},t=[{position:6,mass:12.011,symbol:"C",name:"Carbon"},{position:7,mass:14.007,symbol:"N",name:"Nitrogen"},{position:8,mass:15.999,symbol:"O",name:"Oxygen"},{position:9,mass:18.998,symbol:"F",name:"Fluorine"},{position:10,mass:20.18,symbol:"Ne",name:"Neon"}],s={render:()=>{const r=t.map(a=>n.jsxs(e.Tr,{children:[n.jsx(e.Td,{children:a.position}),n.jsx(e.Td,{children:a.name}),n.jsx(e.Td,{children:a.symbol}),n.jsx(e.Td,{children:a.mass})]},a.name));return n.jsxs(e,{children:[n.jsx(e.Thead,{children:n.jsxs(e.Tr,{children:[n.jsx(e.Th,{children:"Element position"}),n.jsx(e.Th,{children:"Element name"}),n.jsx(e.Th,{children:"Symbol"}),n.jsx(e.Th,{children:"Atomic mass"})]})}),n.jsx(e.Tbody,{children:r})]})}},l={render:()=>{const a=[...t].sort((T,i)=>T.mass-i.mass).map(T=>n.jsxs(e.Tr,{children:[n.jsx(e.Td,{children:T.position}),n.jsx(e.Td,{children:T.name}),n.jsx(e.Td,{children:T.symbol}),n.jsx(e.Td,{children:T.mass})]},T.name));return n.jsxs(e,{children:[n.jsx(e.Thead,{children:n.jsxs(e.Tr,{children:[n.jsx(e.Th,{children:"Element position"}),n.jsx(e.Th,{children:"Element name"}),n.jsx(e.Th,{children:"Symbol"}),n.jsx(e.Th,{sorted:"asc",children:"Atomic mass"})]})}),n.jsx(e.Tbody,{children:a})]})}},o={render:()=>n.jsxs(e,{children:[n.jsx(e.Thead,{children:n.jsxs(e.Tr,{children:[n.jsx(e.Th,{children:"Element position"}),n.jsx(e.Th,{children:"Element name"}),n.jsx(e.Th,{children:"Symbol"}),n.jsx(e.Th,{children:"Atomic mass"})]})}),n.jsx(e.Tbody,{children:t.map((r,a)=>n.jsxs(e.Tr,{selected:a===0,disabled:a===t.length-1,children:[n.jsx(e.Td,{children:r.position}),n.jsx(e.Td,{children:r.name}),n.jsx(e.Td,{children:r.symbol}),n.jsx(e.Td,{children:r.mass})]},r.name))})]})},d={render:()=>{const r=[{item:"Widget",price:19.99},{item:"Gadget",price:49.5},{item:"Gizmo",price:9.25}],a=r.reduce((T,i)=>T+i.price,0);return n.jsxs(e,{children:[n.jsx(e.Thead,{children:n.jsxs(e.Tr,{children:[n.jsx(e.Th,{children:"Item"}),n.jsx(e.Th,{children:"Price"})]})}),n.jsx(e.Tbody,{children:r.map(T=>n.jsxs(e.Tr,{children:[n.jsx(e.Td,{children:T.item}),n.jsxs(e.Td,{variant:"currency",children:["$",T.price.toFixed(2)]})]},T.item))}),n.jsx(e.Tfoot,{children:n.jsxs(e.Tr,{children:[n.jsx(e.Td,{children:"Total"}),n.jsxs(e.Td,{variant:"currency",children:["$",a.toFixed(2)]})]})})]})}};var m,b,c;s.parameters={...s.parameters,docs:{...(m=s.parameters)==null?void 0:m.docs,source:{originalSource:`{
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
}`,...(c=(b=s.parameters)==null?void 0:b.docs)==null?void 0:c.source}}};var h,p,x;l.parameters={...l.parameters,docs:{...(h=l.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => {
    const sorted = [...elements].sort((a, b) => a.mass - b.mass);
    const rows = sorted.map(element => <Table.Tr key={element.name}>
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
            <Table.Th sorted="asc">Atomic mass</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>;
  }
}`,...(x=(p=l.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var j,y,u;o.parameters={...o.parameters,docs:{...(j=o.parameters)==null?void 0:j.docs,source:{originalSource:`{
  render: () => <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Element position</Table.Th>
          <Table.Th>Element name</Table.Th>
          <Table.Th>Symbol</Table.Th>
          <Table.Th>Atomic mass</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {elements.map((element, index) => <Table.Tr key={element.name} selected={index === 0} disabled={index === elements.length - 1}>
            <Table.Td>{element.position}</Table.Td>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.symbol}</Table.Td>
            <Table.Td>{element.mass}</Table.Td>
          </Table.Tr>)}
      </Table.Tbody>
    </Table>
}`,...(u=(y=o.parameters)==null?void 0:y.docs)==null?void 0:u.source}}};var E,S,g;d.parameters={...d.parameters,docs:{...(E=d.parameters)==null?void 0:E.docs,source:{originalSource:`{
  render: () => {
    const prices = [{
      item: "Widget",
      price: 19.99
    }, {
      item: "Gadget",
      price: 49.5
    }, {
      item: "Gizmo",
      price: 9.25
    }];
    const total = prices.reduce((sum, row) => sum + row.price, 0);
    return <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Item</Table.Th>
            <Table.Th>Price</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {prices.map(row => <Table.Tr key={row.item}>
              <Table.Td>{row.item}</Table.Td>
              <Table.Td variant="currency">\${row.price.toFixed(2)}</Table.Td>
            </Table.Tr>)}
        </Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td>Total</Table.Td>
            <Table.Td variant="currency">\${total.toFixed(2)}</Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>;
  }
}`,...(g=(S=d.parameters)==null?void 0:S.docs)==null?void 0:g.source}}};const R=["Default","SortedColumn","SelectedAndDisabledRows","CurrencyColumnWithFooter"];export{d as CurrencyColumnWithFooter,s as Default,o as SelectedAndDisabledRows,l as SortedColumn,R as __namedExportsOrder,O as default};
