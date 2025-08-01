# Releasing Packages

## Changesets

Versioning and releases are managed by the awesome Changesets package. For more information and details on how this works, check out https://github.com/changesets/changesets

## Package Setup

Follow these guidelines when publishing your package for the first time

1. Make sure you package has a LICENSE file (MIT)
2. Make sure you include a CONTRIBUTING.md
3. Make sure you have an `.npmrc` copied from one of the other packages
4. Modify you package.json with the following
   1. `name`: Should be `@recursica/<package name>`
   2. `description`: Include a description
   3. `private`: Set to true to publish. _WARN_ Otherwise it will be ignored
   4. `homepage`: "https://github.com/borderux/recursica"
   5. `author`: hi@borderux.com
   6. `bugs`: `https://github.com/borderux/recursica/issues`
   7. `repository`: { "type": "git","url": "git+https://github.com/borderux/recursica.git" }

The most important is setting `private`: `false`, which will make it visible as publishable with Changesets

## Creating a new version

From your terminal, run the command `npx @changesets/cli`. This will walk through you the package you want to create a new version for and document your change.

Changesets will run a CI action that creates a new PR called `Version Packages`. This will accumulate all your versions and changes until your ready to release.

## Making a release

To make a release, just merge the `Version Packages` PR into main and Changesets will publish to npm for you and create a `Release` in Github at https://github.com/borderux/recursica/releases

### Additional Issues/Notes

1. You may see an issue in your `Version Packages` PR that the check does not properly run. This was solved by using a Personal Access Token (PAT) as the GITHUB_TOKEN, but you may still see this issue sometimes. To solve it, just close the PR and re-open it and it should work
