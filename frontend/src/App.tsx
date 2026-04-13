import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TransferPage } from './pages/TransferPage';
import { WalletPage } from './pages/WalletPage';
import { TransactionHistoryPage } from './pages/TransactionHistoryPage';
import { SettingsPage } from './pages/SettingsPage';
import { TransferSuccessPage } from './pages/TransferSuccessPage';
import { TransferFailurePage } from './pages/TransferFailurePage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminSecurityAudit } from './pages/admin/AdminSecurityAudit';
import { ParentalWidgetPage } from './pages/ParentalWidgetPage';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from 'next-themes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const transferRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transfer',
  component: TransferPage,
});

const walletRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallet',
  component: WalletPage,
});

const transactionHistoryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transactions',
  component: TransactionHistoryPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: SettingsPage,
});

const transferSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transfer-success',
  component: TransferSuccessPage,
});

const transferFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/transfer-failure',
  component: TransferFailurePage,
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboard,
});

const adminSecurityAuditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/security-audit',
  component: AdminSecurityAudit,
});

const parentalWidgetRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/parental-widget',
  component: ParentalWidgetPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  transferRoute,
  walletRoute,
  transactionHistoryRoute,
  settingsRoute,
  transferSuccessRoute,
  transferFailureRoute,
  adminDashboardRoute,
  adminSecurityAuditRoute,
  parentalWidgetRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
