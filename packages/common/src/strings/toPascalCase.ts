/**
 * Transforms a string to Pascal case by capitalizing the first letter of each word
 * and removing separators. Handles various separators: whitespace, hyphen, dash, underscore.
 *
 * @param str - The input string to transform
 * @returns The string in Pascal case
 *
 * @example
 * toPascalCase('hello world') // 'HelloWorld'
 * toPascalCase('hello-world') // 'HelloWorld'
 * toPascalCase('hello_world') // 'HelloWorld'
 * toPascalCase('helloWorld') // 'HelloWorld'
 * toPascalCase('hello world-test_case') // 'HelloWorldTestCase'
 */
export function toPascalCase(str: string): string {
  if (!str || typeof str !== "string") {
    return "";
  }

  // Split by various separators: whitespace, hyphen, dash, underscore
  const words = str
    .split(/[\s\-_]+/) // Split by whitespace, hyphen, dash, underscore
    .filter((word) => word.length > 0) // Remove empty strings
    .map((word) => {
      // Handle camelCase by splitting on capital letters
      const camelCaseWords = word.split(/(?=[A-Z])/);
      return camelCaseWords
        .map((camelWord) => {
          // Capitalize first letter and lowercase the rest
          return (
            camelWord.charAt(0).toUpperCase() + camelWord.slice(1).toLowerCase()
          );
        })
        .join("");
    });

  return words.join("");
}
