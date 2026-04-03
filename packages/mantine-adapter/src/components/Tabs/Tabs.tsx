import React from "react";

export type TabsProps = React.HTMLAttributes<HTMLDivElement>;

export const Tabs: React.FC<TabsProps> = (props) => {
  return <div {...props}>Tabs</div>;
};
