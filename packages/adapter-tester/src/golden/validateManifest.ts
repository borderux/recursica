import { Ajv } from "ajv";
import * as ajvFormatsModule from "ajv-formats";
import type { FormatsPlugin } from "ajv-formats";
import schema from "./manifest.schema.json" with { type: "json" };

// See validateFileConfig.ts for why `.default` has to be unwrapped by hand.
const addFormats = (ajvFormatsModule as unknown as { default: FormatsPlugin })
  .default;

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

/**
 * Validates a parsed `test/golden/manifest.json` against `manifest.schema.json`.
 * Throws with every violation listed — callers must not silently coerce or
 * drop invalid entries.
 */
export function validateGoldenManifest(data: unknown, path: string): void {
  if (validate(data)) return;

  const errors = (validate.errors ?? [])
    .map((error) => {
      const extra = error.params?.additionalProperty
        ? ` '${error.params.additionalProperty}'`
        : "";
      return `  - ${error.instancePath || "root"} ${error.message}${extra}`;
    })
    .join("\n");
  throw new Error(`Invalid ${path}:\n${errors}`);
}
