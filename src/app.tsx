import Center from '@arcblock/ux/lib/Center';
import { LocaleProvider } from '@arcblock/ux/lib/Locale/context';
import Spinner from '@arcblock/ux/lib/Spinner';
import { ToastProvider } from '@arcblock/ux/lib/Toast';
import { ThemeProvider } from '@mui/material';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import './app.css';
import ErrorFallback from './components/error-fallback';
import { SessionProvider, useIsRole } from './contexts/session';
import { translations } from './locales';
import { theme } from './theme/theme';

const Message = React.lazy(() => import('./pages/message'));
const Error = React.lazy(() => import('./components/error'));
const AdminInvitesPage = React.lazy(() => import('./pages/admin/invites'));
const AdminFortuneAnalysisPage = React.lazy(() => import('./pages/admin/fortune'));
const SettingsPage = React.lazy(() => import('./pages/admin/settings'));
const InvitesPage = React.lazy(() => import('./pages/invites'));
const InviteFriend = React.lazy(() => import('./pages/inviteFriend'));
const ReportDetail = React.lazy(() => import('./pages/reportDetail'));
const FortuneForm = React.lazy(() => import('./pages/fortune/fortune-form'));
const FortuneReport2024 = React.lazy(() => import('./pages/fortune/report-2024'));
const FortuneReportDragonYear = React.lazy(() => import('./pages/fortune/report-dragon-year'));
const FortuneReportSnakeYear = React.lazy(() => import('./pages/fortune/report-snake-year'));
const FortuneShare = React.lazy(() => import('./pages/fortune/share'));
const FortuneDragonYearShare = React.lazy(() => import('./pages/fortune/share-dragon'));
const FortuneSnakeYearShare = React.lazy(() => import('./pages/fortune/share-snake'));

const fallback = (
  <Center>
    <Spinner />
  </Center>
);

function App() {
  const isAdmin = useIsRole('admin', 'owner');

  return (
    <LocaleProvider translations={translations} fallbackLocale="en">
      <ErrorBoundary FallbackComponent={ErrorFallback} onReset={window.location.reload}>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/" element={<Error />} />
            <Route path="/message/:messageId" element={<Message />} />
            <Route path="/invites" element={<InvitesPage />} />
            <Route path="/report/details/:id" element={<ReportDetail />} />
            <Route path="/fortune/form/:type" element={<FortuneForm />} />
            <Route path="/fortune/2024" element={<Navigate to="/fortune/form/0" replace />} />
            <Route path="/fortune/report/0" element={<FortuneReport2024 />} />
            <Route path="/fortune/report/1" element={<FortuneReportDragonYear />} />
            <Route path="/fortune/report/2" element={<FortuneReportSnakeYear />} />
            <Route path="/fortune/share/0/:id" element={<FortuneShare />} />
            <Route path="/fortune/share/1/:id" element={<FortuneDragonYearShare />} />
            <Route path="/fortune/share/2/:id" element={<FortuneSnakeYearShare />} />
            <Route path="/invite-friend/:id" element={<InviteFriend />} />
            {isAdmin && <Route path="/admin/invites" element={<AdminInvitesPage />} />}
            {isAdmin && <Route path="/admin/fortune_analysis" element={<AdminFortuneAnalysisPage />} />}
            {isAdmin && <Route path="/admin/settings" element={<SettingsPage />} />}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </LocaleProvider>
  );
}

export default function WrappedApp() {
  // While the blocklet is deploy to a sub path, this will be work properly.
  const basename = window?.blocklet?.prefix || '/';

  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <SessionProvider serviceHost={basename}>
          <Router basename={basename}>
            <App />
          </Router>
        </SessionProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
