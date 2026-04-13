import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { 
  UserProfile,
  NfcTransaction,
  WalletBalance,
  NfcPermission,
  NfcSettings,
  TransactionReceipt,
  NfcDetectionLog,
  NfcAlert,
  CurrencyConversionRate,
  SecurityAuditLog,
  SecurityVerificationResult,
  WidgetData,
  WidgetConfig,
  ChildActivityStats,
  FilterStatus,
  ReinforcementProgress,
} from '../backend';
import { NfcTransferType, NfcTransactionStatus, EncryptionStatus } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Admin Check
export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<boolean>({
    queryKey: ['isAdmin', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

// NFC Transactions
export function useGetNfcTransactions() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<NfcTransaction[]>({
    queryKey: ['nfcTransactions', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNfcTransactions();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useRecordNfcTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      to,
      amount,
      transferType,
      status,
      cardToken,
      currency,
      description,
    }: {
      to: Principal;
      amount: bigint;
      transferType: NfcTransferType;
      status: NfcTransactionStatus;
      cardToken: string | null;
      currency: string;
      description: string;
    }) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      return actor.recordNfcTransaction(to, amount, transferType, status, cardToken, currency, description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfcTransactions'] });
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    },
  });
}

// Wallet Balance
export function useGetCallerWalletBalance() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WalletBalance | null>({
    queryKey: ['walletBalance', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerWalletBalance();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useUpdateWalletBalance() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({ balance, currency }: { balance: bigint; currency: string }) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const user = identity.getPrincipal();
      return actor.updateWalletBalance(user, balance, currency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['walletBalance'] });
    },
  });
}

// NFC Permissions
export function useGetCallerNfcPermission() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<NfcPermission | null>({
    queryKey: ['nfcPermission', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerNfcPermission();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useUpdateCallerNfcPermission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ cardScanConsent, phoneTransferConsent }: { cardScanConsent: boolean; phoneTransferConsent: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCallerNfcPermission(cardScanConsent, phoneTransferConsent);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfcPermission'] });
    },
  });
}

// NFC Settings
export function useGetCallerNfcSettings() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<NfcSettings | null>({
    queryKey: ['nfcSettings', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerNfcSettings();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useUpdateCallerNfcSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      defaultCurrency,
      transactionLimit,
      cardScanEnabled,
      phoneTransferEnabled,
    }: {
      defaultCurrency: string;
      transactionLimit: bigint;
      cardScanEnabled: boolean;
      phoneTransferEnabled: boolean;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateCallerNfcSettings(defaultCurrency, transactionLimit, cardScanEnabled, phoneTransferEnabled);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfcSettings'] });
    },
  });
}

// Transaction Receipt
export function useGetTransactionReceipt() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (transactionId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTransactionReceipt(transactionId);
    },
  });
}

export function useRecordTransactionReceipt() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({
      transactionId,
      to,
      amount,
      currency,
      status,
      transferType,
      cardToken,
      description,
    }: {
      transactionId: string;
      to: Principal;
      amount: bigint;
      currency: string;
      status: NfcTransactionStatus;
      transferType: NfcTransferType;
      cardToken: string | null;
      description: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordTransactionReceipt(transactionId, to, amount, currency, status, transferType, cardToken, description);
    },
  });
}

// NFC Detection Logs
export function useGetNfcDetectionLogs() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<NfcDetectionLog[]>({
    queryKey: ['nfcDetectionLogs', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNfcDetectionLogs();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useRecordNfcDetectionLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      detectedType,
      status,
      cardToken,
    }: {
      detectedType: NfcTransferType;
      status: string;
      cardToken: string | null;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordNfcDetectionLog(detectedType, status, cardToken);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfcDetectionLogs'] });
    },
  });
}

// NFC Alerts
export function useGetNfcAlerts() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<NfcAlert[]>({
    queryKey: ['nfcAlerts', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getNfcAlerts();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

export function useRecordNfcAlert() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ message, alertType }: { message: string; alertType: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordNfcAlert(message, alertType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nfcAlerts'] });
    },
  });
}

// Currency Conversion
export function useGetCurrencyConversionRate() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ fromCurrency, toCurrency }: { fromCurrency: string; toCurrency: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCurrencyConversionRate(fromCurrency, toCurrency);
    },
  });
}

// Security Audit Layer

