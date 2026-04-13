import { Wallet, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerWalletBalance, useGetNfcTransactions } from '../hooks/useQueries';
import { NfcTransferType } from '../backend';

export function WalletPage() {
  const { identity } = useInternetIdentity();
  const { data: walletBalance, isLoading: balanceLoading } = useGetCallerWalletBalance();
  const { data: transactions = [], isLoading: transactionsLoading } = useGetNfcTransactions();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
        <Alert>
          <AlertDescription>
            Please login to access your wallet
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const recentTransactions = transactions.slice(0, 5);
  const balance = walletBalance ? Number(walletBalance.balance) / 100 : 0;
  const currency = walletBalance?.currency || 'USD';

  // Calculate statistics
  const totalReceived = transactions
    .filter(tx => identity && tx.to.toString() === identity.getPrincipal().toString())
    .reduce((sum, tx) => sum + Number(tx.amount), 0) / 100;

  const totalSent = transactions
    .filter(tx => identity && tx.from.toString() === identity.getPrincipal().toString())
    .reduce((sum, tx) => sum + Number(tx.amount), 0) / 100;

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">My Wallet</h1>
        <p className="text-muted-foreground">
          Manage your digital wallet and view transaction history
        </p>
      </div>

      {/* Balance Card */}
      <Card className="mb-8 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0">
        <CardHeader>
          <CardDescription className="text-primary-foreground/80">Current Balance</CardDescription>
          <CardTitle className="text-4xl sm:text-5xl font-bold">
            {balanceLoading ? '...' : `${balance.toFixed(2)} ${currency}`}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Link to="/transfer" className="flex-1">
              <Button variant="secondary" className="w-full">
                <ArrowUpRight className="mr-2 h-4 w-4" />
                Transfer
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              +{totalReceived.toFixed(2)} {currency}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From all transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <TrendingDown className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              -{totalSent.toFixed(2)} {currency}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From all transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest wallet activity</CardDescription>
            </div>
            <Link to="/transactions">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {transactionsLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
          ) : recentTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No transactions yet</p>
              <Link to="/transfer">
                <Button>Make Your First Transfer</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentTransactions.map((tx) => {
                const isReceived = identity && tx.to.toString() === identity.getPrincipal().toString();
                const amount = Number(tx.amount) / 100;

                return (
                  <div key={tx.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isReceived ? 'bg-success/10' : 'bg-destructive/10'
                      }`}>
                        {isReceived ? (
                          <TrendingUp className="w-5 h-5 text-success" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {isReceived ? 'Received' : 'Sent'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {tx.transferType === NfcTransferType.phoneToPhone ? 'Phone' : 'Card'}
                          </Badge>
                          <p className="text-xs text-muted-foreground">
                            {new Date(Number(tx.timestamp) / 1000000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${isReceived ? 'text-success' : 'text-destructive'}`}>
                        {isReceived ? '+' : '-'}{amount.toFixed(2)} {tx.currency}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {tx.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
