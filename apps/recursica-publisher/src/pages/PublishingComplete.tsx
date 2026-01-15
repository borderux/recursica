import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import type { ExportPageResponseData } from "../plugin/services/pageExportNew";
import type { ComponentInfo } from "../services/github/githubService";

interface PublishingCompleteLocationState {
  exportData: ExportPageResponseData;
  pageIndex: number;
  mainBranchComponents?: ComponentInfo[];
}

export default function PublishingComplete() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const state = location.state as PublishingCompleteLocationState | null;
    if (state && state.exportData) {
      // Navigate to wizard with the export data and components
      navigate("/publishing-wizard", {
        state: {
          exportData: state.exportData,
          pageIndex: state.pageIndex,
          mainBranchComponents: state.mainBranchComponents,
        },
        replace: true,
      });
    } else {
      // If no state, redirect back to publish page
      // This shouldn't happen in normal flow, but handle it gracefully
      console.warn(
        "[PublishingComplete] No export data found in state, redirecting to publish page",
      );
      navigate("/publish", { replace: true });
    }
  }, [location.state, navigate]);

  return null;
}
