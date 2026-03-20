import { useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { Title } from "../../components/Title";
import { Stack } from "../../components/Stack";
import { Button } from "../../components/Button";
import classes from "./Admin.module.css";

export default function Admin() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <Stack gap={20} className={classes.root}>
        <Title order={1} className={classes.title}>
          Admin
        </Title>

        <Stack gap={16} className={classes.buttonContainer}>
          <Button
            onClick={() => navigate("/publish-init")}
            className={classes.button}
          >
            Init Library
          </Button>

          <Button
            onClick={() => navigate("/import-recursica-json")}
            className={classes.button}
          >
            Import Theme
          </Button>

          <Button
            onClick={() => navigate("/edit-metadata")}
            className={classes.button}
          >
            Edit Metadata
          </Button>

          <Button onClick={() => navigate("/test")} className={classes.button}>
            Test
          </Button>

          <Button
            onClick={() => navigate("/publish")}
            className={classes.button}
          >
            Publish
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
