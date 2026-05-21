import React from "react";
import "./Avatar.module.css";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement>;

export const Avatar: React.FC<AvatarProps> = (props) => {
  return <div {...props}>Avatar</div>;
};
