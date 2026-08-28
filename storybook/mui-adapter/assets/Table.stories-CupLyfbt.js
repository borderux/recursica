import{j as l}from"./iframe-DwzbXXsg.js";import{T as e}from"./Table-BLBB2gQf.js";import"./preload-helper-Dp1pzeXC.js";import"./memoTheme-VNhdAq_e.js";import"./generateUtilityClasses-DGi4yQgU.js";import"./createSvgIcon-TtN7ZrVz.js";import"./useSlot-D3WXn4hk.js";import"./mergeSlotProps-ESQ19004.js";import"./isHostComponent-DVu5iVWx.js";import"./useForkRef-DIGfaA-o.js";import"./ButtonBase-DrWn9hz0.js";import"./useTimeout-0OGhdP7n.js";import"./useEventCallback-C68EW9dQ.js";import"./isFocusVisible-B8k4qzLc.js";const $={title:"UI-Kit/Table",component:e,tags:["autodocs"]},m=[{position:6,mass:12.011,symbol:"C",name:"Carbon"},{position:7,mass:14.007,symbol:"N",name:"Nitrogen"},{position:8,mass:15.999,symbol:"O",name:"Oxygen"},{position:9,mass:18.998,symbol:"F",name:"Fluorine"},{position:10,mass:20.18,symbol:"Ne",name:"Neon"}],r={render:()=>{const s=m.map(a=>l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:a.position}),l.jsx(e.Cell,{children:a.name}),l.jsx(e.Cell,{children:a.symbol}),l.jsx(e.Cell,{children:a.mass})]},a.name));return l.jsx(e.Container,{children:l.jsxs(e,{children:[l.jsx(e.Head,{children:l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:"Element position"}),l.jsx(e.Cell,{children:"Element name"}),l.jsx(e.Cell,{children:"Symbol"}),l.jsx(e.Cell,{children:"Atomic mass"})]})}),l.jsx(e.Body,{children:s})]})})}},o={render:()=>{const a=[...m].sort((n,c)=>n.mass-c.mass).map(n=>l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:n.position}),l.jsx(e.Cell,{children:n.name}),l.jsx(e.Cell,{children:n.symbol}),l.jsx(e.Cell,{children:n.mass})]},n.name));return l.jsx(e.Container,{children:l.jsxs(e,{children:[l.jsx(e.Head,{children:l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:"Element position"}),l.jsx(e.Cell,{children:"Element name"}),l.jsx(e.Cell,{children:"Symbol"}),l.jsx(e.Cell,{sorted:"asc",children:l.jsx(e.SortLabel,{active:!0,direction:"asc",children:"Atomic mass"})})]})}),l.jsx(e.Body,{children:a})]})})}},t={render:()=>l.jsx(e.Container,{children:l.jsxs(e,{children:[l.jsx(e.Head,{children:l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:"Element position"}),l.jsx(e.Cell,{children:"Element name"}),l.jsx(e.Cell,{children:"Symbol"}),l.jsx(e.Cell,{children:"Atomic mass"})]})}),l.jsx(e.Body,{children:m.map((s,a)=>l.jsxs(e.Row,{selected:a===0,disabled:a===m.length-1,children:[l.jsx(e.Cell,{children:s.position}),l.jsx(e.Cell,{children:s.name}),l.jsx(e.Cell,{children:s.symbol}),l.jsx(e.Cell,{children:s.mass})]},s.name))})]})})},i={render:()=>{const s=[{item:"Widget",price:19.99},{item:"Gadget",price:49.5},{item:"Gizmo",price:9.25}],a=s.reduce((n,c)=>n+c.price,0);return l.jsx(e.Container,{children:l.jsxs(e,{children:[l.jsx(e.Head,{children:l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:"Item"}),l.jsx(e.Cell,{children:"Price"})]})}),l.jsx(e.Body,{children:s.map(n=>l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:n.item}),l.jsxs(e.Cell,{variant:"currency",children:["$",n.price.toFixed(2)]})]},n.item))}),l.jsx(e.Footer,{children:l.jsxs(e.Row,{children:[l.jsx(e.Cell,{children:"Total"}),l.jsxs(e.Cell,{variant:"currency",children:["$",a.toFixed(2)]})]})})]})})}};var b,d,T;r.parameters={...r.parameters,docs:{...(b=r.parameters)==null?void 0:b.docs,source:{originalSource:`{
  render: () => {
    const rows = elements.map(element => <Table.Row key={element.name}>
        <Table.Cell>{element.position}</Table.Cell>
        <Table.Cell>{element.name}</Table.Cell>
        <Table.Cell>{element.symbol}</Table.Cell>
        <Table.Cell>{element.mass}</Table.Cell>
      </Table.Row>);
    return <Table.Container>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Element position</Table.Cell>
              <Table.Cell>Element name</Table.Cell>
              <Table.Cell>Symbol</Table.Cell>
              <Table.Cell>Atomic mass</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </Table.Container>;
  }
}`,...(T=(d=r.parameters)==null?void 0:d.docs)==null?void 0:T.source}}};var C,p,x;o.parameters={...o.parameters,docs:{...(C=o.parameters)==null?void 0:C.docs,source:{originalSource:`{
  render: () => {
    const sorted = [...elements].sort((a, b) => a.mass - b.mass);
    const rows = sorted.map(element => <Table.Row key={element.name}>
        <Table.Cell>{element.position}</Table.Cell>
        <Table.Cell>{element.name}</Table.Cell>
        <Table.Cell>{element.symbol}</Table.Cell>
        <Table.Cell>{element.mass}</Table.Cell>
      </Table.Row>);
    return <Table.Container>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Element position</Table.Cell>
              <Table.Cell>Element name</Table.Cell>
              <Table.Cell>Symbol</Table.Cell>
              <Table.Cell sorted="asc">
                <Table.SortLabel active direction="asc">
                  Atomic mass
                </Table.SortLabel>
              </Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>{rows}</Table.Body>
        </Table>
      </Table.Container>;
  }
}`,...(x=(p=o.parameters)==null?void 0:p.docs)==null?void 0:x.source}}};var h,j,y;t.parameters={...t.parameters,docs:{...(h=t.parameters)==null?void 0:h.docs,source:{originalSource:`{
  render: () => <Table.Container>
      <Table>
        <Table.Head>
          <Table.Row>
            <Table.Cell>Element position</Table.Cell>
            <Table.Cell>Element name</Table.Cell>
            <Table.Cell>Symbol</Table.Cell>
            <Table.Cell>Atomic mass</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {elements.map((element, index) => <Table.Row key={element.name} selected={index === 0} disabled={index === elements.length - 1}>
              <Table.Cell>{element.position}</Table.Cell>
              <Table.Cell>{element.name}</Table.Cell>
              <Table.Cell>{element.symbol}</Table.Cell>
              <Table.Cell>{element.mass}</Table.Cell>
            </Table.Row>)}
        </Table.Body>
      </Table>
    </Table.Container>
}`,...(y=(j=t.parameters)==null?void 0:j.docs)==null?void 0:y.source}}};var u,w,R;i.parameters={...i.parameters,docs:{...(u=i.parameters)==null?void 0:u.docs,source:{originalSource:`{
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
    return <Table.Container>
        <Table>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Item</Table.Cell>
              <Table.Cell>Price</Table.Cell>
            </Table.Row>
          </Table.Head>
          <Table.Body>
            {prices.map(row => <Table.Row key={row.item}>
                <Table.Cell>{row.item}</Table.Cell>
                <Table.Cell variant="currency">
                  \${row.price.toFixed(2)}
                </Table.Cell>
              </Table.Row>)}
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell>Total</Table.Cell>
              <Table.Cell variant="currency">\${total.toFixed(2)}</Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table>
      </Table.Container>;
  }
}`,...(R=(w=i.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};const I=["Default","SortedColumn","SelectedAndDisabledRows","CurrencyColumnWithFooter"];export{i as CurrencyColumnWithFooter,r as Default,t as SelectedAndDisabledRows,o as SortedColumn,I as __namedExportsOrder,$ as default};
