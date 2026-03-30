import { Stack } from "../../components/Stack";
import { Title } from "../../components/Title";
import { LoadingSpinner } from "../../components/LoadingSpinner";

export default function ApplyingStep() {
  return (
    <Stack
      gap={20}
      style={{ alignItems: "center", justifyContent: "center", minHeight: 200 }}
    >
      <Title order={3}>Applying changes…</Title>
      <LoadingSpinner />
    </Stack>
  );
}
