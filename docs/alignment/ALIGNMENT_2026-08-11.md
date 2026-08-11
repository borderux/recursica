# Forge / Adapter / Skill Alignment — 2026-08-11

Sweep of the Recursica name and token contract across three repos. Forge is the source of truth.

**Commits under audit**

| Repo | Commit | Date |
|------|--------|------|
| `recursica-forge` | `430dddd` | 2026-08-10 |
| `recursica` (monorepo) | `060465d` | 2026-08-11 |
| `recursica-knowledge` | `9cdf96c` | 2026-08-11 |

All three were clean on `main` when read. Every claim below cites a path and a line in one of
those trees.

**The failure this sweep exists to catch:** a name that does not match across layers produces a
wrong render with **no error**. React drops an unknown prop silently; a CSS variable nobody
references is simply not applied; a skill that denies a variant exists causes an agent never to
pass it. Nothing throws in any of those cases.

---

## Coverage — read this before the findings

This is a **partial** sweep and the partition is deliberate. Do not read the summary as complete.

| Layer | Coverage | How |
|-------|----------|-----|
| **L1 — forge axes** | **55 of 55 components, complete** | Recursive walk of `ui-kit.components.*.variants` at every nesting depth |
| **L2 — `adapter-common` contract** | **Complete** for every string-literal prop union, plus `types.ts` in full | Read every `Recursica*Props.ts` |
| **L5 — CSS variable coverage** | **55 of 55 components, complete** | `packages/recursica-token-analyzer` run in both adapter packages, plus a located file:line for all 546 exemption comments |
| **L3 — adapter `.tsx`** | **~20 of 55 read end to end** | Named below |
| **L4 — component skills** | **39 of 39 audited for the axis/prop table; 12 read in full** | Named below |

**L3 read end to end:** `Button`, `Avatar`, `Label`, `FormControlLayout`, `Loader`, `Accordion`
(contract only), `SegmentedControl`, `Chip`, `Slider`, `Tabs`, `Stepper`, `Toast`, `Badge`,
`AssistiveElement`, `Timeline`, `Tree`, `Checkbox`, `Radio`, `Switch`, `DatePicker`, `Table`,
`FileInput`, `FileUpload`, `TransferList`.

**L3 NOT read end to end — 25 components.** `TextField`, `TextArea`, `NumberInput`, `Dropdown`,
`Autocomplete`, `TimePicker`, `ReadOnlyField`, `Menu`, `MenuItem`, `Modal`, `Panel`, `Card`,
`Tooltip`, `HoverCard`, `Popover`, `Breadcrumb`, `Pagination`, `Link`, `Text`, `Title`,
`Typography`, `Box`, and the `table-cell` / `table-header` / `table-footer` subcomponents. Their
L1, L2 and L5 rows below are verified; their map tables and defaults are **not**. A silent
fallback could be sitting in any of them.

**L4 read in full:** `button`, `text-field`, `chip`, `switch`, `checkbox`, `radio-button`,
`tree`, `segmented-control`, `timeline`, `loader`, `link`, plus the `forms` design rule. The
other 27 component skills were audited only for the presence of the axis → prop-name column.

**Why the sweep stopped here:** the L1, L2 and L5 layers are scriptable and were completed for
all 55. L3 and L4 require reading each file, which is the only way the map tables and defaults
show up, and that is where the budget ran out. Finish with a second pass over the 25 named above.

---

## Blocking gate — the prop-name table is not yet approved

Aaron asked for prop names aligned to forge, not only values. Several existing names cannot be
derived mechanically. **No rename is proposed in this report and none has been generated.** The
canonical axis → prop-name table is posted separately for sign-off; §5 records what the layers
say today so the table can be judged against reality.

---

## 1. Forge axis inventory (L1) — authoritative

55 components. **Axes nest**, which a top-level read of `variants` misses entirely: `avatar`
carries `styles.{text,icon}.variants.types` and `label` carries
`layouts.{stacked,side-by-side}.variants.sizes`. Any tooling built on this must recurse.

| Axis | Components | Values |
|------|-----------|--------|
| `styles` | `button` | `solid`, `text`, `outline` |
| | `toast` | `default`, `success`, `error` |
| | `tabs`, `tabs-item` | `default`, `pills`, `outline` |
| | `avatar` | `text`, `icon`, `image` |
| | `badge` | `primary-color`, `warning`, `success`, `alert` |
| `sizes` | `button` | `default`, `small` |
| | `avatar`, `loader` | `small`, `default`, `large` |
| | `stepper` | `large`, `small` |
| | `label` (nested under `layouts`) | `default`, `small` |
| `content` | `button` | `icon-label`, `label`, `icon-only` |
| `types` | `avatar` (nested under `styles`) | `solid`, `outline`, `ghost` |
| | `assistive-element` | `help`, `error` |
| | `timeline-bullet` | `default`, `icon`, `icon-alternative`, `avatar` |
| `layouts` | 16 components | `stacked`, `side-by-side` |
| `orientation` | `stepper`, `segmented-control`, `tabs`, `tabs-item` | `horizontal`, `vertical` |
| `fill-width` | `segmented-control` | `false`, `true` |
| `appearance` | `accordion-header` | `open`, `closed` |
| `selection-states` | `chip`, `menu-item`, `radio-button`, `segmented-control-item`, `switch`, `tree` | `selected`, `unselected` |
| | `checkbox` | `checked`, `unchecked`, `indeterminate` |
| | `tabs-item`, `timeline`, `timeline-bullet` | `active`, `inactive` |
| `states` | 20 components | `error` and/or `disabled` |
| | `link` | `visited` |
| | `slider` | `error`, `disabled`, `active` |
| | `chip` (nested under `selection-states`) | `error` |

