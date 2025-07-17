import { Box, Breadcrumbs as MantineBreadcrumbs } from "@mantine/core";
import { forwardRef } from "react";
import { styles } from "./Breadcrumb.css";
import { type IconName, Icon } from "../Icons/Icon";
import { Anchor } from "../Anchor/Anchor";

export interface BreadcrumbItem {
  /** The text to display */
  text?: string;
  /** The icon to display */
  icon?: IconName;
  /** The href for the link */
  href?: string;
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: BreadcrumbItem[];
}

/** Breadcrumb component for navigation */
const ForwardedBreadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ items, ...props }, ref) => {
    const breadcrumbItems = items.map((item, index) => {
      const hasIcon = !!item.icon;
      const hasText = !!item.text;

      const content = (
        <>
          {hasIcon && <Icon name={item.icon!} size={16} />}
          {hasText && <span>{item.text}</span>}
        </>
      );

      if (item.href) {
        return (
          <Anchor
            underline="never"
            key={index}
            href={item.href}
            data-interactive="true"
          >
            {content}
          </Anchor>
        );
      }

      return (
        <Box key={index} component="span" data-interactive="false">
          {content}
        </Box>
      );
    });

    return (
      <MantineBreadcrumbs
        ref={ref}
        separator={<Icon name="slash_outline" size={16} />}
        classNames={styles}
        {...props}
      >
        {breadcrumbItems}
      </MantineBreadcrumbs>
    );
  },
);

ForwardedBreadcrumb.displayName = "Breadcrumb";

export const Breadcrumb = ForwardedBreadcrumb;
