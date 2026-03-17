import { Routes, Route } from "react-router";
import { ApplyThemeProvider } from "../../context/ApplyThemeContext";
import { PageLayout } from "../../components/PageLayout";
import FileUploadStep from "./FileUploadStep";
import ScanningStep from "./ScanningStep";
import OverviewStep from "./OverviewStep";
import ReviewClashStep from "./ReviewClashStep";
import ReviewUnmatchedStep from "./ReviewUnmatchedStep";
import ReviewNonRecursicaStep from "./ReviewNonRecursicaStep";
import ApplyingStep from "./ApplyingStep";
import NextPageStep from "./NextPageStep";

export default function ApplyRecursicaTheme() {
  return (
    <ApplyThemeProvider>
      <PageLayout>
        <Routes>
          <Route index element={<FileUploadStep />} />
          <Route path="scanning" element={<ScanningStep />} />
          <Route path="overview" element={<OverviewStep />} />
          <Route path="review-clash" element={<ReviewClashStep />} />
          <Route path="review-unmatched" element={<ReviewUnmatchedStep />} />
          <Route
            path="review-non-recursica"
            element={<ReviewNonRecursicaStep />}
          />
          <Route path="applying" element={<ApplyingStep />} />
          <Route path="next-page" element={<NextPageStep />} />
        </Routes>
      </PageLayout>
    </ApplyThemeProvider>
  );
}
