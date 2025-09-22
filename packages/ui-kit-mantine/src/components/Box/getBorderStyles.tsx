import { type BoxBorders } from "./Box";
import { recursica } from "../../recursica/Recursica";

export function getBorderStyles(props: BoxBorders): React.CSSProperties {
  const borderStyles: React.CSSProperties = {};
  if (props.br) {
    borderStyles.borderRadius = props.br ? recursica[props.br] : undefined;
  }
  if (props.bw && props.bs && props.bc) {
    borderStyles.borderWidth = props.bw;
    borderStyles.borderColor = recursica[props.bc];
    borderStyles.borderStyle = props.bs;
    return borderStyles;
  }

  return {
    ...borderStyles,
    borderRadius: props.br ? recursica[props.br] : undefined,
    borderTopWidth: props.btw ?? undefined,
    borderTopColor: props.btc ? recursica[props.btc] : undefined,
    borderTopStyle: props.bts,
    borderBottomWidth: props.bbw ?? undefined,
    borderBottomColor: props.bbc ? recursica[props.bbc] : undefined,
    borderBottomStyle: props.bbs,
    borderLeftWidth: props.blw ?? undefined,
    borderLeftColor: props.blc ? recursica[props.blc] : undefined,
    borderLeftStyle: props.bls,
    borderRightWidth: props.brw ?? undefined,
    borderRightColor: props.brc ? recursica[props.brc] : undefined,
    borderRightStyle: props.brs,
  };
}
