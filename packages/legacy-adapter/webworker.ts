import { processAdapter } from "./shared/common";
// 1. Listen for a message from the main application thread
// You can use self.addEventListener or the shorter self.onmessage
self.onmessage = (event) => {
  // Run the script
  const params = event.data;

  try {
    const { bundledJson, srcPath, project, overrides, iconsConfig, rootPath } =
      params;

    if (!bundledJson) throw new Error("bundledJson not found");

    // Use shared processing logic
    const files = processAdapter({
      bundledJsonContent: params.bundledJson,
      project,
      overrides,
      srcPath,
      rootPath,
      iconsJsonContent: params.iconsJson,
      iconsConfig,
    });

    // 3. Send the response back to the main thread
    console.log("...Worker sending response back:", files);
    self.postMessage(files);
  } catch (error) {
    console.error("Error generating theme:", error);
  }
};
