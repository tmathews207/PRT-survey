import { lazy, Suspense } from 'react';
import { SurveyPage } from './pages/SurveyPage';

const AdminPage = lazy(() => import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })));

export function App() {
  const isAdmin = window.location.pathname.startsWith('/admin');
  return (
    <div className="app-shell">
      {isAdmin ? (
        <Suspense fallback={<div className="centered-screen" />}>
          <AdminPage />
        </Suspense>
      ) : (
        <SurveyPage />
      )}
    </div>
  );
}
