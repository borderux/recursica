# Releasing Packages

## Package Setup

Follow these guidelines when publishing your package for the first time

1. Make sure you package has a LICENSE file (MIT)
2. Make sure you include a CONTRIBUTING.md
3. Make sure you have an `.npmrc` copied from one of the other packages
4. Modify you package.json with the following
   1. `name`: Should be `@recursica/<package name>`
   2. `description`: Include a description
   3. `private`: Set to true to publish
   4. `homepage`: "https://github.com/borderux/recursica"
   5. `author`: hi@borderux.com
   6. `bugs`: `https://github.com/borderux/recursica/issues`
   7. `repository`: { "type": "git","url": "git+https://github.com/borderux/recursica.git" }

The most important is setting `private`: `false`, which will make it visible as publishable with Changesets
