import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { PageLayout } from "../../components/PageLayout";
import { Title } from "../../components/Title";
import { Stack } from "../../components/Stack";
import { Button } from "../../components/Button";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { callPlugin } from "../../utils/callPlugin";
import classes from "./Import.module.css";

export default function Import() {
  const navigate = useNavigate();
  const [checkingComponents, setCheckingComponents] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkComponents = async () => {
      try {
        const { promise } = callPlugin("getAllComponents", {});
        const response = await promise;

        if (!mounted) return;

        if (response.success && response.data) {
          const data = response.data as {
            components: Array<{ id: string }>;
          };
          const existingComponents = data.components.filter((c) => c.id !== "");

          if (existingComponents.length === 0) {
            // No imported components, route directly to /import-main
            navigate("/import-main", { replace: true });
            return;
          }
        }
      } catch (err) {
        console.error("Failed to check existing components:", err);
      } finally {
        if (mounted) {
          setCheckingComponents(false);
        }
      }
    };

    checkComponents();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  if (checkingComponents) {
    return (
      <PageLayout showBackButton={true}>
        <Stack
          gap={20}
          className={classes.root}
          style={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
          }}
        >
          <LoadingSpinner />
        </Stack>
      </PageLayout>
    );
  }

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
            Add/Import Components
          </Button>

          {/* <Button
            onClick={() => navigate("/import-branch")}
            className={classes.button}
          >
            Import from Branch
          </Button> */}

          {/* <Button
            onClick={() => navigate("/import-files")}
            className={classes.button}
          >
            Import from Files
          </Button> */}

          <Button
            onClick={() => navigate("/import-recursica-json")}
            className={classes.button}
          >
            Import Theme
          </Button>
        </Stack>
      </Stack>
    </PageLayout>
  );
}
