import React, { createContext, useContext, useEffect, useState } from "react";

export interface FooterActionDef {
  label: React.ReactNode;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  loading?: boolean;
}

export interface FooterActionsPayload {
  primary: FooterActionDef;
  secondary?: FooterActionDef[];
  onBackOverride?: () => void;
}

interface FooterActionsContextValue {
  footerActions: FooterActionsPayload | null;
  setFooterActions: (actions: FooterActionsPayload | null) => void;
}

const FooterActionsContext = createContext<FooterActionsContextValue>({
  footerActions: null,
  setFooterActions: () => {},
});

/**
 * Read the current footer actions from context.
 * Used by PageLayout to render page-specific buttons in the footer.
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFooterActionsState() {
  return useContext(FooterActionsContext);
}

/**
 * Hook for pages/components to dynamically place buttons in the footer.
 *
 * @example
 * useFooterActions(
 *   {
 *     secondary: [{ label: "Cancel", onClick: handleCancel }],
 *     primary: { label: "Next", onClick: handleNext }
 *   },
 *   [handleNext, handleCancel]
 * );
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFooterActions(
  actions: FooterActionsPayload | null,
  deps: React.DependencyList = [],
) {
  const { setFooterActions } = useContext(FooterActionsContext);

  useEffect(() => {
    setFooterActions(actions);
    return () => setFooterActions(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * Provider that holds the dynamic footer actions state.
 * Must be placed ABOVE page components that call useFooterActions.
 */
export function FooterActionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [footerActions, setFooterActions] =
    useState<FooterActionsPayload | null>(null);

  return (
    <FooterActionsContext.Provider value={{ footerActions, setFooterActions }}>
      {children}
    </FooterActionsContext.Provider>
  );
}
