export const integration_rules = `### 💡 Recursica Integration Rules:
1. **Agnostic Layout**: Utilize \`Stack\` (vertical) or \`Group\` (horizontal) to lay out your elements, spacing them with the \`rec-\` prefixed logical tokens (e.g., \`gap="rec-md"\`).
2. **No Custom Styling**: Do not try to inject custom \`classNames\`, inline styling objects, or custom paddings. They are actively stripped out by the Recursica design system to maintain visual coherence.
3. **Escape Hatch**: If a rare design exceptional case warrants custom styles, use \`overStyled={true}\`. Avoid doing this unless necessary, and prioritize contributing the variant natively back to the adapter.\n`;
