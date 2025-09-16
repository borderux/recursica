import { MemoryRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ResetMetadata from "./pages/ResetMetadata";
import PageManagement from "./pages/PageManagement";
import ThemeSettings from "./pages/ThemeSettings";
import { PluginProvider } from "./context/PluginProvider";

function App() {
  return (
    <PluginProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="reset-metadata" element={<ResetMetadata />} />
            <Route path="page-management" element={<PageManagement />} />
            <Route path="theme-settings" element={<ThemeSettings />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </PluginProvider>
  );
}

export default App;
