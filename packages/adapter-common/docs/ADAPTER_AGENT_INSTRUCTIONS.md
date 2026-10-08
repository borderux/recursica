# Adapter Agent Instructions

Instructions for the stateless per-adapter agents spawned when a change approved in the source-of-truth adapter is fanned out to the other adapters. Agents share no memory: the spawning prompt gives only the goal, the reference diff and the target repo, and tells the agent to follow this file. For the overall process see [`PIPELINE.md`](./PIPELINE.md).

## Required reading (in this order, before editing)

1. The component's `IMPLEMENTATION_NOTES.md` and `USAGE.md`.
2. The adapter repo's `docs/COMPONENT_DEV_GUIDE.md` and `docs/COMPONENT_STORYBOOK_GUIDE.md` (deltas), plus the canonical versions in `adapter-common/docs/` they link to.
3. The adapter repo's `CONTRIBUTING.md` and `AGENT.md`.
4. Any adapter-specific docs there (e.g. `OVERSTYLING.md`, `ARCHITECTURE.md`, `docs/STYLING_SYSTEM.md`).

Follow all rules and patterns in those documents.

## Testing

Prerequisite: the source-of-truth adapter's change and updated goldens are merged and released. If the reference story's golden is missing or stale, stop and report; do not proceed.

1. Run `npm run adapter-tester:source-of-truth -- --grep "<Component>"`. It diffs this adapter's live render against the source-of-truth goldens and checks story parity. Pass `--source-of-truth-version <version>` to pin the release carrying the new goldens if `latest` is not yet it.
2. Fix styling until the diff is within threshold. A divergence caused by a legitimate UI-kit difference may be accepted with `--approve-divergence`, and must be recorded in the component's `IMPLEMENTATION_NOTES.md` with the reason.
3. Capture this adapter's own goldens with `npm run adapter-tester:automated -- --grep "<Component>" --update-golden` (where the adapter has that script) and commit them with `manifest.json`. Review changes to unrelated goldens before committing; revert noise.
4. Run the full `npm run adapter-tester:automated` and `npm run adapter-tester:source-of-truth` suites, plus the repo's lint, type-check and build, before opening the PR. Do not run only a scoped subset.

## Rules

- Match the reference change's behavior using the target UI kit's idioms; do not copy library-specific code across.
- No silent fallbacks or defaults; let exceptions propagate.
- Record adapter-specific details and deviations from the reference in the component's `IMPLEMENTATION_NOTES.md`.
- Add one `.changeset/*.md` listing every affected package (1-2 sentences: what changed and the user-visible effect).
- Work on a new branch, commit, push and open a PR. Never merge to `main`.

## Report

Return the PR link, deviations from the reference, and anything that could not be matched.
