import { Outlet } from "react-router";
import { PageLayout } from "./PageLayout";

export default function Layout() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