The 16 `layouts` components: `autocomplete`, `checkbox-group`, `date-picker`, `dropdown`,
`file-input`, `file-upload`, `label`, `number-input`, `radio-button-group`, `read-only-field`,
`slider`, `switch-group`, `text-field`, `textarea`, `time-picker`, `transfer-list`.

**Not a discrepancy — recorded so it is not re-reported.** `states: error, disabled` correctly
becomes boolean `error` / `disabled` props. `selection-states` correctly becomes a controlled
`checked` / `selected` boolean. `link.states: visited` is correctly the CSS `:visited`
pseudo-class and not a prop. `button.content` is correctly inferred from `icon` plus children
(`Button.tsx:63-68` in both adapters) and emitted as `data-content`. `avatar.styles` is
correctly inferred from `src` / `icon` (`Avatar.tsx:48-53` in both) and emitted as `data-style`.
`accordion-header.appearance` is correctly CSS-driven. `slider.states.active` is a drag state the
component owns. None of these is a finding.

**One forge-side inconsistency, noted not proposed.** `selection-states` uses three different
value pairs across ten components: `selected`/`unselected`, `checked`/`unchecked`/`indeterminate`,
and `active`/`inactive`. `checkbox` differs for a real reason — it has a genuine third state.
`tabs-item`, `timeline` and `timeline-bullet` using `active`/`inactive` for what is elsewhere
`selected`/`unselected` looks like drift rather than intent. **Raised as a question, not a patch**
— see §7.4. One other forge question is raised at §7.5.

---

## 2. Findings — `breaks-silently`

### 2.1 Three components are stubs in both adapters, and no skill says so

`file-input`, `file-upload` and `transfer-list` render a placeholder with no implementation in
**both** adapters. The adapters state this in their own files:

- `packages/mantine-adapter/src/components/FileInput/FileInput.module.css:3` — `FileInput is a "Coming Soon" stub component.` Same at `FileUpload.module.css:3` and `TransferList.module.css:3`.
- `packages/mui-adapter/src/components/FileInput/FileInput.module.css:2` — `This component is a placeholder stub.` Same in `FileUpload.module.css:2` and `TransferList.module.css:2`.

Each of those six `.module.css` files references **zero** `var(--recursica…)`.

Meanwhile `skills/components/recursica-skill-file-input/SKILL.md`,
`recursica-skill-file-upload/SKILL.md` and `recursica-skill-transfer-list/SKILL.md` document
each component's full axis inventory, rules, accessibility requirements and pre-flight
checklist, and **none of the three contains the words "stub", "coming soon", "placeholder
component" or "not implemented"** (grep over all three, 2026-08-11).

An agent reading the skill has no way to learn the component does not render. It will compose a
form around it, pass a correct `formLayout` and a correct `error`, and ship a placeholder.

**Severity: breaks-silently.** **Fix: skill first** — a "Not yet implemented" banner in the three
skills, stating that the component renders a placeholder in both adapters. That is free and
immediate. The adapter work is a separate, larger job.

### 2.2 MUI's `DatePicker` is a stub while Mantine's is implemented

`packages/mui-adapter/src/components/DatePicker/DatePicker.module.css` is **43 lines containing
no CSS at all** — one comment and 38 `recursica-ignore` lines. Line 2 states: `This component is
a placeholder stub.` Zero `var(--recursica…)` references.

`packages/mantine-adapter/src/components/DatePicker/DatePicker.module.css` applies **31 of the 34**
forge `date-picker` variables.

So the same forge variant renders one way in Mantine and unstyled in MUI, and
`skills/components/recursica-skill-date-picker/SKILL.md` documents it as a working component with
no mention of either fact.

**Severity: breaks-silently.** **Fix: skill first** (state the MUI gap), then MUI adapter.

### 2.3 MUI's table family applies no Recursica tokens, and nothing flags it

`packages/mui-adapter/src/components/Table/Table.module.css` references **zero**
`--recursica_ui-kit_components_table*` variables.
`packages/mantine-adapter/src/components/Table/Table.module.css` references **104**.

Forge defines 101 variables across `table` (13), `table-cell` (26), `table-header` (34) and
`table-footer` (28). In MUI all 101 are unapplied **and unexempted** — unlike the DatePicker
stub, there is not even an exemption comment or a stub declaration. The analyzer's `unused`
warning is the only trace, and that warning does not fail the build (see §4.1).

`skills/components/recursica-skill-table/SKILL.md` documents the component with no mention of
the MUI gap.

**Severity: breaks-silently.** **Fix: skill first, then MUI adapter.**

### 2.4 The `chip` skill's stated reason for banning the error state is false — the ban is not

`skills/components/recursica-skill-chip/SKILL.md:47` (before this sweep):

> **Error and error-selected states are documented outside the token inventory; the kit defines
> neither, and a chip never carries an error condition anyway.** Do not reach for them.

