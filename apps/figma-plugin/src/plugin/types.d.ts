export type VariableCastedValue = string | boolean | number;
export interface VariableReferenceValue {
  collection: string;
  name: string;
}

export interface VariableValue {
  collection: string;
  description: string;
  mode: string;
  name: string;
  type: string;
  value: VariableCastedValue | VariableReferenceValue;
}

export interface TypographyValue {
  variableName: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: {
    value: number;
    alias: string;
  };
  letterSpacing: LetterSpacing;
  lineHeight: LineHeight;
  textCase: string;
  textDecoration: string;
}

export interface EffectValue {
  variableName: string;
  effects: {
    type: string;
    color: {
      r: number;
      g: number;
      b: number;
      a: number;
    };
    offset: {
      x: number;
      y: number;
    };
    radius: number;
    spread: number;
  }[];
}

export interface CollectionType {
  [key: string]: EffectValue | TypographyValue | VariableValue;
}
/**
 * Represents the variable JSON collection
 */
export type VariableJSONCollection = {
  projectId: string;
  pluginVersion: string;
  tokens: CollectionType;
  themes: Record<string, CollectionType>;
  uiKit: CollectionType;
};

export type ExportedVariableValue = EffectValue | TypographyValue | VariableValue;
