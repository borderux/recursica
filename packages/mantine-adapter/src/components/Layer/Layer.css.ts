import { recursica } from "@recursica/official-release";
import { style } from "@vanilla-extract/css";

export const styles = style({
  border: "none", // Reset border styling
  borderStyle: "solid", // Hard-coded to solid
  backgroundColor: recursica.themes["layer/property/surface"] || "unset",
  borderColor: recursica.themes["layer/property/border-color"] || "unset",
  borderRadius: recursica.themes["layer/property/border-radius"] || "unset",
  borderWidth: recursica.themes["layer/property/border-thickness"] || "unset",
  // elevation: recursica.themes["layer/property/elevation"],
  padding: recursica.themes["layer/property/padding"] || "unset",
});