The **instruction is correct house policy** and is left standing.
`skills/design-rules/recursica-skill-badges-chips/SKILL.md:105` — *"Do not use a chip to indicate
an error. Ever."* — and the design router gives a design-rules skill precedence over a component
skill on composition. `recursica-skill-chip/SKILL.md:65` already routes the error to the group's
assistive element.

The **stated reason is false**, and that part is the finding:

- **Forge defines it.** `chip.variants.selection-states.{unselected,selected}.variants.states.error` — a nested axis. Forge exports **14** error variables, 7 per selection state (`…_states_error_properties_colors_{background-color,border-color,close-icon-color,icon-color,leading-icon-color,selected-icon-color,text-color}`).
- **Both adapters implement it.** `mantine-adapter/src/components/Chip/Chip.tsx:40` — `error = false`; `:80` — `const dataError = error ? "" : undefined`; `:93` sets `data-error`. `Chip.module.css:138-143` styles `.root[data-error]` from the forge error variables. The MUI adapter mirrors it at `Chip.tsx:60-62,98,107`.

So a skill whose one job is to state what exists gets this one wrong, in a component where forge,
both adapters, and the design rules all disagree with it. The practical risk is not a wrong render
— it is that an agent meeting a stray `error` prop concludes the inventory is unreliable.

**Severity: drift** (downgraded from `breaks-silently` after reading the design rule — the ban
means no correct build depends on passing `error`).

**Fix: skill, applied.** The axis is now listed as present *and* prohibited, with the design rule
cited. The prop-name column is still pending §7.1.

**Question for §7:** forge and both adapters ship a chip error variant that the house design rules
forbid outright. 14 exported variables and an implemented prop in two adapters exist to serve a
state nobody may use. Either the design rule should relax or the variant should leave the Figma
source — that is a product decision, not Ivan's. See §7.5.

### 2.5 `labelSize="md"` silently does nothing in Mantine

`packages/adapter-common/src/types.ts:141` — `labelSize?: "default" | "small" | "md"`. Same union
at `components/FormControlLayout/RecursicaFormControlLayoutProps.ts:10`.

Forge `label.variants.layouts.{stacked,side-by-side}.variants.sizes` is `default` and `small`.
**`"md"` is not a forge value.**

- MUI handles it, with a comment admitting the problem — `mui-adapter/src/components/FormControlLayout/FormControlLayout.module.css:77-82`: `.leftSection[data-label-size="md"]` with `/* No 'medium' defined explicitly in generated token scope, mapped fallback to default */`.
- **Mantine has no `md` branch.** `mantine-adapter/src/components/FormControlLayout/FormControlLayout.module.css:61-71` defines only `[data-size="default"]` and `[data-size="small"]`.

So `labelSize="md"` type-checks, is accepted, and applies **no width at all** in Mantine.

**Severity: breaks-silently.** **Fix: adapters** — remove `"md"` from both unions and delete the
MUI fallback block. Check for callers first.

### 2.6 `labelAlignment` works in Mantine and does nothing in MUI

`types.ts:142-143` declares `labelAlignment?: "left" | "right"` on `RecursicaLabelProps`, which
MUI's `Label` extends (`mui-adapter/src/components/Label/Label.tsx:8`).

- Mantine applies it: `Label.tsx:72` emits `data-alignment`, and `Label.module.css:22,27` style `[data-alignment="left"]` and `[data-alignment="right"]`.
- MUI never reads it. `Label.tsx:14-24` destructures `overStyled`, `required`, `labelOptionalText`, `labelWithEditIcon`, `onLabelEditClick`, `labelActionArea`, `children`, `className` — **not `labelAlignment`**. It falls into `...rest` (`:23`) and is spread onto MUI's `InputLabel` (`:51`). `Label.module.css` contains no `data-alignment` selector.

`labelAlignment="right"` therefore right-aligns in Mantine and is silently discarded in MUI.

Note `labelAlignment` is **not a forge axis** — forge `label` has no alignment axis. It is an
adapter invention, implemented in one adapter only.

**Severity: breaks-silently.** **Fix: adapters, both together** — either implement it in MUI or
remove it from the shared contract. Needs a decision on which; see §7.

### 2.7 MUI's stacked label ignores two forge properties Mantine applies

Forge `label.variants.layouts.stacked.properties.bottom-padding` and `…_min-height`.

- Mantine applies both: `mantine-adapter/src/components/FormControlLayout/FormControlLayout.module.css:35-41`.
- MUI applies neither: `mui-adapter/…/FormControlLayout.module.css:42-46` sets only `margin-bottom` from `--recursica_ui-kit_globals_form_properties_label-field-gap-vertical` — a globals token, not the label's own.

These are the only two variables the analyzer reports as `unused` for `label` in MUI, so two
independent methods agree. Every stacked form label in MUI has the wrong bottom padding and no
minimum height.

**Severity: breaks-silently.** **Fix: MUI adapter.**

---

## 3. Findings — `drift`

### 3.1 `apps/figma-plugin/export/recursica_ui-kit.json` is stale

Confirmed against forge `430dddd`. Missing 10 components — `table`, `table-cell`,
`table-header`, `table-footer`, `tree`, `switch-group`, `switch-item`, `tabs-item`,
`accordion-header`, `accordion-content` — and carrying phantom `focus` / `default` states on
every form field, which forge does not have.

`packages/official-release/recursica_ui-kit.json` matches forge exactly and is the copy the
analyzer and both adapters read.

