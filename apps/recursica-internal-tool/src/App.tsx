import { MemoryRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import ResetMetadata from "./pages/ResetMetadata";
import PageManagement from "./pages/PageManagement";

function App() {
  return (
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="reset-metadata" element={<ResetMetadata />} />
          <Route path="page-management" element={<PageManagement />} />
        </Route>
      </Routes>
    </MemoryRouter>
  );
}

export default App;
