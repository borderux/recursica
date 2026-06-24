# Card Implementation Notes

## Architecture Overrides

Because MUI natively constructs `Card` bounding boxes using `<Paper>` components (which lack the precise edge-to-edge layouts native to Mantine's sections), we implemented custom margins for edge-to-edge section components:

- `<Card.Header>` explicitly hooks `--recursica_ui-kit_components_card_properties_header-background` and corresponding padding variables, stretching edge-to-edge via negative margin resets.
- `<Card.Footer>` explicitly hooks `--recursica_ui-kit_components_card_properties_footer-background` and corresponding padding variables.

## Layout Alignment Exceptions

To allow Cards to fit cleanly inside dynamic/flex layouts (like dashboard panels, grid tracks, or sidebar layout segments), the Card wrapper implements a custom gatekeeper bypass for outer styling properties:

- Exposes a safe subset of flexbox/dimensions styling properties (`flex`, `flexGrow`, `flexShrink`, `flexBasis`, `grow`, `h`, `height`) on the root `<Card>` component to allow proper sizing alongside layout siblings.
- Sets `<Card.Content>` to `flex-grow: 1;` by default via CSS modules. Since the root `<Card>` has `display: flex; flex-direction: column;`, this makes the content area expand to fill all vertical space, pushing `<Card.Footer>` to align at the absolute bottom of the bounding box.
