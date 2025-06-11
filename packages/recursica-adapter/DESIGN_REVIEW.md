# Recursica Design Review

This document describes the process to upload new JSON files to the Recursica design system and review the changes in Chromatic.

## How to implement the Recursica design system

### Modify your package.json

```
"scripts": {
  "design-review": "tsx scripts/design-review.mjs"
}
```

## How to upload new JSON files

### Add JSON Files:

You can drop the JSON files at the root of the project, or if you want to keep them in a separate folder, you can do that too.  
You will need to update [recursica.json](recursica.json) to include the path where the JSON files are located.

### Run the design review process:

Run the design review process by running the [design-review.mjs](scripts/design-review.mjs) script.

```
npm run design-review
```

#### Go to the Chromatic Review Link:

The first time you run the design review process, you will need to go to the output of the script to find the Chromatic Review Link.  
New changes are available at <chromaticLink> to be reviewed.

#### Review Changes in Chromatic:

Chromatic will show you the visual differences detected.
Carefully review each change caused by your JSON modifications.
Approve or Deny the changes within the Chromatic UI.

#### Follow Up Based on Review:

Once you approved all changes in Chromatic:
Run again the design review process. If no files were changed, the script will ask you if you have already reviewed the changes in Chromatic.
Type 'y' and press enter.
A PR link will be generated and printed in the console. Open it in your browser and create a merge request.
