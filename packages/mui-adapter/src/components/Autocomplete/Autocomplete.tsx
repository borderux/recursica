import React from "react";
import "./Autocomplete.module.css";

export type AutocompleteProps = React.HTMLAttributes<HTMLDivElement>;

export const Autocomplete: React.FC<AutocompleteProps> = (props) => {
  return <div {...props}>Autocomplete</div>;
};