**Fix: none in this repo.** The plugin export is regenerated by the plugin. Worth confirming
nothing reads it as a source of truth.

### 3.2 546 exemption comments, of which 273 name variables that do not exist

Measured at `060465d` by locating every `recursica-ignore` comment and testing its variable name
against `packages/official-release/recursica_variables_scoped.css`:

| Adapter | Exemption comments | Naming a variable **absent** from the export |
|---------|-------------------|----------------------------------------------|
| mantine | 245 | **122** |
| mui | 301 | **151** |

A dead exemption exempts nothing. Worse, it looks like coverage. The pattern is consistent: the
dead names encode the phantom `states.default` / `states.focus` shape from the stale plugin
export (§3.1), while the *real* exported variable sits unapplied and unexempted beside it.

`mui-adapter/src/components/DatePicker/DatePicker.module.css` is the clearest case — of its 38
exemptions, the 10 naming `states_default_*` and `states_focus_*` (lines 23-27, 38-42) are dead,
and 10 real date-picker variables are left neither applied nor exempted.

Further examples, each verified: `mantine-adapter/src/components/Avatar/Avatar.module.css:14-16`
exempts `avatar_variants_sizes_{default,large,small}_properties_size` — the export defines
`_properties_width` and `_properties_height`, not `_size`. Same three at
`mui-adapter/src/components/Avatar/Avatar.module.css:14-16`.
`mui-adapter/src/components/Chip/Chip.module.css:9-14` exempts six
`chip_variants_styles_*` names — `chip` has no `styles` axis in forge at all; its axis is
`selection-states`.

**Fix: adapters.** Mechanical and safe: delete every exemption whose variable is absent from the
export, re-run the analyzer, and deal with whatever it then reports.

### 3.3 Exemptions are asymmetric between the adapters — 64 variables

242 variables are exempted in both adapters. **4 in Mantine only, 60 in MUI only.** Where one
adapter exempts and the other applies, the two render the same forge variant differently.

MUI-only, by component: `date-picker` 36, `button` 10, `chip` 6, `link` 4, `autocomplete` 2,
`text-field` 2.

The 7 that matter most, because Mantine applies all of them and MUI exempts them —
`mui-adapter/src/components/Button/Button.module.css`:

```
button_variants_sizes_small_properties_horizontal-padding
button_variants_sizes_small_properties_min-width
button_variants_sizes_small_properties_text_font-style
button_variants_sizes_small_properties_text_letter-spacing
button_variants_sizes_small_properties_text_line-height
button_variants_sizes_small_properties_text_text-decoration
button_variants_sizes_small_properties_text_text-transform
```

A `small` MUI button does not match a `small` Mantine button in padding, min-width, or any of
five text properties.

Mantine-only, all 4: `autocomplete_properties_border-size`
(`AutoComplete.module.css:4`), `date-picker_properties_border-size`
(`DatePicker.module.css:4`), `text-field_properties_border-size` (`TextField.module.css:4`), and
`chip_variants_selection-states_unselected_variants_states_error_properties_colors_leading-icon-color`
(`Chip.module.css:9`).

**Fix: adapters, both together.** The `button` seven are the highest-yield.

### 3.4 Framework size tokens leaked into the shared contract

Three places accept a framework's own token names alongside forge's:

- `adapter-common/src/components/Button/RecursicaButtonProps.ts:16` — `loaderSize?: "sm" | "md" | "lg" | "small" | "default" | "large"`
- `adapter-common/src/components/Loader/RecursicaLoaderProps.ts:10` — `size?: "sm" | "md" | "lg" | RecursicaSize`
- `adapter-common/src/types.ts:141` — `labelSize?: "default" | "small" | "md"`

**Severity is `drift`, not `breaks-silently`, for the first two** — and this corrects an earlier
assumption. Both adapters normalise all six spellings: `mantine-adapter/src/components/Loader/Loader.tsx:22-31`
and `mui-adapter/src/components/Loader/Loader.tsx:18-27` both define
`mapSize = {sm:"small", md:"default", lg:"large", small:"small", default:"default", large:"large"}`.
So `sm`/`md`/`lg` are working aliases, not silent fallbacks. They are still Mantine vocabulary in
a framework-agnostic contract, and they mean an app can be written in non-forge names that pass
review.

`labelSize`'s `"md"` is the exception and **is** `breaks-silently` — see §2.5.

**Fix: adapters.** Drop the aliases from the public unions; keep the map entries if back-compat
is needed.

### 3.5 `RecursicaAccordionProps.variant` is an untyped string on a component with no forge axis

`adapter-common/src/components/Accordion/RecursicaAccordionProps.ts:8` — `variant?: string`.

Forge `accordion` is `"variants": {}` — no axes at all. Both adapters default this to a Mantine
token: `mantine-adapter/src/components/Accordion/Accordion.tsx:31` and
`mui-adapter/src/components/Accordion/Accordion.tsx:51`, both `variant = "unstyled"`. MUI emits
it as `data-variant` (`:100`).

An unconstrained `string` on an axis forge does not define accepts any value and validates
nothing.

**Fix: adapters.** Either remove it or narrow it to the values actually styled.

### 3.6 `RECURSICA_COMPONENTS` omits three shipped components

