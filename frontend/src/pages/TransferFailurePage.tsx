import { XCircle } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';

export function TransferFailurePage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
      <Card className="text-center">
        <CardHeader>
          <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-12 h-12 text-destructive" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl">Transfer Failed</CardTitle>
          <CardDescription>
            We couldn't complete your NFC transfer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert variant="destructive">
            <AlertDescription>
              The transaction could not be processed. This may be due to insufficient funds, 
              network issues, or permission restrictions.
            </AlertDescription>
          </Alert>
          <p className="text-muted-foreground">
            Please check your wallet balance and settings, then try again.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/transfer">
              <Button variant="default" className="w-full sm:w-auto">
                Try Again
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
