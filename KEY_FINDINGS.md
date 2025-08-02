# Key Findings

This document contains important discoveries and information about the Recursica project that should be referenced in future work.

## Project Overview

### What is Recursica
- **Purpose**: Recursica is a design system tooling ecosystem that bridges design and development
- **Core Function**: Automates conversion of Figma design tokens to production-ready code
- **Main Components**:
  - Figma Plugin (`apps/figma-plugin/`): Exports design tokens from Figma
  - Mantine Adapter (`packages/mantine-adapter/`): Converts tokens to Mantine themes
  - UI Kit (`packages/ui-kit-mantine/`): Generated component library

### Project Structure
- Uses Turborepo for monorepo management
- TypeScript throughout
- Main apps in `apps/` directory
- Shared packages in `packages/` directory
- Configuration uses `recursica.json` in project root

### Design Token Workflow
1. Designers create tokens in Figma using variables
2. Recursica plugin exports to JSON
3. Adapters transform JSON to code formats
4. Developers import generated themes/components

## Documentation Standards

### File Naming
- Documentation files use UPPER_SNAKE_CASE (e.g., `HELLO_WORLD.md`, `README.md`)
- Work journals in `history/` folder use kebab-case (e.g., `issue-161-hello-world-file.md`)

### Documentation Style
- Clear, concise language
- Include code examples where relevant
- Use markdown formatting (headers, lists, code blocks)
- Add emojis sparingly for visual appeal in user-facing docs
- Structure: Overview → Problem → Solution → Features → Usage

## Development Workflow

### Git Workflow
- Create feature branches for each issue: `feature/issue-XXX-description`
- Commit with clear messages referencing issues: `feat: description (fixes #XXX)`
- Document work in `history/` folder journals
- Update `PULL-REQUEST-DETAILS.md` before creating PR

### Code Review Process
1. Check proper documentation
2. Review code style and complexity
3. Verify testing/validation
4. Update related documentation
5. Create PR details summary

## Important Files

### Configuration
- `recursica.json`: Main project configuration
- `turbo.json`: Turborepo configuration
- `.markdownlint.json`: Markdown linting rules (if exists)

### Documentation
- `HELLO_WORLD.md`: User-friendly project introduction
- `README.md`: Technical project setup (currently generic)
- `CONTRIBUTING.md`: Contribution guidelines
- `PULL-REQUEST-DETAILS.md`: Current PR summary

### Figma Plugin Specifics
- Requires "ID variables" collection in Figma with:
  - `project-id`: Project identifier
  - `project-type`: One of `ui-kit-mantine | theme + tokens | icons`