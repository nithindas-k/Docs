import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './features/store';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { CategoryDetail } from './pages/CategoryDetail';
import { FileUploadPage } from './pages/FileUploadPage';
import { Persons } from './pages/Persons';
import { PersonDetail } from './pages/PersonDetail';

import { ItemDetail } from './pages/ItemDetail';

import { ThemeProvider } from 'next-themes';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <BrowserRouter>
            <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/category/:id" element={<CategoryDetail />} />
              <Route path="/upload" element={<FileUploadPage />} />
              <Route path="/persons" element={<Persons />} />
              <Route path="/persons/:id" element={<PersonDetail />} />
              <Route path="/item/:id" element={<ItemDetail />} />
            </Route>
            </Routes>
          </BrowserRouter>
          <Toaster position="top-center" richColors />
      </ThemeProvider>
    </Provider>
  );
}


export default App;
