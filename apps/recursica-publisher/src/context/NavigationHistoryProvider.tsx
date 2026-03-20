import React, { createContext, useContext, useEffect, useRef } from "react";
import { useLocation } from "react-router";

interface NavigationHistoryContextValue {
  canGoBack: boolean;
}

const NavigationHistoryContext = createContext<NavigationHistoryContextValue>({
  canGoBack: false,
});

// eslint-disable-next-line react-refresh/only-export-components
export function useNavigationHistory() {
  return useContext(NavigationHistoryContext);
}

export function NavigationHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const historyDepth = useRef(0);

  useEffect(() => {
    historyDepth.current += 1;
  }, [location]);

  // canGoBack is true when we've navigated at least once beyond the initial route
  const canGoBack = historyDepth.current > 0;

  return (
    <NavigationHistoryContext.Provider value={{ canGoBack }}>
      {children}
    </NavigationHistoryContext.Provider>
  );
}
