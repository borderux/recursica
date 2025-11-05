import { MemoryRouter, Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Import from "./pages/Import";
import Publish from "./pages/Publish";
import Publishing from "./pages/Publishing";
import PageManagement from "./pages/PageManagement";
import { Auth } from "./pages/Auth";
import { AuthProvider } from "./context/AuthProvider";
import { DebugConsoleProvider } from "./context/DebugConsoleProvider";
import { PluginPromptProvider } from "./context/PluginPromptProvider";

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
        <DebugConsoleProvider>
          <PluginPromptProvider>
            <MemoryRouter initialEntries={["/"]}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/import" element={<Import />} />
                <Route path="/publish" element={<Publish />} />
                <Route path="/publishing" element={<Publishing />} />
                <Route element={<Layout />}>
                  <Route path="auth" element={<Auth />} />
                  <Route path="page-management" element={<PageManagement />} />
                </Route>
              </Routes>
            </MemoryRouter>
          </PluginPromptProvider>
        </DebugConsoleProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
