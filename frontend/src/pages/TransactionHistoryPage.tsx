import { useState } from 'react';
import { Download, Filter, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { SecurityIndicator } from '../components/SecurityIndicator';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetNfcTransactions, useGetSecurityVerificationResult } from '../hooks/useQueries';
import { NfcTransferType, NfcTransactionStatus, EncryptionStatus } from '../backend';

function TransactionRow({ tx, identity }: { tx: any; identity: any }) {
  const isReceived = identity && tx.to.toString() === identity.getPrincipal().toString();
  const amount = Number(tx.amount) / 100;
  const date = new Date(Number(tx.timestamp) / 1000000);

  // Fetch security verification for this transaction
  const { data: verification } = useGetSecurityVerificationResult(tx.id);

  return (
    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          isReceived ? 'bg-success/10' : 'bg-destructive/10'
        }`}>
          {isReceived ? (
            <TrendingUp className="w-6 h-6 text-success" />
          ) : (
            <TrendingDown className="w-6 h-6 text-destructive" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="font-medium">
              {isReceived ? 'Received' : 'Sent'}
            </p>
            <Badge variant="outline" className="text-xs">
              {tx.transferType === NfcTransferType.phoneToPhone ? 'Phone' : 'Card'}
            </Badge>
            {tx.status === NfcTransactionStatus.completed && (
              <Badge variant="default" className="text-xs bg-success">Completed</Badge>
            )}
            {tx.status === NfcTransactionStatus.pending && (
              <Badge variant="secondary" className="text-xs">Pending</Badge>
            )}
            {tx.status === NfcTransactionStatus.failed && (
              <Badge variant="destructive" className="text-xs">Failed</Badge>
            )}
            {verification && (
              <SecurityIndicator 
                status={verification.encryptionStatus} 
                size="sm" 
                showLabel={false}
              />
            )}
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {tx.description}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {date.toLocaleDateString()} at {date.toLocaleTimeString()}
          </p>
        </div>
      </div>
      <div className="text-right ml-4">
        <p className={`text-lg font-bold ${isReceived ? 'text-success' : 'text-destructive'}`}>
          {isReceived ? '+' : '-'}{amount.toFixed(2)}
        </p>
        <p className="text-xs text-muted-foreground">{tx.currency}</p>
      </div>
    </div>
  );
}

export function TransactionHistoryPage() {
  const { identity } = useInternetIdentity();
  const { data: transactions = [], isLoading } = useGetNfcTransactions();
  const [filterType, setFilterType] = useState<'all' | 'phone' | 'card'>('all');
  const [filterDirection, setFilterDirection] = useState<'all' | 'sent' | 'received'>('all');

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
        <Alert>
          <AlertDescription>
            Please login to view transaction history
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Filter transactions
  const filteredTransactions = transactions.filter(tx => {
    const isReceived = identity && tx.to.toString() === identity.getPrincipal().toString();
    
    if (filterType !== 'all') {
      const matchesType = filterType === 'phone' 
        ? tx.transferType === NfcTransferType.phoneToPhone 
        : tx.transferType === NfcTransferType.cardToPhone;
      if (!matchesType) return false;
    }

    if (filterDirection !== 'all') {
      const matchesDirection = filterDirection === 'received' ? isReceived : !isReceived;
      if (!matchesDirection) return false;
    }

    return true;
  });

  const handleExport = () => {
    const csv = [
      ['Date', 'Type', 'Direction', 'Amount', 'Currency', 'Status', 'Description'].join(','),
      ...filteredTransactions.map(tx => {
        const isReceived = identity && tx.to.toString() === identity.getPrincipal().toString();
        return [
          new Date(Number(tx.timestamp) / 1000000).toISOString(),
          tx.transferType === NfcTransferType.phoneToPhone ? 'Phone' : 'Card',
          isReceived ? 'Received' : 'Sent',
          (Number(tx.amount) / 100).toFixed(2),
          tx.currency,
          tx.status,
          tx.description,
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Transaction History</h1>
        <p className="text-muted-foreground">
          View and export your complete transaction history with security verification status
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''}
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="phone">Phone Only</SelectItem>
                  <SelectItem value="card">Card Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDirection} onValueChange={(value: any) => setFilterDirection(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={handleExport} disabled={filteredTransactions.length === 0}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-center text-muted-foreground py-8">Loading transactions...</p>
          ) : filteredTransactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No transactions found</p>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} identity={identity} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