`adapter-common/src/types.ts:179-228` lists 48 components and is described as the "Official list
of all components in Recursica". It omits `FileInput`, `FileUpload` and `Tree` — all three of
which ship in both adapters (`packages/{mantine,mui}-adapter/src/components/`) and all three of
which forge defines. It also omits `Box` and `Typography`, which ship in MUI only.

**Fix: adapters.**

### 3.7 Component directory casing differs between adapters

`packages/mantine-adapter/src/components/AutoComplete/` vs
`packages/mui-adapter/src/components/Autocomplete/`. Forge says `autocomplete`.

This is not cosmetic. `recursica-token-analyzer` derives a component's token prefix by
kebab-casing the directory name (`bin/cli.js:28-30, 81`), so Mantine's `AutoComplete` yields the
prefix `auto-complete`, which matches no forge variable. The analyzer falls back to the raw
prefix (`:177`) so nothing breaks today, but the component's own variables are attributed
outside its component entry.

**Fix: adapters.** Rename Mantine's directory to `Autocomplete`.

### 3.8 `data-*` attribute names differ between adapters for the same axis

Same axis, different attribute, so the two `.module.css` files cannot share a selector:

| Axis | Mantine | MUI |
|------|---------|-----|
| `label` `sizes` | `data-size` — `FormControlLayout.tsx:64` | `data-label-size` — `FormControlLayout.tsx:55,60` |
| `layouts` (Checkbox/Radio/Switch groups) | `data-layout` — e.g. `CheckboxGroup.tsx:108` | `data-layout` — `CheckboxGroup.tsx:131` |
| `layouts` (Slider) | `data-form-layout` — `Slider.tsx:223` | `data-form-layout` — `Slider.tsx:226` |

Each adapter is internally consistent — MUI's CSS does select `[data-label-size]`
(`FormControlLayout.module.css:65,71,77`) — so nothing is broken. But `layouts` is carried by
`data-layout` on three group components and `data-form-layout` on `Slider` and
`FormControlLayout`, within a single adapter.

**Fix: adapters.** Pick one attribute name per axis. Low risk, contained to `.module.css`.

### 3.9 `fullWidth` on `Button` — stripped by Mantine, honoured by MUI

Both adapters type it away: `Omit<…, "fullWidth">` at `Button.tsx:17` (Mantine) and `:16` (MUI).
Then:

- Mantine deletes it — `Button.tsx:56`: `delete restRecord["fullWidth"]`.
- MUI forwards it — `Button.tsx:118`: `fullWidth={!!restRecord.fullWidth}`.

Forge `button` has no `fill-width` axis (only `segmented-control` does), and
`skills/components/recursica-skill-button/SKILL.md:56` states: *"There is no full-width or fluid
axis. Do not stretch a button to its container."* The skill matches Mantine. MUI will stretch.

**Fix: MUI adapter** — delete the prop, matching Mantine and the skill.

### 3.10 MUI's `Tabs` carries an `inverted` axis Mantine does not

`mui-adapter/src/components/Tabs/Tabs.tsx:42` — `data-inverted={inverted || undefined}`. No
equivalent in `mantine-adapter/src/components/Tabs/Tabs.tsx`, and forge `tabs` has no such axis
(`styles` and a nested `orientation` only).

**Fix: adapters.** Remove, or add to both plus the contract.

### 3.11 `segmented-control` `fill-width` → prop `fullWidth`

Both adapters take `fullWidth` and forward it: `mantine-adapter/…/SegmentedControl.tsx:70,87` and
`mui-adapter/…/SegmentedControl.tsx:76,107`. Consistent across adapters, and
`skills/components/recursica-skill-segmented-control/SKILL.md:39-41` documents the axis with an
`On` column naming the component.

Forge exports **no CSS variables** for the `fill-width` axis, so it is purely structural.

Listed only because the name differs from forge (`fill-width` → `fullWidth`) and that is a
prop-name-table decision, not a defect. **No fix pending the table.**

---

## 4. CSS variable coverage (L5) — all 55 components

Method: `packages/recursica-token-analyzer/bin/cli.js` run inside each adapter package against
`packages/official-release/recursica_variables_scoped.css`, exactly as `prebuild` does. Both runs
report **0 broken variables** and exit 0.

```
mantine-adapter: totalDefined 2068, totalUsed 1444, totalMissing 0, totalUnused 502
mui-adapter:     totalDefined 2068, totalUsed 1303, totalMissing 0, totalUnused 617
```

Of the 2068 non-theme variables, **1567 are `ui-kit_components_*`** — the ones in scope here.

### 4.1 Correction: unused variables do **not** fail the build

`packages/recursica-token-analyzer/bin/cli.js:238-241` calls `process.exit(1)` **only** when
`missingVars.length > 0`. Unused variables print a `⚠️ WARNING` at `:202-208` and the process
exits 0.

This matters for how the numbers should be read. The build is not green *because* everything is
exempted — it is green because **unused was never a build failure**. 32 unaccounted variables in
Mantine and 145 in MUI are sitting in CI right now, warned about and passing. The root `CLAUDE.md`
states the analyzer "**fails the build** on any unexempted mismatch"; that is accurate for broken
and inaccurate for unused.

**Fix: no code change proposed without a decision** — see §7.

Two smaller notes on the same file, neither currently causing a wrong result:

