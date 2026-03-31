import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Accordion } from "./Accordion";
import { Layer } from "../Layer";

const SVGIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const ChevronIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.0306 9.53062L12.5306 17.0306C12.461 17.1003 12.3783 17.1557 12.2872 17.1934C12.1962 17.2312 12.0986 17.2506 12 17.2506C11.9014 17.2506 11.8038 17.2312 11.7128 17.1934C11.6218 17.1557 11.539 17.1003 11.4694 17.0306L3.96938 9.53062C3.82865 9.38988 3.74959 9.19901 3.74959 8.99999C3.74959 8.80097 3.82865 8.61009 3.96938 8.46936C4.11011 8.32863 4.30098 8.24957 4.50001 8.24957C4.69903 8.24957 4.8899 8.32863 5.03063 8.46936L12 15.4397L18.9694 8.46936C19.0391 8.39968 19.1218 8.34441 19.2128 8.30669C19.3039 8.26898 19.4015 8.24957 19.5 8.24957C19.5986 8.24957 19.6961 8.26898 19.7872 8.30669C19.8782 8.34441 19.9609 8.39968 20.0306 8.46936C20.1003 8.53905 20.1556 8.62177 20.1933 8.71282C20.231 8.80386 20.2504 8.90144 20.2504 8.99999C20.2504 9.09854 20.231 9.19612 20.1933 9.28716C20.1556 9.37821 20.1003 9.46093 20.0306 9.53062Z"
      fill="currentColor"
    />
  </svg>
);

const meta: Meta<typeof Accordion> = {
  title: "Design System/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component: `
The \`Accordion\` component intelligently wraps \`@mantine/core\`'s underlying Accordion layers while applying strict native design system mapping via \`recursica_variables_scoped.css\`.

### Hybrid Composition API (Smart-Rendering)
To maximize flexibility while strictly aligning with the explicit Recursica design logic, the \`AccordionItem\` operates utilizing a **Hybrid Smart-Rendering Flow**:

1. **Auto-Construction (Explicit Mapping)**:
If you supply the explicitly outlined Recursica properties (\`title\`, \`leftIcon\`) directly onto \`<Accordion.Item>\`, the component auto-generates the necessary \`<Accordion.Control>\` DOM layer inherently bridging the icons and titles visually while leaving the raw \`children\` wrapped neatly as the \`<Accordion.Panel>\`.

2. **Graceful Falldown (Raw Composability)**:
If you deliberately omit the \`title\` property, the entire mapping system gracefully falls backward yielding exactly to the raw \`@mantine/core\` composition model. Under this context, you must inject your localized \`<Accordion.Control>\` and \`<Accordion.Panel>\` configurations completely manually.

### Architecture Warning (\`open\`)
To structurally protect the parent wrapper's core transitions tracking architecture (\`<Accordion value="...">\`), this configuration explicitly rejects mapping isolated \`open={true}\` object states natively on specific configurations. Use Mantine's inherent sibling arrays matching the corresponding active value map!
        `,
      },
    },
  },
};

export default meta;

export const Default: StoryObj<typeof Accordion> = {
  render: () => {
    return (
      <Layer layer={0} style={{ padding: "24px" }}>
        <Accordion defaultValue="item-1" chevron={<ChevronIcon />}>
          <Accordion.Item value="item-1">
            <Accordion.Control>Billing and Membership</Accordion.Control>
            <Accordion.Panel>
              You can manage your billing directly from the dashboard tab. All
              payments are processed automatically.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="item-2">
            <Accordion.Control>Refund Policy</Accordion.Control>
            <Accordion.Panel>
              We offer a 30-day money-back guarantee for all new subscriptions.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="item-3">
            <Accordion.Control>Technical Support</Accordion.Control>
            <Accordion.Panel>
              Our support team is available 24/7 via live chat or email.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Layer>
    );
  },
};

export const WithIcons: StoryObj<typeof Accordion> = {
  render: () => {
    return (
      <Layer layer={0} style={{ padding: "24px" }}>
        <Accordion defaultValue="security" chevron={<ChevronIcon />}>
          <Accordion.Item value="security">
            <Accordion.Control leftIcon={<SVGIcon />}>
              Security Settings
            </Accordion.Control>
            <Accordion.Panel>
              Enable two-factor authentication (2FA) and monitor active sessions
              below.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="privacy">
            <Accordion.Control leftIcon={<SVGIcon />}>
              Privacy Configuration
            </Accordion.Control>
            <Accordion.Panel>
              Choose what data is shared with our analytics partners.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Layer>
    );
  },
};

export const LayerOne: StoryObj<typeof Accordion> = {
  render: () => {
    return (
      <Layer layer={1} style={{ padding: "24px" }}>
        <Accordion defaultValue="demo" chevron={<ChevronIcon />}>
          <Accordion.Item value="demo">
            <Accordion.Control leftIcon={<SVGIcon />}>
              Layer 1 Render Engine
            </Accordion.Control>
            <Accordion.Panel>
              This Accordion dynamically updates its colors, borders, and
              typography variables because it is wrapped securely by the
              simulated `data-recursica-layer="1"`.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Layer>
    );
  },
};
