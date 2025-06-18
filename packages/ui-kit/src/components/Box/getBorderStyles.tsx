import { type BoxBorders } from "./Box";
import { recursica } from "../../recursica/Recursica";

export function getBorderStyles(props: BoxBorders): React.CSSProperties {
  if (props.bw && props.bs && props.bc) {
    return {
      borderWidth: props.bw,
      borderColor: recursica[props.bc],
      borderStyle: props.bs,
    };
  }
  return {
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