- **Exemptions are global, not per-component** (`:68` — one `Set` for the whole run). A `recursica-ignore` in `Button.module.css` exempts that variable everywhere.
- **The unused grouping silently drops anything not matching `ui-kit_components_`** (`:174`). That is why the headline `502` reconciles to only 32 grouped variables: the remainder are `globals` and other non-component names. The 32 / 145 figures are the in-scope ones.

### 4.2 Per-component coverage

`applied` / `exempted` / `gap`, where **gap** = defined by forge, not applied, and not exempted —
i.e. what the analyzer warns about and CI lets through.

| Component | Forge vars | Mantine app/ex/gap | MUI app/ex/gap | Asymmetric |
|-----------|-----------:|--------------------|----------------|-----------|
| accordion | 11 | 11/0/0 | 11/0/0 | — |
| accordion-content | 18 | 18/0/0 | 18/0/0 | — |
| accordion-header | 24 | 22/2/0 | 22/2/0 | — |
| accordion-item | 6 | 6/0/0 | 6/0/0 | — |
| assistive-element | 16 | 16/0/0 | 16/0/0 | — |
| autocomplete | 40 | 37/3/0 | 38/2/0 | 1 MUI-only |
| avatar | 70 | 70/0/0 | 70/0/0 | — |
| badge | 25 | 25/0/0 | 25/0/0 | — |
| breadcrumb | 2 | 2/0/0 | 2/0/0 | — |
| **button** | 70 | 70/0/0 | **63/7/0** | **7 Mantine-only** |
| card | 34 | 34/0/0 | 34/0/0 | — |
| checkbox | 23 | 23/0/0 | 23/0/0 | — |
| checkbox-group | 7 | 7/0/0 | 7/0/0 | — |
| checkbox-item | 13 | 13/0/0 | 13/0/0 | — |
| chip | 47 | 38/9/0 | 38/9/0 | — |
| **date-picker** | 34 | 31/3/0 | **0/24/10** | **31 Mantine-only** |
| dropdown | 39 | 36/3/0 | 36/3/0 | — |
| **file-input** | 40 | **0/25/15** | **0/25/15** | — |
| **file-upload** | 32 | **0/22/10** | **0/22/10** | — |
| hover-card-popover | 19 | 18/1/0 | 18/1/0 | — |
| **label** | 31 | 29/2/0 | **27/2/2** | **2 Mantine-only** |
| link | 14 | 13/1/0 | 13/1/0 | — |
| loader | 10 | 10/0/0 | 10/0/0 | — |
| menu | 13 | 13/0/0 | 13/0/0 | — |
| menu-item | 35 | 34/1/0 | 34/1/0 | — |
| modal | 36 | 34/2/0 | 34/2/0 | — |
| number-input | 40 | 37/3/0 | 37/3/0 | — |
| pagination | 2 | 2/0/0 | 2/0/0 | — |
| panel | 35 | 35/0/0 | 35/0/0 | — |
| radio-button | 16 | 16/0/0 | 16/0/0 | — |
| radio-button-group | 7 | 7/0/0 | 7/0/0 | — |
| radio-button-item | 13 | 13/0/0 | 13/0/0 | — |
| read-only-field | 12 | 12/0/0 | 12/0/0 | — |
| segmented-control | 10 | 10/0/0 | 10/0/0 | — |
| segmented-control-item | 33 | 32/1/0 | 32/1/0 | — |
| slider | 73 | 73/0/0 | 73/0/0 | — |
| stepper | 67 | 67/0/0 | 67/0/0 | — |
| switch | 17 | 17/0/0 | 17/0/0 | — |
| switch-group | 7 | 7/0/0 | 7/0/0 | — |
| switch-item | 13 | 13/0/0 | 13/0/0 | — |
| **table** | 13 | 13/0/0 | **0/0/13** | **13 Mantine-only** |
| **table-cell** | 26 | 26/0/0 | **0/0/26** | **26 Mantine-only** |
| **table-footer** | 28 | 28/0/0 | **0/0/28** | **28 Mantine-only** |
| **table-header** | 34 | 34/0/0 | **0/0/34** | **34 Mantine-only** |
| tabs | 12 | 12/0/0 | 12/0/0 | — |
| tabs-item | 105 | 105/0/0 | 105/0/0 | — |
| text-field | 40 | 37/3/0 | 38/2/0 | 1 MUI-only |
| textarea | 32 | 29/3/0 | 29/3/0 | — |
| time-picker | 33 | 25/8/0 | 25/8/0 | — |
| timeline | 39 | 39/0/0 | 39/0/0 | — |
| timeline-bullet | 36 | 35/1/0 | 35/1/0 | — |
| toast | 33 | 30/3/0 | 30/3/0 | — |
| tooltip | 21 | 19/2/0 | 19/2/0 | — |
| **transfer-list** | 31 | **0/24/7** | **0/24/7** | — |
| tree | 30 | 30/0/0 | 30/0/0 | — |

**Tying L5 back to L1, as the guide requires.** Where an entire component's variable cluster is
unapplied, the variant is **unimplemented, not merely unstyled**:

- `file-input`, `file-upload`, `transfer-list` — 0 applied in both adapters. All forge variants unimplemented everywhere. → §2.1
- `date-picker` — 0 applied in MUI, 31 in Mantine. → §2.2
- `table`, `table-cell`, `table-header`, `table-footer` — 0 applied in MUI, all applied in Mantine, **nothing exempted**. → §2.3

