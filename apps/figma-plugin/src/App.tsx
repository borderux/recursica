import {
  PublishChanges,
  Home,
  Auth,
  FileSynced,
  Error,
  Introduction,
  SyncTokens,
  SyncBrand,
  SyncIcons,
  SyncUiKit,
  TokensSyncSuccess,
  TokensSyncError,
  BrandSyncSuccess,
  BrandSyncError,
  BrandTokensNotPublished,
  IconsSyncSuccess,
  IconsSyncError,
  UiKitSyncError,
  UiKitBrandNotPublished,
  SyncComplete,
} from './pages';
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
        <Route path='introduction' element={<Introduction />} />
        <Route path='home' element={<Home />} />
        <Route path='sync-tokens' element={<SyncTokens />} />
        <Route path='sync-tokens-success' element={<TokensSyncSuccess />} />
        <Route path='sync-tokens-error' element={<TokensSyncError />} />
        <Route path='sync-brand' element={<SyncBrand />} />
        <Route path='sync-brand-success' element={<BrandSyncSuccess />} />
        <Route path='sync-brand-error' element={<BrandSyncError />} />
        <Route path='sync-brand-tokens-not-published' element={<BrandTokensNotPublished />} />
        <Route path='sync-icons' element={<SyncIcons />} />
        <Route path='sync-icons-success' element={<IconsSyncSuccess />} />
        <Route path='sync-icons-error' element={<IconsSyncError />} />
        <Route path='sync-ui-kit' element={<SyncUiKit />} />
        <Route path='sync-ui-kit-error' element={<UiKitSyncError />} />
        <Route path='sync-ui-kit-brand-not-published' element={<UiKitBrandNotPublished />} />
        <Route path='sync-complete' element={<SyncComplete />} />
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
  // Debug: Log environment variables
  console.log('VITE_PLUGIN_MODE:', import.meta.env.VITE_PLUGIN_MODE);
  console.log('VITE_RECURSICA_API_URL:', import.meta.env.VITE_RECURSICA_API_URL);
  console.log('VITE_RECURSICA_UI_URL:', import.meta.env.VITE_RECURSICA_UI_URL);
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
