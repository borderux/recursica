# Working In Figma

1. Always create a new Figma Design file that will be your temporary work area
2. Connect the UI Kit library to the file by clicking the Manage Libraries button, up near the File and Assets button in the upper-left
3. Search for the component you're working on and then create an instance of it in your new file. This allows you to view and play around with the component without making changes

## Reviewing Variables

It's always good to review all the Recursica variables by clicking outside of the frame you are looking at, then clicking the Variables button in the right-side panel. This shows you all possible variables.

## Base Components

Base components are inner-component that do not change and should not be used directly by the design. They are available in the `components/_base` folder for use in other components.

## Creating a new Component

1. Create the folder by the Component name, making sure it matches what is shown in Figma
2. Declare the FigmaProps interface. This is the set of properties shown in Figma set in the UI kit for the component. These should match in both naming convention and type. The goal is to create a set of common "props" and/or names that designers recognize and can alter to change the look and behavior of the component when doing UX testing.
3. Next you need to pick the base UI-kits props out. You want to pick out any prop that
   1. Alters the look or behavior beyond what is defined in Recursica. These will be un-styled and you will have no idea what will happen if used
   2. If two props have the same name (or basically the same behavior), you can keep both props and make sure the Recursica version takes precedence. This should be handled in the implementation.
4. Declare the final interface by and'ing the two interfaces together and export it.
5. Next you write the implementation of the component. The key things to remember are
   1. Always use forwardRefs (as long as the base component supports it)
   2. Pick out the Recursica props so they don't get passed down to the base component
   3. Transform propers from Recursica props to base component props and apply the changes to the base component that is called
   4. Always spread the rest of the props first, so your later prop overrides take precedence
   5. Use our styling convention for styling using Vanilla extract and the Mantine Styles Api. Make sure to apply it using classNames and make sure Recursica styles are declared first, followed by external classNames (to allow for over-styling)