**Exemption legitimacy.** Of the 546 exemption comments, **none** is a case of the framework
legitimately owning the property. 273 name variables that do not exist (§3.2). The largest
remaining blocks are the stub declarations for `file-input` (25+25), `file-upload` (22+22),
`transfer-list` (24+24) and MUI `date-picker` (24) — every one a deferred to-do, and each file
says so in its own header comment. That is the honest summary: the exemption mechanism here is
being used to record unfinished work, not to record a legitimate boundary.

---

## 5. Skill layer (L4) — the axis → prop-name column

The failure that started this work was a skill naming an axis where a prop was needed. Auditing
all 39 component skills for the "React prop" column:

**19 skills have it.** `assistive-element`, `autocomplete`, `avatar`, `badge`, `button`,
`date-picker`, `dropdown`, `label`, `number-input`, `read-only-field`, `slider`, `stepper`,
`tabs`, `text-field`, `textarea`, `time-picker`, `toast`, `transfer-list`, and
`segmented-control` (as an `On` column naming the owning component rather than the prop).

**5 skills have no axis rows at all** and legitimately need no column — `card`,
`hover-card-popover`, `modal`, `panel`, `tooltip`. Forge gives each of these `"variants": {}`.
Not findings.

**15 skills list axes with no statement of the prop that sets them.** Each is a live instance of
the original bug:

| Skill | Axes listed with no prop named |
|-------|-------------------------------|
| `accordion` | 4 rows |
| `breadcrumb` | 1 |
| `checkbox` | `selection-states`, `layouts`, `states` |
| `chip` | `selection-states` |
| `file-input` | `states`, `layouts` |
| `file-upload` | `states`, `layouts` |
| `link` | `states` |
| `loader` | `sizes` |
| `menu` | 2 rows |
| `pagination` | 1 |
| `radio-button` | `selection-states`, `layouts`, `states` |
| `switch` | `selection-states`, `layouts`, `states` |
| `table` | 4 rows |
| `timeline` | `selection-states`, `types` |
| `tree` | `selection-states` |

The values in all 15 are **correct against forge** — these skills are accurate about what
exists. The gap is only that they never say what to type. `recursica-skill-button/SKILL.md:36`
already carries the sentence the others need:

> **The third column is the React prop that sets the axis.** The axis name is the token
> inventory's; it is not a prop, and passing it as one is dropped silently by React.

**Fix: skill only, all 15.** Free, no runtime risk, and it is the direct fix for the reported bug.
Blocked on the prop-name table being approved (§7).

### 5.1 A seeded finding that is stale — retracted, not reported

The prior note that *"the `text-field` skill calls `side-by-side` the house default while the
adapter defaults to `stacked`"* is **not a discrepancy at `9cdf96c`**. Both skills are already
explicit and correct:

- `skills/components/recursica-skill-text-field/SKILL.md:47` — *"`formLayout` defaults to `stacked`, so the house rule is the one thing you must pass… `layouts` is the token axis name and is not a prop — writing `layouts="side-by-side"` is dropped silently by React, leaves the field stacked, and raises no error to tell you."*
- `skills/design-rules/recursica-skill-forms/SKILL.md:61-63` — same, at the design-rule level.

Both state the adapter default *and* the house rule *and* warn about the exact silent failure.
Recorded here so it is not re-reported.

### 5.2 The `loader` skill and the adapters disagree in a way forge cannot settle

`skills/components/recursica-skill-loader/SKILL.md` (§"What exists"): *"Three loader types are
documented outside the token inventory, with no tokens behind them — Oval, Bars, and Dots… **Do
not assume they are available.**"*

The skill is **right about forge**: `recursica_variables_scoped.css` defines exactly 10 `loader`
variables — `properties_indicator-color` plus `variants_sizes_{small,default,large}_properties_
{border-radius,size,thickness-size}`. No type axis.

The skill is **wrong about the adapters**: `adapter-common/src/components/Loader/RecursicaLoaderProps.ts:8`
declares `variant?: "oval" | "bars" | "dots"`, and both adapters style it —
`Loader.module.css` selects `[data-variant="oval"]` in both
(`mantine-adapter/…:16,31,46`, `mui-adapter/…:20,37,54`).

So the three layers disagree three ways: forge has no axis, both adapters ship one, and the skill
says do not use it. Per the fix order this is **not** a forge change — the adapter axis is
out-of-forge and the skill should say so precisely rather than tell an agent a working prop is
unavailable.

**Severity: doc-only.** **Fix: skill.** Reword to "these are adapter-level variants with no forge
tokens behind them; `variant` accepts them and both adapters style them."

---

## 6. Appendix — components with no forge entry

Confirmed against forge `430dddd`, and **none is a gap**:

- **Layout primitives, out of scope:** `Container`, `Flex`, `Grid`, `Stack`, `Group`, `Box`, `Layer`.
- **Covered by type styles, not missing:** `Typography`, `Text`, `Title`.
- **Covered by forge `hover-card-popover`, not missing:** `Popover`. Note the directory exists in `adapter-common` and `mantine-adapter` but **not** in `mui-adapter` — worth confirming that is intentional.
- **MUI-only:** `Box`, `Typography`. Mantine-only: `Popover`.
- Also present in both adapters but not in `RECURSICA_COMPONENTS`: `RecursicaThemeProvider` (infrastructure, correctly absent), and `FileInput` / `FileUpload` / `Tree` (§3.6).

