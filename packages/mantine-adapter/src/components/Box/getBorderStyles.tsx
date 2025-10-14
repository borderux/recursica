import { type BoxBorders } from "./Box";
import { recursica } from "@recursica/official-release";
import { getRecursicaColor } from "../../utils";

export function getBorderStyles(props: BoxBorders): React.CSSProperties {
  if (props.bw && props.bs && props.bc) {
    return {
      borderWidth: props.bw,
      borderColor: getRecursicaColor(props.bc),
      borderStyle: props.bs,
    };
  }
  return {
    borderRadius: props.br ? recursica.tokens[props.br] : undefined,
    borderTopWidth: props.btw ?? undefined,
    borderTopColor: props.btc ? getRecursicaColor(props.btc) : undefined,
    borderTopStyle: props.bts,
    borderBottomWidth: props.bbw ?? undefined,
    borderBottomColor: props.bbc ? getRecursicaColor(props.bbc) : undefined,
    borderBottomStyle: props.bbs,
    borderLeftWidth: props.blw ?? undefined,
    borderLeftColor: props.blc ? getRecursicaColor(props.blc) : undefined,
    borderLeftStyle: props.bls,
    borderRightWidth: props.brw ?? undefined,
    borderRightColor: props.brc ? getRecursicaColor(props.brc) : undefined,
    borderRightStyle: props.brs,
  };
}
