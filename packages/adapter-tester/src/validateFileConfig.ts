import { Ajv } from "ajv";
import * as ajvFormatsModule from "ajv-formats";
import type { FormatsPlugin } from "ajv-formats";
import schema from "./adapter-tester.schema.json" with { type: "json" };

// ajv-formats ships an ESM-style `export default` on a CJS build with no
// `"type"` field, which under `moduleResolution: NodeNext` TS resolves to
// the raw module namespace instead of unwrapping the default — a known
// ajv-formats/TS interop gap, not a version mismatch.
const addFormats = (ajvFormatsModule as unknown as { default: FormatsPlugin })
  .default;

const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const validate = ajv.compile(schema);

/**
 * Validates a parsed `adapter-tester.config.json` against
 * `adapter-tester.schema.json`. Throws with every violation listed — callers
 * must not silently coerce or drop invalid fields.
 */
export function validateFileConfig(data: unknown, path: string): void {
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
