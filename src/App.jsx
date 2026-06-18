import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ProtectedRoute from '@/components/ProtectedRoute';

import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';

import AppLayout from '@/components/layout/AppLayout';

// Lazy-loaded pages
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Lending = lazy(() => import('@/pages/Lending'));
const SupplyChain = lazy(() => import('@/pages/SupplyChain'));
const Skills = lazy(() => import('@/pages/Skills'));
const Education = lazy(() => import('@/pages/Education'));
const AIAssistant = lazy(() => import('@/pages/AIAssistant'));
const ImpactReport = lazy(() => import('@/pages/ImpactReport'));
const Resources = lazy(() => import('@/pages/Resources'));
const BlueprintBuilder = lazy(() => import('@/pages/BlueprintBuilder'));
const GrantsFinder = lazy(() => import('@/pages/GrantsFinder'));
const LenderMarketplace = lazy(() => import('@/pages/LenderMarketplace'));
const NationalDashboard = lazy(() => import('@/pages/NationalDashboard'));
const MentorMatch = lazy(() => import('@/pages/MentorMatch'));
const CollaborationOutreach = lazy(() => import('@/pages/CollaborationOutreach'));
const GrantAssistant = lazy(() => import('@/pages/GrantAssistant'));
const CryptoWeb3 = lazy(() => import('@/pages/CryptoWeb3'));
const Settings = lazy(() => import('@/pages/Settings'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin" />
    </div>
  );
}

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground font-medium">Loading EmpowerHub...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      <Route element={<ProtectedRoute unauthenticatedElement={<Navigate to="/login" replace />} />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
          <Route path="/lending" element={<Suspense fallback={<PageLoader />}><Lending /></Suspense>} />
          <Route path="/supply-chain" element={<Suspense fallback={<PageLoader />}><SupplyChain /></Suspense>} />
          <Route path="/skills" element={<Suspense fallback={<PageLoader />}><Skills /></Suspense>} />
          <Route path="/education" element={<Suspense fallback={<PageLoader />}><Education /></Suspense>} />
          <Route path="/advisor" element={<Suspense fallback={<PageLoader />}><AIAssistant /></Suspense>} />
          <Route path="/impact" element={<Suspense fallback={<PageLoader />}><ImpactReport /></Suspense>} />
          <Route path="/resources" element={<Suspense fallback={<PageLoader />}><Resources /></Suspense>} />
          <Route path="/blueprint" element={<Suspense fallback={<PageLoader />}><BlueprintBuilder /></Suspense>} />
          <Route path="/grants" element={<Suspense fallback={<PageLoader />}><GrantsFinder /></Suspense>} />
          <Route path="/lenders" element={<Suspense fallback={<PageLoader />}><LenderMarketplace /></Suspense>} />
          <Route path="/national" element={<Suspense fallback={<PageLoader />}><NationalDashboard /></Suspense>} />
          <Route path="/mentors" element={<Suspense fallback={<PageLoader />}><MentorMatch /></Suspense>} />
          <Route path="/outreach" element={<Suspense fallback={<PageLoader />}><CollaborationOutreach /></Suspense>} />
          <Route path="/grant-assistant" element={<Suspense fallback={<PageLoader />}><GrantAssistant /></Suspense>} />
          <Route path="/crypto-web3" element={<Suspense fallback={<PageLoader />}><CryptoWeb3 /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App