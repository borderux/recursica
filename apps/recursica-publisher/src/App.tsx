import { MemoryRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PageManagement from "./pages/PageManagement";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="auth" element={<Auth />} />
            <Route path="page-management" element={<PageManagement />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

export default App;
