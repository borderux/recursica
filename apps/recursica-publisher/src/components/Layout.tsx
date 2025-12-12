import { Outlet, useLocation } from "react-router";
import PageLayout from "./PageLayout";

export default function Layout() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const showBackButton = !isHomePage;

  return (
    <PageLayout showBackButton={showBackButton}>
      <Outlet />
    </PageLayout>
  );
}
