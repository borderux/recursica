import React, { createContext, useContext, useEffect, useState } from "react";

interface FooterActionsContextValue {
  footerActions: React.ReactNode;
  setFooterActions: (actions: React.ReactNode) => void;
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
 * Pass a ReactNode and a dependency array — the footer updates when deps change,
 * and clears automatically when the component unmounts.
 *
 * @example
 * useFooterActions(
 *   <>
 *     <Button onClick={handleNext}>Next</Button>
 *     <Button onClick={handleCancel}>Cancel</Button>
 *   </>,
 *   [handleNext, handleCancel]
 * );
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useFooterActions(
  actions: React.ReactNode,
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
  const [footerActions, setFooterActions] = useState<React.ReactNode>(null);

  return (
    <FooterActionsContext.Provider value={{ footerActions, setFooterActions }}>
      {children}
    </FooterActionsContext.Provider>
  );
}
