import { addons } from "storybook/manager-api";
import RecursicaTheme from "../theme/RecursicaTheme";

export interface ManagerConfigOptions {
  /** If true, applies the unified RecursicaTheme to the Storybook manager UI. Defaults to true. */
  useRecursicaTheme?: boolean;
}

export const createManagerConfig = (options: ManagerConfigOptions = {}) => {
  const { useRecursicaTheme = true } = options;

  if (useRecursicaTheme) {
    addons.setConfig({
      theme: RecursicaTheme,
    });
  }
};