// Get all security audit logs (admin only)
export function useGetSecurityAuditLogs() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SecurityAuditLog[]>({
    queryKey: ['securityAuditLogs'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSecurityAuditLogs();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

// Get security audit summary (admin only)
export function useGetSecurityAuditSummary() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<{
    totalLogs: bigint;
    verifiedCount: bigint;
    unverifiedCount: bigint;
    failedCount: bigint;
    phoneToPhoneCount: bigint;
    cardToPhoneCount: bigint;
    completedCount: bigint;
    failedTransactionCount: bigint;
  }>({
    queryKey: ['securityAuditSummary'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getSecurityAuditSummary();
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

// Get security audit logs by transaction ID
export function useGetSecurityAuditLogsByTransactionId(transactionId: string) {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<SecurityAuditLog[]>({
    queryKey: ['securityAuditLogsByTransaction', transactionId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSecurityAuditLogsByTransactionId(transactionId);
    },
    enabled: !!actor && !!identity && !isFetching && !!transactionId,
  });
}

// Get security verification result for a transaction
export function useGetSecurityVerificationResult(transactionId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<SecurityVerificationResult | null>({
    queryKey: ['securityVerificationResult', transactionId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSecurityVerificationResult(transactionId);
    },
    enabled: !!actor && !isFetching && !!transactionId,
  });
}

// Record security audit log (admin only)
export function useRecordSecurityAuditLog() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionId,
      status,
      encryptionStatus,
      transferType,
      from,
      to,
      amount,
      currency,
      description,
      verificationDetails,
    }: {
      transactionId: string;
      status: NfcTransactionStatus;
      encryptionStatus: EncryptionStatus;
      transferType: NfcTransferType;
      from: Principal;
      to: Principal;
      amount: bigint;
      currency: string;
      description: string;
      verificationDetails: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordSecurityAuditLog(
        transactionId,
        status,
        encryptionStatus,
        transferType,
        from,
        to,
        amount,
        currency,
        description,
        verificationDetails
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securityAuditLogs'] });
      queryClient.invalidateQueries({ queryKey: ['securityAuditSummary'] });
    },
  });
}

// Record security verification result (admin only)
export function useRecordSecurityVerificationResult() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      transactionId,
      encryptionStatus,
      verificationDetails,
    }: {
      transactionId: string;
      encryptionStatus: EncryptionStatus;
      verificationDetails: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.recordSecurityVerificationResult(transactionId, encryptionStatus, verificationDetails);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['securityVerificationResult'] });
    },
  });
}

// Parental Monitoring Widget

// Get widget data for the current parent
export function useGetCallerWidgetData() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WidgetData | null>({
    queryKey: ['widgetData', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerWidgetData();
    },
    enabled: !!actor && !!identity && !isFetching,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });
}

// Get widget configuration for the current parent
export function useGetWidgetConfig() {
  const { actor, isFetching } = useActor();
  const { identity } = useInternetIdentity();

  return useQuery<WidgetConfig | null>({
    queryKey: ['widgetConfig', identity?.getPrincipal().toString()],
    queryFn: async () => {
      if (!actor || !identity) return null;
      const parentId = identity.getPrincipal();
      return actor.getWidgetConfig(parentId);
    },
    enabled: !!actor && !!identity && !isFetching,
  });
}

// Record widget configuration
export function useRecordWidgetConfig() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      widgetSize,
      theme,
      refreshInterval,
    }: {
      widgetSize: string;
      theme: string;
      refreshInterval: bigint;
    }) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const parentId = identity.getPrincipal();
      return actor.recordWidgetConfig(parentId, widgetSize, theme, refreshInterval);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgetConfig'] });
    },
  });
}

// Record child activity stats
export function useRecordChildActivityStats() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      childId,
      totalTimeOnline,
      blockedAttempts,
      safeSearchEnabled,
      lastActivity,
    }: {
      childId: Principal;
      totalTimeOnline: bigint;
      blockedAttempts: bigint;
      safeSearchEnabled: boolean;
      lastActivity: bigint;
    }) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const parentId = identity.getPrincipal();
      return actor.recordChildActivityStats(childId, parentId, totalTimeOnline, blockedAttempts, safeSearchEnabled, lastActivity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgetData'] });
    },
  });
}

// Record filter status
export function useRecordFilterStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      level,
      isActive,
    }: {
      level: string;
      isActive: boolean;
    }) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const parentId = identity.getPrincipal();
      return actor.recordFilterStatus(parentId, level, isActive);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgetData'] });
    },
  });
}

// Record reinforcement progress
export function useRecordReinforcementProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async ({
      childId,
      positiveActions,
      milestonesAchieved,
      lastReward,
    }: {
      childId: Principal;
      positiveActions: bigint;
      milestonesAchieved: bigint;
      lastReward: bigint;
    }) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const parentId = identity.getPrincipal();
      return actor.recordReinforcementProgress(childId, parentId, positiveActions, milestonesAchieved, lastReward);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['widgetData'] });
    },
  });
}

// Generate widget auth token
export function useGenerateWidgetAuthToken() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  return useMutation({
    mutationFn: async (expiresIn: bigint) => {
      if (!actor || !identity) throw new Error('Actor or identity not available');
      const parentId = identity.getPrincipal();
      return actor.generateWidgetAuthToken(parentId, expiresIn);
    },
  });
}

// Validate widget auth token
export function useValidateWidgetAuthToken() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (token: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.validateWidgetAuthToken(token);
    },
  });
}
