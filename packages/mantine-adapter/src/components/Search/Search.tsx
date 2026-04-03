import React from "react";

export type SearchProps = React.HTMLAttributes<HTMLDivElement>;

export const Search: React.FC<SearchProps> = (props) => {
  return <div {...props}>Search</div>;
};
