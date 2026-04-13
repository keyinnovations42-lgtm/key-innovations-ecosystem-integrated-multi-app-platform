import { useState, useEffect } from 'react';
import { Save, Shield, CreditCard, Smartphone, DollarSign } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerNfcPermission, useUpdateCallerNfcPermission, useGetCallerNfcSettings, useUpdateCallerNfcSettings } from '../hooks/useQueries';
import { toast } from 'sonner';

export function SettingsPage() {
  const { identity } = useInternetIdentity();
  const { data: permissions } = useGetCallerNfcPermission();
  const { data: settings } = useGetCallerNfcSettings();
  const updatePermissions = useUpdateCallerNfcPermission();
  const updateSettings = useUpdateCallerNfcSettings();

  const [cardScanConsent, setCardScanConsent] = useState(false);
  const [phoneTransferConsent, setPhoneTransferConsent] = useState(false);
  const [defaultCurrency, setDefaultCurrency] = useState('USD');
  const [transactionLimit, setTransactionLimit] = useState('1000');
  const [cardScanEnabled, setCardScanEnabled] = useState(true);
  const [phoneTransferEnabled, setPhoneTransferEnabled] = useState(true);

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (permissions) {
      setCardScanConsent(permissions.cardScanConsent);
      setPhoneTransferConsent(permissions.phoneTransferConsent);
    }
  }, [permissions]);

  useEffect(() => {
    if (settings) {
      setDefaultCurrency(settings.defaultCurrency);
      setTransactionLimit((Number(settings.transactionLimit) / 100).toString());
      setCardScanEnabled(settings.cardScanEnabled);
      setPhoneTransferEnabled(settings.phoneTransferEnabled);
    }
  }, [settings]);

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-2xl">
        <Alert>
          <AlertDescription>
            Please login to access settings
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const handleSavePermissions = async () => {
    try {
      await updatePermissions.mutateAsync({
        cardScanConsent,
        phoneTransferConsent,
      });
      toast.success('Permissions updated successfully');
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  const handleSaveSettings = async () => {
    try {
      const limitValue = parseFloat(transactionLimit);
      if (isNaN(limitValue) || limitValue <= 0) {
        toast.error('Please enter a valid transaction limit');
        return;
      }

      await updateSettings.mutateAsync({
        defaultCurrency,
        transactionLimit: BigInt(Math.floor(limitValue * 100)),
        cardScanEnabled,
        phoneTransferEnabled,
      });
      toast.success('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your NFC transfer preferences and permissions
        </p>
      </div>

      <div className="space-y-6">
        {/* Permissions */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>NFC Permissions</CardTitle>
                <CardDescription>Control what NFC operations are allowed</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="card-scan">Card Scan Consent</Label>
                <p className="text-sm text-muted-foreground">
                  Allow scanning of contactless payment cards
                </p>
              </div>
              <Switch
                id="card-scan"
                checked={cardScanConsent}
                onCheckedChange={setCardScanConsent}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="phone-transfer">Phone Transfer Consent</Label>
                <p className="text-sm text-muted-foreground">
                  Allow phone-to-phone money transfers
                </p>
              </div>
              <Switch
                id="phone-transfer"
                checked={phoneTransferConsent}
                onCheckedChange={setPhoneTransferConsent}
              />
            </div>

            <Alert>
              <AlertDescription className="text-sm">
                These permissions are required for NFC operations. You can revoke them at any time.
              </AlertDescription>
            </Alert>

            <Button onClick={handleSavePermissions} disabled={updatePermissions.isPending}>
              {updatePermissions.isPending ? 'Saving...' : 'Save Permissions'}
            </Button>
          </CardContent>
        </Card>

        {/* Transfer Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <DollarSign className="w-6 h-6 text-primary" />
              <div>
                <CardTitle>Transfer Settings</CardTitle>
                <CardDescription>Configure your transfer preferences</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Default Currency</Label>
              <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="EUR">EUR - Euro</SelectItem>
                  <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  <SelectItem value="JPY">JPY - Japanese Yen</SelectItem>
                  <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Transaction Limit</Label>
              <Input
                id="limit"
                type="number"
                value={transactionLimit}
                onChange={(e) => setTransactionLimit(e.target.value)}
                step="0.01"
                min="0"
              />
              <p className="text-xs text-muted-foreground">
                Maximum amount per transaction in {defaultCurrency}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="card-enabled">
                  <CreditCard className="inline w-4 h-4 mr-2" />
                  Card Transfers Enabled
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable card-to-phone transfers
                </p>
              </div>
              <Switch
                id="card-enabled"
                checked={cardScanEnabled}
                onCheckedChange={setCardScanEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="phone-enabled">
                  <Smartphone className="inline w-4 h-4 mr-2" />
                  Phone Transfers Enabled
                </Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable phone-to-phone transfers
                </p>
              </div>
              <Switch
                id="phone-enabled"
                checked={phoneTransferEnabled}
                onCheckedChange={setPhoneTransferEnabled}
              />
            </div>

            <Button onClick={handleSaveSettings} disabled={updateSettings.isPending}>
              <Save className="mr-2 h-4 w-4" />
              {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
            </Button>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> All transactions are encrypted end-to-end. 
            Card data is processed using secure tokens and never stored on our servers.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
