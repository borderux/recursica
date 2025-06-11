import { runMain } from "./cli";

// Run the CLI
runMain().catch((error) => {
  console.error("Error running recursica adapter:", error);
  process.exit(1);
});
