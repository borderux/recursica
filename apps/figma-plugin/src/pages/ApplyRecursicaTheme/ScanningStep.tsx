import { useEffect } from "react";
import { useApplyTheme } from "../../context/ApplyThemeContext";
import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function ScanningStep() {
  const { startScan } = useApplyTheme();

  useEffect(() => {
    startScan();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Stack
      gap={20}
      style={{ alignItems: "center", justifyContent: "center", minHeight: 200 }}
    >
      <Title order={3}>Scanning page variables…</Title>
      <LoadingSpinner />
    </Stack>
  );
}
