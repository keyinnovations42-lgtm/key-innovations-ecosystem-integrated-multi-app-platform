import { CheckCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

export function TransferSuccessPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-success" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Transfer Successful!</CardTitle>
          <CardDescription>
            Your NFC transfer has been completed successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            The funds have been transferred securely. You can view the transaction details in your history.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/transactions">
              <Button variant="default" className="w-full sm:w-auto">
                View Transaction History
              </Button>
            </Link>
            <Link to="/wallet">
              <Button variant="outline" className="w-full sm:w-auto">
                Back to Wallet
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
