import { PublishChanges, Home, Auth, FileSynced, Error } from './pages';
import { MemoryRouter, Route, Routes } from 'react-router';
import { ThemeProvider, Themes } from '@recursica/ui-kit-mantine';
import { RepositoryProvider } from './context/Repository/RepositoryProvider';
import { FigmaProvider } from './context';
import { useGTMTracking } from './hooks';
import { useVersionCheck } from './hooks/useVersionCheck';
import { UpdateNotification } from './components';

// Component that tracks route changes inside the MemoryRouter context
function AppRoutes() {
  useGTMTracking();
  const { showUpdateNotification, updateInfo, dismissUpdateNotification, downloadUpdate } =
    useVersionCheck();

  return (
    <>
      <Routes>
        <Route path='home' element={<Home />} />
        <Route path='auth' element={<Auth />} />
        <Route path='file-synced' element={<FileSynced />} />
        <Route path='publish/*' element={<PublishChanges />} />
        <Route path='error' element={<Error />} />
      </Routes>
      {showUpdateNotification && updateInfo && (
        <UpdateNotification
          updateInfo={updateInfo}
          onDismiss={dismissUpdateNotification}
          onDownload={downloadUpdate}
        />
      )}
    </>
  );
}

function App() {
  return (
    <ThemeProvider themeClassname={Themes.Default.Light}>
      <FigmaProvider>
        <RepositoryProvider>
          <MemoryRouter initialEntries={['/home']}>
            <AppRoutes />
          </MemoryRouter>
        </RepositoryProvider>
      </FigmaProvider>
    </ThemeProvider>
  );
}

export default App;
