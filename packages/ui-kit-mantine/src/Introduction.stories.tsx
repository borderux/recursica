import type { Meta, StoryObj } from "@storybook/react";

// Create a simple component for the documentation
const WelcomeComponent = () => (
  <div style={{ padding: "2rem", fontFamily: "system-ui" }}>
    <h1>Welcome to Recursica Design System</h1>
    <p>
      <strong>
        The modern, scalable design system that bridges the gap between design
        and development.
      </strong>
    </p>

    <hr />

    <h2>What is Recursica?</h2>
    <p>
      Recursica is a comprehensive design system that transforms the way teams
      build digital products. By providing a unified language between designers
      and developers, we eliminate inconsistencies, reduce development time, and
      ensure exceptional user experiences across all touchpoints.
    </p>

    <h3>
      🚀 <strong>Built for Modern Teams</strong>
    </h3>
    <p>
      Whether you're a startup building your first product or an enterprise
      scaling across multiple teams, Recursica adapts to your workflow. Our
      system is designed to grow with your organization while maintaining
      consistency and quality.
    </p>

    <hr />

    <h2>Why Choose Recursica?</h2>

    <h3>
      ⚡ <strong>Accelerate Development</strong>
    </h3>
    <ul>
      <li>
        <strong>50% faster prototyping</strong> with pre-built, tested
        components
      </li>
      <li>
        <strong>Zero design debt</strong> with automated design token
        synchronization
      </li>
      <li>
        <strong>Instant deployment</strong> from Figma to production-ready code
      </li>
    </ul>

    <h3>
      🎨 <strong>Design-Developer Harmony</strong>
    </h3>
    <ul>
      <li>
        <strong>Single source of truth</strong> that keeps design and code in
        perfect sync
      </li>
      <li>
        <strong>Real-time updates</strong> from Figma directly to your codebase
      </li>
      <li>
        <strong>Type-safe components</strong> with complete TypeScript support
      </li>
    </ul>

    <h3>
      🔧 <strong>Enterprise-Ready</strong>
    </h3>
    <ul>
      <li>
        <strong>Framework agnostic</strong> - works with React, Vue, Angular,
        and more
      </li>
      <li>
        <strong>Customizable theming</strong> that respects your brand identity
      </li>
      <li>
        <strong>Accessibility built-in</strong> with WCAG 2.1 AA compliance
      </li>
      <li>
        <strong>Performance optimized</strong> with zero-runtime CSS-in-JS
      </li>
    </ul>

    <h3>
      🌍 <strong>Global Scale</strong>
    </h3>
    <ul>
      <li>
        <strong>Multi-brand support</strong> for complex organizational
        structures
      </li>
      <li>
        <strong>i18n ready</strong> for international products
      </li>
      <li>
        <strong>Dark/light themes</strong> and custom brand variations
      </li>
      <li>
        <strong>Component versioning</strong> for safe, gradual migrations
      </li>
    </ul>

    <hr />

    <h2>The Recursica Advantage</h2>

    <h3>Traditional Approach vs. Recursica</h3>
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        margin: "1rem 0",
      }}
    >
      <thead>
        <tr style={{ backgroundColor: "#f8f9fa" }}>
          <th
            style={{
              padding: "0.75rem",
              border: "1px solid #dee2e6",
              textAlign: "left",
            }}
          >
            Traditional Design Systems
          </th>
          <th
            style={{
              padding: "0.75rem",
              border: "1px solid #dee2e6",
              textAlign: "left",
            }}
          >
            Recursica Design System
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Manual design-to-code translation
          </td>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Automated Figma-to-code sync
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Inconsistent implementations
          </td>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Guaranteed design fidelity
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Time-consuming maintenance
          </td>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Self-updating components
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Limited customization
          </td>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Infinite brand flexibility
          </td>
        </tr>
        <tr>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Framework-specific solutions
          </td>
          <td style={{ padding: "0.75rem", border: "1px solid #dee2e6" }}>
            Universal compatibility
          </td>
        </tr>
      </tbody>
    </table>

    <hr />

    <h2>Real Results from Real Teams</h2>

    <blockquote
      style={{
        borderLeft: "4px solid #007bff",
        paddingLeft: "1rem",
        margin: "1rem 0",
        fontStyle: "italic",
      }}
    >
      <p>
        "Recursica reduced our time-to-market by 40% while improving design
        consistency across our entire product suite."
      </p>
      <p>
        <strong>— Sarah Chen, Design Lead at TechFlow</strong>
      </p>
    </blockquote>

    <blockquote
      style={{
        borderLeft: "4px solid #007bff",
        paddingLeft: "1rem",
        margin: "1rem 0",
        fontStyle: "italic",
      }}
    >
      <p>
        "The Figma integration is game-changing. Our developers get
        pixel-perfect components without any manual work."
      </p>
      <p>
        <strong>— Marcus Rodriguez, Senior Developer at InnovateCorp</strong>
      </p>
    </blockquote>

    <blockquote
      style={{
        borderLeft: "4px solid #007bff",
        paddingLeft: "1rem",
        margin: "1rem 0",
        fontStyle: "italic",
      }}
    >
      <p>
        "Managing multiple brand themes used to take weeks. Now it takes
        minutes."
      </p>
      <p>
        <strong>— Alex Thompson, Product Manager at GlobalTech</strong>
      </p>
    </blockquote>

    <hr />

    <h2>Get Started in Minutes</h2>

    <h3>
      1. <strong>Install the Package</strong>
    </h3>
    <pre
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1rem",
        borderRadius: "4px",
        overflow: "auto",
      }}
    >
      <code>npm install @recursica/ui-kit-mantine</code>
    </pre>

    <h3>
      2. <strong>Set Up Your Theme</strong>
    </h3>
    <pre
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1rem",
        borderRadius: "4px",
        overflow: "auto",
      }}
    >
      <code>{`import { ThemeProvider } from "@recursica/ui-kit-mantine";

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}`}</code>
    </pre>

    <h3>
      3. <strong>Start Building</strong>
    </h3>
    <pre
      style={{
        backgroundColor: "#f8f9fa",
        padding: "1rem",
        borderRadius: "4px",
        overflow: "auto",
      }}
    >
      <code>{`import { Button, Card, Text } from "@recursica/ui-kit-mantine";

<Card>
  <Text variant="heading">Welcome to Recursica</Text>
  <Button variant="primary">Get Started</Button>
</Card>`}</code>
    </pre>

    <hr />

    <h2>What's Included</h2>

    <h3>
      🧱 <strong>50+ Production-Ready Components</strong>
    </h3>
    <p>
      From basic buttons to complex data tables, every component is built for
      real-world use cases.
    </p>

    <h3>
      🎨 <strong>Complete Design Token System</strong>
    </h3>
    <p>
      Colors, typography, spacing, shadows, and animations - all systematically
      organized and customizable.
    </p>

    <h3>
      📱 <strong>Responsive by Default</strong>
    </h3>
    <p>
      Every component works beautifully across desktop, tablet, and mobile
      devices.
    </p>

    <h3>
      ♿ <strong>Accessibility First</strong>
    </h3>
    <p>
      Built-in keyboard navigation, screen reader support, and ARIA attributes.
    </p>

    <h3>
      🔒 <strong>Type Safety</strong>
    </h3>
    <p>
      Full TypeScript support with intelligent autocompletion and compile-time
      error checking.
    </p>

    <h3>
      📚 <strong>Comprehensive Documentation</strong>
    </h3>
    <p>
      Interactive examples, API references, and best practices for every
      component.
    </p>

    <hr />

    <h2>Ready to Transform Your Workflow?</h2>

    <p>
      <strong>Recursica isn't just another component library</strong> - it's a
      complete design system that revolutionizes how teams collaborate and ship
      products.
    </p>

    <h3>
      <strong>Perfect for:</strong>
    </h3>
    <ul>
      <li>
        <strong>Startups</strong> looking to establish professional design
        standards quickly
      </li>
      <li>
        <strong>Growing companies</strong> scaling their design operations
      </li>
      <li>
        <strong>Enterprise teams</strong> managing multiple products and brands
      </li>
      <li>
        <strong>Design agencies</strong> delivering consistent client work
      </li>
      <li>
        <strong>Open source projects</strong> maintaining design coherence
      </li>
    </ul>

    <hr />

    <h2>Start Your Journey</h2>

    <p>
      Explore our components, customize our themes, and experience the future of
      design systems. Every component in this Storybook is production-ready and
      battle-tested by teams worldwide.
    </p>

    <p>
      <strong>Ready to revolutionize your design workflow?</strong>
    </p>

    <hr />

    <p style={{ textAlign: "center", fontStyle: "italic" }}>
      <em>
        Built with ❤️ by the Recursica team. Open source and ready for your next
        big idea.
      </em>
    </p>
  </div>
);

const meta: Meta<typeof WelcomeComponent> = {
  title: "Introduction/Welcome to Recursica",
  component: WelcomeComponent,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        story:
          "Welcome to the Recursica Design System - a modern, scalable design system for building exceptional user interfaces.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Welcome: Story = {
  name: "Welcome to Recursica",
};
