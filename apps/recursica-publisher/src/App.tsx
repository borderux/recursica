import { MemoryRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import PageManagement from "./pages/PageManagement";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        boxSizing: "border-box",
        margin: 0,
        padding: 0,
      }}
    >
      <style>
        {`
          * {
            box-sizing: border-box;
          }
          html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          #root {
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
        `}
      </style>
      <AuthProvider>
        <MemoryRouter initialEntries={["/"]}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<Layout />}>
              <Route path="auth" element={<Auth />} />
              <Route path="page-management" element={<PageManagement />} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
