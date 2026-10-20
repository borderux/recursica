# Adapter Agent Instructions

Instructions for the stateless per-adapter agents spawned when a change approved in the source-of-truth adapter is fanned out to the other adapters. Agents share no memory: the spawning prompt gives only the goal, the reference diff and the target repo, and tells the agent to follow this file. For the overall process see [`PIPELINE.md`](./PIPELINE.md).

## Required reading (in this order, before editing)

1. The component's `IMPLEMENTATION_NOTES.md` and `USAGE.md`.
2. The adapter repo's `docs/COMPONENT_DEV_GUIDE.md` and `docs/COMPONENT_STORYBOOK_GUIDE.md` (deltas), plus the canonical versions in `adapter-common/docs/` they link to.
3. The adapter repo's `CONTRIBUTING.md` and `AGENT.md`.
4. Any adapter-specific docs there (e.g. `OVERSTYLING.md`, `ARCHITECTURE.md`, `docs/STYLING_SYSTEM.md`).

Follow all rules and patterns in those documents.

## Porting the change

Do these in order. The reference is the source-of-truth (Mantine v8) release that carries the change and its goldens.

### 1. Build the expected-change list first

Before editing, derive the list of what changed from the source-of-truth's change history and git history: the release's changeset/CHANGELOG entries, and `git log` / `git diff <previous-release-tag>..<release-tag>` for the affected components. Write the list down (components, props/behavior, stories, tests, docs, goldens) and work through it item by item. Port everything on it before looking at anything else. Anything you change that is not on the list needs a stated reason in the PR.

### 2. Stories must match the source-of-truth

- Same story names (titles and exports) and same structure as the source-of-truth, with no extra wrappers or decorators around the component.
- Keep styling, DOM characteristics and functionality as close as the UI kit allows. Record unavoidable differences in `IMPLEMENTATION_NOTES.md`.
- If a story was removed from the source-of-truth, remove it from the adapter. Exception: keep it if `_SPECIFIC` appears in the story title (an adapter-specific story).

### 3. Port the unit tests

- Port every changed or added test, both regular and DOM-based, using the same test names as the source-of-truth.
- If a test was removed from the source-of-truth, remove it from the adapter. Exception: keep it if `_SPECIFIC` appears in the test title.

## Testing

Prerequisite: the source-of-truth adapter's change and updated goldens are merged and released. If the reference story's golden is missing or stale, stop and report; do not proceed.

1. Run `npm run adapter-tester:source-of-truth -- --grep "<Component>"`. It diffs this adapter's live render against the source-of-truth goldens and checks story parity. Pass `--source-of-truth-version <version>` to pin the release carrying the new goldens if `latest` is not yet it.
2. Fix styling until the diff is within threshold. A divergence caused by a legitimate UI-kit difference may be accepted with `--approve-divergence`, and must be recorded in the component's `IMPLEMENTATION_NOTES.md` with the reason.
3. Capture this adapter's own goldens with `npm run adapter-tester:automated -- --grep "<Component>" --update-golden` (where the adapter has that script) and commit them with `manifest.json`. Review changes to unrelated goldens before committing; revert noise.
4. Run the full `npm run adapter-tester:automated` and `npm run adapter-tester:source-of-truth` suites, plus the repo's unit tests (regular and DOM), lint, type-check and build, before opening the PR. Do not run only a scoped subset.
5. Investigate every failure; do not dismiss any as noise. For each one, determine whether it is caused by your change, pre-existing on `main` (compare against a clean `main` run), or flaky (re-run). Fix the ones your change caused. Record pre-existing and flaky ones, with evidence, in the PR description.

## When you cannot fully match

If you cannot bring a component's styling within threshold, or a unit test still fails and you cannot make the change needed to fix it:

- List each issue in the PR description: component/story/test, what fails, what you tried, and the suspected cause.
- Mark the PR as needing review and **not to be merged** (title prefix `[NEEDS REVIEW]`, and a line at the top of the description).
- Say so in your report.

## Rules

- Match the reference change's behavior using the target UI kit's idioms; do not copy library-specific code across.
- If the target repo depends on `@recursica/adapter-common`, bump it to the version the source-of-truth release uses and run `npm install`. (The Angular Material adapter has no such dependency.)
- No silent fallbacks or defaults; let exceptions propagate.
- Record adapter-specific details and deviations from the reference in the component's `IMPLEMENTATION_NOTES.md`.
- Add one `.changeset/*.md` listing every affected package (1-2 sentences: what changed and the user-visible effect).
- Work on a new branch, commit, push and open a PR. Never merge to `main`.

## Report

Return the PR link, the expected-change list with each item's status, deviations from the reference, and anything that could not be matched (with whether the PR is marked not-to-merge).
