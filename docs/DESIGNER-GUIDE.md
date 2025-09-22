# Designer Guide

## Welcome, Figma Designers

This guide is specifically designed for Figma designers who want to integrate seamlessly into the development workflow using Recursica. You'll learn how to become part of the development process by creating pull requests directly from your Figma designs.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Understanding Pull Requests](#understanding-pull-requests)
3. [Git Workflow Integration](#git-workflow-integration)
4. [Creating Pull Requests from Figma](#creating-pull-requests-from-figma)
5. [Previewing and Validating Changes](#previewing-and-validating-changes)
6. [Working with TypeScript Validation](#working-with-typescript-validation)
7. [Getting Help](#getting-help)

## Prerequisites

Before you can start using Recursica to create pull requests from Figma, you'll need to get set up with the necessary permissions and tools. This requires coordination with your repository administrators and development team.

### What You Need

- **Git Repository Access**: Write permissions to the project repository
- **Figma Plugin**: The Recursica Figma plugin installed and configured
- **Project Configuration**: The project must be set up with Recursica

### Getting Set Up

**Step 1: Request Repository Access**

- Contact your repository administrator or project lead
- Request write access to the repository (not just read access)
- You'll need this to create pull requests

**Step 2: Project Configuration**

- Verify that your project is configured with Recursica
- Check that Chromatic/PR previews are set up (recommended)
- Confirm TypeScript validation is enabled

## Understanding Pull Requests

### What is a Pull Request?

A **Pull Request (PR)** is a way to propose changes to a codebase. Think of it as a formal way to say "I've made some changes, please review them and add them to the main project." It's like submitting a draft for review before it gets published.

### Why Pull Requests Matter

Pull requests are important because they:

- **Enable Collaboration**: Allow team members to review and discuss changes before they're implemented
- **Maintain Quality**: Ensure all changes meet the project's standards and requirements
- **Provide Transparency**: Show exactly what changes are being made and why
- **Enable Testing**: Allow changes to be tested in a safe environment before going live
- **Create Documentation**: Provide a record of what was changed and when

### The Designer's Role in Pull Requests

As a designer using Recursica, you'll create pull requests to:

- **Update Design Tokens**: Change colors, typography, spacing, or other design variables
- **Add New Components**: Introduce new UI components to the design system
- **Modify Existing Components**: Update component designs and behaviors
- **Fix Design Issues**: Correct inconsistencies or improve accessibility

## Git Workflow Integration

### The Designer-Developer Workflow

With Recursica, the traditional wall between designers and developers is removed. Here's how the new workflow works:

```
Design Changes in Figma → Create Pull Request → Automatic Validation → Preview in Storybook → Developer Review → Merge → Live
```

**Key Benefits:**

- **No More Work Tickets**: Simple changes like color updates don't require creating tickets and assigning to developers
- **Direct Integration**: You become part of the development process, not just a stakeholder
- **Immediate Feedback**: See your changes live in Storybook before they're merged
- **Reduced Back-and-Forth**: Eliminate lengthy design-to-development handoff processes

## Creating Pull Requests from Figma

### Step 1: Make Your Design Changes

1. **Open Your Figma File**: Ensure it follows the proper naming conventions
2. **Make Your Changes**: Update colors, components, or design tokens as needed
3. **Test Your Changes**: Verify everything looks correct in Figma

### Step 2: Export with the Plugin

1. **Run the Recursica Plugin**: Use the plugin to export your changes
2. **Automatic PR Creation**: The plugin automatically creates a pull request with a title and description
3. **Follow the Link**: Click the link provided by the plugin to view your pull request

### Step 3: Verify Your Changes

1. **Check Storybook**: Use the PR preview link to see your changes in Storybook
2. **Compare with Figma**: Verify that the implementation matches your design exactly
3. **Notify Developers**: Let developers know your PR is ready for review

## Previewing and Validating Changes

### Storybook Integration

If your project is set up with **Chromatic** or **PR previews** (our recommended configuration), you'll be able to:

- **Preview Changes**: See your design changes live in Storybook
- **Compare with Figma**: Verify that the implementation matches your design exactly
- **Test Interactions**: Ensure components work as expected
- **Check Responsiveness**: Verify designs work across different screen sizes

### Visual Regression Testing

Chromatic automatically:

- **Captures Screenshots**: Takes screenshots of all your components
- **Compares Changes**: Shows exactly what changed between versions
- **Highlights Differences**: Makes it easy to spot unintended changes
- **Ensures Consistency**: Prevents design regressions

## Working with TypeScript Validation

### Automatic Type Checking

When your project uses TypeScript, Recursica provides automatic validation:

- **Variable Renaming Detection**: If you rename a design token in Figma, TypeScript will catch any code that still references the old name
- **Missing Variable Detection**: If you remove a variable, TypeScript will show build failures for any code using it
- **Type Safety**: Ensures all design tokens have proper types and are used correctly

### Fixing Build Failures

When TypeScript detects issues:

1. **Review the Error**: Check what variable or component is causing the problem
2. **Update Figma**: Fix the issue in your Figma file (rename variables, add missing ones, etc.)
3. **Re-export**: Use the plugin to export the corrected changes
4. **Verify Fix**: Check that the build now passes

### Benefits of TypeScript Validation

- **Confidence**: You can be sure your changes won't break the codebase
- **Self-Service**: Fix issues yourself without needing developer help
- **Quality Assurance**: Automatic checking prevents common mistakes
- **Faster Reviews**: Developers can focus on logic rather than catching basic errors

## Getting Help

### Common Issues

**Build Failures**

- Check TypeScript errors in the pull request
- Verify all variables exist in Figma
- Ensure naming conventions are followed

**Preview Issues**

- Check that Chromatic is properly configured
- Verify Storybook is building correctly
- Review component structure in Figma

**Git Workflow Problems**

- Ensure you have proper repository permissions
- Check that exported files are properly committed
- Verify communication with development team
