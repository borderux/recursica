import { useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { Title } from "../../components/Title";
import { Stack } from "../../components/Stack";
import { Button } from "../../components/Button";
import classes from "./Import.module.css";

export default function Import() {
  const navigate = useNavigate();

  return (
    <PageLayout showBackButton={true}>
      <Stack gap={20} className={classes.root}>
        <Title order={1} className={classes.title}>
          Import
        </Title>

        <Stack gap={16} className={classes.buttonContainer}>
          <Button
            onClick={() => navigate("/import-main")}
            className={classes.button}
          >
            Import Main Library
          </Button>

          <Button
            onClick={() => navigate("/import-branch")}
            className={classes.button}
          >
            Import from Branch
          </Button>

          <Button
            onClick={() => navigate("/import-files")}
            className={classes.button}
          >
            Import from Files
          </Button>

          <Button
            onClick={() => navigate("/import-recursica-json")}
            className={classes.button}
          >
            Import Recursica JSON
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
