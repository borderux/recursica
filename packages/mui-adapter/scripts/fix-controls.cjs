const { Project, SyntaxKind } = require("ts-morph");

const project = new Project();
project.addSourceFilesAtPaths("src/components/**/*.stories.tsx");

const files = project.getSourceFiles();

let modifiedCount = 0;

for (const sourceFile of files) {
  let modified = false;
  
  // Find const meta = ...
  const metaDecl = sourceFile.getVariableDeclaration("meta");
  if (!metaDecl) continue;

  const init = metaDecl.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
  if (!init) continue;

  const parametersProp = init.getProperty("parameters");
  if (parametersProp) {
    const text = parametersProp.getText();
    if (text.includes("include:")) {
      // If it's Link, we didn't add layer/withLayer earlier, let's skip for a sec or fix it manually
      continue;
    }
  }

  const keysToInclude = new Set(["layer", "withLayer"]);

  // Gather args
  const argsProp = init.getProperty("args");
  if (argsProp && argsProp.isKind(SyntaxKind.PropertyAssignment)) {
    const argsInit = argsProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (argsInit) {
      argsInit.getProperties().forEach(p => {
        if (p.isKind(SyntaxKind.PropertyAssignment)) {
          keysToInclude.add(p.getName());
        }
      });
    }
  }

  // Gather argTypes
  const argTypesProp = init.getProperty("argTypes");
  if (argTypesProp && argTypesProp.isKind(SyntaxKind.PropertyAssignment)) {
    const argTypesInit = argTypesProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (argTypesInit) {
      argTypesInit.getProperties().forEach(p => {
        if (p.isKind(SyntaxKind.PropertyAssignment)) {
          keysToInclude.add(p.getName());
        } else if (p.isKind(SyntaxKind.SpreadAssignment)) {
           const text = p.getExpression().getText();
           if (text === "formControlArgTypes") {
             ["formLayout", "labelSize", "labelAlignment", "labelOptionalText", "labelWithEditIcon", "error", "assistiveText", "required", "readOnly", "id"].forEach(k => keysToInclude.add(k));
           }
        }
      });
    }
  }

  // Force include standard props that might be missed if not in args/argTypes
  keysToInclude.add("children");
  keysToInclude.add("component");
  keysToInclude.add("variant");
  keysToInclude.add("size");
  keysToInclude.add("icon");
  keysToInclude.add("disabled");
  keysToInclude.add("href");
  keysToInclude.add("onClick");
  keysToInclude.add("onChange");
  keysToInclude.add("value");
  keysToInclude.add("checked");

  const includeArrayStr = JSON.stringify(Array.from(keysToInclude));

  if (!parametersProp) {
    init.addPropertyAssignment({
      name: "parameters",
      initializer: `{\n    controls: {\n      include: ${includeArrayStr},\n    },\n  }`
    });
    modified = true;
  } else if (parametersProp.isKind(SyntaxKind.PropertyAssignment)) {
    const pInit = parametersProp.getInitializerIfKind(SyntaxKind.ObjectLiteralExpression);
    if (pInit) {
      const controlsProp = pInit.getProperty("controls");
      if (!controlsProp) {
        pInit.addPropertyAssignment({
          name: "controls",
          initializer: `{\n      include: ${includeArrayStr},\n    }`
        });
        modified = true;
      }
    }
  }

  if (modified) {
    sourceFile.saveSync();
    modifiedCount++;
  }
}

console.log(`Updated ${modifiedCount} files.`);
