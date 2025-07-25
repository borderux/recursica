# Husky Git Hooks

This directory contains Git hooks managed by Husky to ensure code quality and consistency across the project.

## Hooks

### pre-commit

- **File**: `.husky/pre-commit`
- **Purpose**: Runs lint-staged to execute pre-commit checks on staged files
- **Command**: `npx lint-staged`

### pre-push

- **File**: `.husky/pre-push`
- **Purpose**: Validates that `PULL-REQUEST-DETAILS.md` has been updated before pushing
- **Script**: `.husky/check-pr-details.mjs`

## Pull Request Validation

The pre-push hook ensures that developers update `PULL-REQUEST-DETAILS.md` with their changes before pushing code. This helps maintain:

- **Documentation**: All changes are properly documented
- **Quality**: Forces developers to think through their changes
- **Consistency**: Standardized pull request format across the team

### How it works

1. **Branch Detection**: Automatically detects if you're on main/master (skips validation)
2. **File Check**: Verifies `PULL-REQUEST-DETAILS.md` exists
3. **Modification Check**: Compares the file against the main branch
4. **Guidance**: Provides helpful error messages directing users to use Cursor chat with `PULL-REQUEST-CHECK.txt`

### Error Messages

If validation fails, the hook provides clear guidance:

```
❌ ERROR: PULL-REQUEST-DETAILS.md has not been updated!

Please update PULL-REQUEST-DETAILS.md with the details of your changes before pushing.

💡 Tip: Use Cursor chat with PULL-REQUEST-CHECK.txt as context to ensure your pull request is fully valid.
   Reference: PULL-REQUEST-CHECK.txt

After updating the file, commit your changes and try pushing again.
```

## Development

### Adding New Hooks

1. Create the hook file in `.husky/`
2. Make it executable: `chmod +x .husky/hook-name`
3. Update this README with documentation

### Testing Hooks

- **pre-commit**: Stage files and run `git commit` to test
- **pre-push**: Try `git push` to test the validation

### Disabling Hooks (Temporary)

To bypass hooks temporarily:

```bash
git commit --no-verify  # Skip pre-commit
git push --no-verify    # Skip pre-push
```

**Note**: Only use `--no-verify` for legitimate development purposes, not to bypass quality checks.
