import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { AppRoutes } from '@/routes/AppRoutes';

export function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            gutter={8}
            toastOptions={{
              duration: 4000,
              style: {
                background: 'rgb(var(--surface))',
                color: 'rgb(var(--text))',
                border: '1px solid rgb(var(--border))',
                borderRadius: '12px',
                fontSize: '13px',
                padding: '10px 14px',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
              },
              success: {
                iconTheme: { primary: '#a3ec0d', secondary: '#0a0a0b' },
              },
            }}
          />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
