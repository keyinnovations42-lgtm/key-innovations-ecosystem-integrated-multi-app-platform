import { useState } from 'react';
import { Shield, TrendingUp, AlertTriangle, CheckCircle, XCircle, Filter, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { SecurityIndicator } from '../../components/SecurityIndicator';
import { AdminAuth } from '../../components/AdminAuth';
import { useGetSecurityAuditLogs, useGetSecurityAuditSummary } from '../../hooks/useQueries';
import { EncryptionStatus, NfcTransactionStatus, NfcTransferType } from '../../backend';

export function AdminSecurityAudit() {
  const { data: auditLogs = [], isLoading } = useGetSecurityAuditLogs();
  const { data: summary } = useGetSecurityAuditSummary();
  const [filterStatus, setFilterStatus] = useState<'all' | EncryptionStatus>('all');
  const [filterType, setFilterType] = useState<'all' | NfcTransferType>('all');

  // Filter logs
  const filteredLogs = auditLogs.filter(log => {
    if (filterStatus !== 'all' && log.encryptionStatus !== filterStatus) return false;
    if (filterType !== 'all' && log.transferType !== filterType) return false;
    return true;
  });

  const handleExport = () => {
    const csv = [
      ['Timestamp', 'Transaction ID', 'Transfer Type', 'Status', 'Encryption Status', 'From', 'To', 'Amount', 'Currency', 'Verification Details'].join(','),
      ...filteredLogs.map(log => [
        new Date(Number(log.timestamp) / 1000000).toISOString(),
        log.transactionId,
        log.transferType === NfcTransferType.phoneToPhone ? 'Phone-to-Phone' : 'Card-to-Phone',
        log.status,
        log.encryptionStatus,
        log.from.toString(),
        log.to.toString(),
        (Number(log.amount) / 100).toFixed(2),
        log.currency,
        `"${log.verificationDetails.replace(/"/g, '""')}"`,
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Security Audit Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor encryption verification and transaction security logs
          </p>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Logs</CardDescription>
                <CardTitle className="text-3xl">{Number(summary.totalLogs)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  All transactions
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Verified</CardDescription>
                <CardTitle className="text-3xl text-success">{Number(summary.verifiedCount)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle className="w-4 h-4 text-success" />
                  {summary.totalLogs > 0n 
                    ? `${Math.round((Number(summary.verifiedCount) / Number(summary.totalLogs)) * 100)}%`
                    : '0%'} success rate
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Unverified</CardDescription>
                <CardTitle className="text-3xl text-warning">{Number(summary.unverifiedCount)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Pending verification
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Failed</CardDescription>
                <CardTitle className="text-3xl text-destructive">{Number(summary.failedCount)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <XCircle className="w-4 h-4 text-destructive" />
                  Verification failed
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Transfer Type Stats */}
        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Phone-to-Phone Transfers</CardTitle>
                <CardDescription>
                  {Number(summary.phoneToPhoneCount)} transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{Number(summary.phoneToPhoneCount)}</div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Card-to-Phone Transfers</CardTitle>
                <CardDescription>
                  {Number(summary.cardToPhoneCount)} transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{Number(summary.cardToPhoneCount)}</div>
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Audit Logs Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <CardTitle>Security Audit Logs</CardTitle>
                <CardDescription>
                  {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''} • Real-time encryption verification
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                  <SelectTrigger className="w-[160px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value={EncryptionStatus.verified}>Verified</SelectItem>
                    <SelectItem value={EncryptionStatus.unverified}>Unverified</SelectItem>
                    <SelectItem value={EncryptionStatus.failed}>Failed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value={NfcTransferType.phoneToPhone}>Phone-to-Phone</SelectItem>
                    <SelectItem value={NfcTransferType.cardToPhone}>Card-to-Phone</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" onClick={handleExport} disabled={filteredLogs.length === 0}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-muted-foreground py-8">Loading audit logs...</p>
            ) : filteredLogs.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No audit logs found</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Encryption</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => {
                      const date = new Date(Number(log.timestamp) / 1000000);
                      const amount = Number(log.amount) / 100;

                      return (
                        <TableRow key={log.id}>
                          <TableCell className="text-xs">
                            {date.toLocaleDateString()}<br />
                            {date.toLocaleTimeString()}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {log.transactionId.slice(0, 12)}...
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {log.transferType === NfcTransferType.phoneToPhone ? 'Phone' : 'Card'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {log.status === NfcTransactionStatus.completed && (
                              <Badge variant="default" className="text-xs bg-success">Success</Badge>
                            )}
                            {log.status === NfcTransactionStatus.failed && (
                              <Badge variant="destructive" className="text-xs">Failed</Badge>
                            )}
                            {log.status === NfcTransactionStatus.pending && (
                              <Badge variant="secondary" className="text-xs">Pending</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <SecurityIndicator status={log.encryptionStatus} size="sm" />
                          </TableCell>
                          <TableCell className="font-medium">
                            {amount.toFixed(2)} {log.currency}
                          </TableCell>
                          <TableCell className="max-w-xs">
                            <p className="text-xs text-muted-foreground truncate" title={log.verificationDetails}>
                              {log.verificationDetails}
                            </p>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminAuth>
  );
}