No forge entry is proposed for any of these.

---

## 7. Decisions needed before any fix lands

1. **The axis → prop-name table.** Blocking every rename and the 15 skill fixes in §5. Posted separately.
2. **`labelAlignment` (§2.6)** — implement in MUI, or delete from the shared contract? It is not a forge axis, so deleting is the forge-aligned answer, but Mantine consumers may rely on it.
3. **The analyzer's `unused` warning (§4.1)** — should it fail the build? Turning it on today fails both adapters immediately (32 and 145 variables). It is the check that would have caught §2.3 the day it landed. Suggest: fix the dead exemptions and the table family first, then turn it on.
4. **Forge, and this is the only forge request in the report:** should `selection-states` be normalised so `tabs-item`, `timeline` and `timeline-bullet` use `selected`/`unselected` instead of `active`/`inactive`? `checkbox`'s `checked`/`unchecked`/`indeterminate` should stay as-is — it has a real third state. **This is a request to change the Figma source, not a patch**, since `recursica_ui-kit.json` is an export and a hand edit is overwritten on the next publish. Raising it and stopping.

5. **The chip error variant (§2.4).** Forge exports 14 error variables for `chip` and both
   adapters implement an `error` prop, while `recursica-skill-badges-chips/SKILL.md:105` forbids a
   chip from indicating an error, ever. A variant exists in three layers that the house rules
   prohibit in the fourth. Either the design rule relaxes or the variant leaves the Figma source.
   **A forge question, not a patch.**

---

## 8. Summary

Fix order is skill, then adapters, then — only after asking — forge.

| # | Finding | Severity | Fix at |
|---|---------|----------|--------|
| 2.1 | `file-input`, `file-upload`, `transfer-list` are stubs in both adapters; no skill says so | breaks-silently | skill, then adapters |
| 2.2 | MUI `DatePicker` is a stub; Mantine's is implemented | breaks-silently | skill, then MUI |
| 2.3 | MUI table family applies 0 of 101 forge vars, unexempted | breaks-silently | skill, then MUI |
| 2.4 | `chip` skill's reason for banning the error state is false; the ban itself is correct | drift | skill (applied) |
| 2.5 | `labelSize="md"` applies no width in Mantine | breaks-silently | adapters |
| 2.6 | `labelAlignment` works in Mantine, discarded by MUI | breaks-silently | adapters (needs §7.2) |
| 2.7 | MUI stacked label ignores `bottom-padding` and `min-height` | breaks-silently | MUI |
| 3.1 | `apps/figma-plugin/export/` ui-kit json stale — 10 components missing | drift | none (regenerated) |
| 3.2 | 273 of 546 exemptions name variables that do not exist | drift | adapters |
| 3.3 | 64 variables exempted in one adapter and applied in the other | drift | adapters |
| 3.4 | `sm`/`md`/`lg` framework tokens in the shared contract | drift | adapters |
| 3.5 | `RecursicaAccordionProps.variant?: string` on a component with no forge axis | drift | adapters |
| 3.6 | `RECURSICA_COMPONENTS` omits `FileInput`, `FileUpload`, `Tree` | drift | adapters |
| 3.7 | `AutoComplete` vs `Autocomplete` directory casing | drift | adapters |
| 3.8 | `data-size` vs `data-label-size`; `data-layout` vs `data-form-layout` | drift | adapters |
| 3.9 | `fullWidth` stripped by Mantine, honoured by MUI on `Button` | drift | MUI |
| 3.10 | MUI `Tabs` has an `inverted` axis Mantine and forge do not | drift | adapters |
| 3.11 | `fill-width` → `fullWidth` naming | pending table | — |
| 4.1 | Analyzer's `unused` warning does not fail the build; root `CLAUDE.md` says it does | drift | doc + §7.3 |
| 5 | 15 skills list axes with no prop name | breaks-silently | skill (blocked on table) |
| 5.2 | `loader` skill says oval/bars/dots are unavailable; both adapters ship them | doc-only | skill |

**6 breaks-silently, 14 drift, 1 doc-only, 1 pending the naming table.** Two forge questions are
raised (§7.4, §7.5) and neither is patched.

**By component, breaks-silently only:** `file-input`, `file-upload`, `transfer-list`,
`date-picker`, `table` (+`-cell`/`-header`/`-footer`), `label`. Plus the 15 skills in §5.

**Clean at every layer read** — forge values, contract, both adapters, and every forge variable
applied in both with nothing exempted and no gap. Note `avatar` reaches 70/70 in both adapters
but still carries 3 dead exemption comments per adapter (§3.2), and `loader`'s skill wording is a
separate finding (§5.2): `accordion-item`, `accordion-content`,
`assistive-element`, `avatar`, `badge`, `breadcrumb`, `card`, `checkbox`, `checkbox-group`,
`checkbox-item`, `loader` (see §5.2 for the skill wording), `menu`, `pagination`, `panel`,
`radio-button`, `radio-button-group`, `radio-button-item`, `read-only-field`,
`segmented-control`, `slider`, `stepper`, `switch`, `switch-group`, `switch-item`, `tabs`,
`tabs-item`, `timeline`, `tree`. **For the 25 components in the coverage table whose adapter
`.tsx` was not read, "clean" covers L1, L2 and L5 only.**
