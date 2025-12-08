import { useEffect, useState } from "react";
import { useNavigate, Routes, Route, useLocation } from "react-router";
import PageLayout from "../components/PageLayout";
import { callPlugin } from "../utils/callPlugin";
import { ImportWizardProvider } from "../context/ImportWizardContext";
import Step1ComponentSelection from "./ImportWizard/Step1ComponentSelection";
import Step2DependencyOverview from "./ImportWizard/Step2DependencyOverview";
import Step3VariableCollections from "./ImportWizard/Step3VariableCollections";
import Step4Summary from "./ImportWizard/Step4Summary";
import Step5Importing from "./ImportWizard/Step5Importing";
import ExistingImport from "./ImportWizard/ExistingImport";

export default function ImportWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkForExisting = async () => {
      try {
        const { promise } = callPlugin("checkForExistingPrimaryImport", {});
        const response = await promise;

        if (response.success && response.data) {
          const data = response.data as {
            exists: boolean;
            pageId?: string;
            metadata?: unknown;
          };

          if (data.exists) {
            // Navigate to existing import page
            navigate("/import-wizard/existing", { replace: true });
          } else {
            // Navigate to step 1
            if (location.pathname === "/import-wizard") {
              navigate("/import-wizard/step1", { replace: true });
            }
          }
        } else {
          // Error checking, go to step 1
          navigate("/import-wizard/step1", { replace: true });
        }
      } catch (error) {
        console.error("Error checking for existing import:", error);
        navigate("/import-wizard/step1", { replace: true });
      } finally {
        setChecking(false);
      }
    };

    if (location.pathname === "/import-wizard") {
      checkForExisting();
    } else {
      setChecking(false);
    }
  }, [location.pathname, navigate]);

  if (checking && location.pathname === "/import-wizard") {
    return (
      <PageLayout showBackButton={true}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <p>Checking for existing import...</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <ImportWizardProvider>
      <PageLayout showBackButton={true}>
        <Routes>
          <Route path="/step1" element={<Step1ComponentSelection />} />
          <Route path="/step2" element={<Step2DependencyOverview />} />
          <Route path="/step3" element={<Step3VariableCollections />} />
          <Route path="/step4" element={<Step4Summary />} />
          <Route path="/step5" element={<Step5Importing />} />
          <Route path="/existing" element={<ExistingImport />} />
        </Routes>
      </PageLayout>
    </ImportWizardProvider>
  );
}
