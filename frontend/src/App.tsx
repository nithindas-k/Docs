import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Landing } from './pages/Landing';
import { CategoryDetail } from './pages/CategoryDetail';
import { FileUploadPage } from './pages/FileUploadPage';
import { Persons } from './pages/Persons';
import { PersonDetail } from './pages/PersonDetail';
import { ItemDetail } from './pages/ItemDetail';
import { LinkedVaultDetail } from './pages/LinkedVaultDetail';
import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';
import { useAppSelector } from './features/hooks';

function RootRoute() {
  const token = useAppSelector((state) => state.auth.token);
  return token ? <Navigate to="/dashboard" replace /> : <Landing />;
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrowserRouter>
            <Routes>
              {/* Public Routes without Layout */}
              <Route path="/" element={<RootRoute />} />
              <Route path="/login" element={<Login />} />
              
              {/* Authenticated Routes with Sidebar/Navbar Layout */}
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Home />} />
                <Route path="/category/:id" element={<CategoryDetail />} />
                <Route path="/upload" element={<FileUploadPage />} />
                <Route path="/persons" element={<Persons />} />
                <Route path="/persons/:id" element={<PersonDetail />} />
                <Route path="/item/:id" element={<ItemDetail />} />
                <Route path="/linked/:connectionId" element={<LinkedVaultDetail />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toaster position="top-right" expand={true} duration={6000} closeButton={true} richColors />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
