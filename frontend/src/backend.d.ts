import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface NfcTransaction {
    id: string;
    to: Principal;
    status: NfcTransactionStatus;
    transferType: NfcTransferType;
    from: Principal;
    description: string;
    cardToken?: string;
    currency: string;
    timestamp: bigint;
    amount: bigint;
}
export interface ChildActivityStats {
    blockedAttempts: bigint;
    lastActivity: bigint;
    totalTimeOnline: bigint;
    childId: Principal;
    safeSearchEnabled: boolean;
    parentId: Principal;
}
export interface TransactionReceipt {
    to: Principal;
    status: NfcTransactionStatus;
    transferType: NfcTransferType;
    from: Principal;
    description: string;
    cardToken?: string;
    currency: string;
    timestamp: bigint;
    amount: bigint;
    transactionId: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface PortfolioProject {
    id: string;
    title: string;
    imageRefs: Array<ExternalBlob>;
    description: string;
    details: string;
}
export interface ContactSubmission {
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface SecurityVerificationResult {
    verificationDetails: string;
    timestamp: bigint;
    encryptionStatus: EncryptionStatus;
    transactionId: string;
}
export interface PdfSection {
    title: string;
    content: string;
    images: Array<string>;
}
export interface NfcAlert {
    id: string;
    alertType: string;
    user: Principal;
    message: string;
    timestamp: bigint;
}
export interface PaymentTransaction {
    status: string;
    timestamp: bigint;
    amount: bigint;
    transactionId: string;
}
export interface WidgetConfig {
    theme: string;
    refreshInterval: bigint;
    lastUpdated: bigint;
    widgetSize: string;
    parentId: Principal;
}
export interface NfcPermission {
    phoneTransferConsent: boolean;
    user: Principal;
    lastUpdated: bigint;
    cardScanConsent: boolean;
}
export interface FilterStatus {
    lastUpdated: bigint;
    isActive: boolean;
    level: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface NfcDetectionLog {
    id: string;
    detectedType: NfcTransferType;
    status: string;
    user: Principal;
    cardToken?: string;
    timestamp: bigint;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface PdfGuide {
    title: string;
    createdAt: bigint;
    navigation: Array<string>;
    sections: Array<PdfSection>;
    branding: string;
}
export interface NfcComplianceReport {
    id: string;
    user: Principal;
    reportType: string;
    timestamp: bigint;
    details: string;
}
export interface ContactInfo {
    email: string;
    address: string;
    phone: string;
}
export interface ReinforcementProgress {
    positiveActions: bigint;
    childId: Principal;
    parentId: Principal;
    milestonesAchieved: bigint;
    lastReward: bigint;
}
export interface CardToken {
    token: string;
    cardType: string;
    createdAt: bigint;
    last4: string;
    issuer: string;
    expiry: string;
}
export interface HomeContent {
    missionStatement: string;
    heroText: string;
}
export interface WalletBalance {
    balance: bigint;
    user: Principal;
    lastUpdated: bigint;
    currency: string;
}
export interface WidgetData {
    filterStatus: FilterStatus;
    childStats: Array<ChildActivityStats>;
    lastAlert?: AlertMessageV2;
    reinforcementProgress: Array<ReinforcementProgress>;
    timestamp: bigint;
    parentId: Principal;
}
export interface Service {
    title: string;
    features: Array<string>;
    description: string;
}
export interface NfcSettings {
    cardScanEnabled: boolean;
    transactionLimit: bigint;
    user: Principal;
    lastUpdated: bigint;
    phoneTransferEnabled: boolean;
    defaultCurrency: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface AdminApkFile {
    uploadTimestamp: bigint;
    version: string;
    fileRef: ExternalBlob;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface SecurityAuditLog {
    id: string;
    to: Principal;
    status: NfcTransactionStatus;
    transferType: NfcTransferType;
    from: Principal;
    description: string;
    verificationDetails: string;
    currency: string;
    timestamp: bigint;
    amount: bigint;
    encryptionStatus: EncryptionStatus;
    transactionId: string;
}
export interface AlertMessageV2 {
    id: string;
    alertType: AlertType;
    title: string;
    message: string;
    timestamp: bigint;
    category: AlertCategory;
    priority: bigint;
}
export interface CurrencyConversionRate {
    toCurrency: string;
    fromCurrency: string;
    rate: bigint;
    lastUpdated: bigint;
}
export interface UserProfile {
    name: string;
}
export enum AlertCategory {
    warning = "warning",
    educational = "educational",
    contentBlock = "contentBlock"
}
export enum AlertType {
    violence = "violence",
    inappropriateLanguage = "inappropriateLanguage",
    generalSafety = "generalSafety",
    explicitContent = "explicitContent"
}
export enum EncryptionStatus {
    verified = "verified",
    unverified = "unverified",
    failed = "failed"
}
export enum NfcTransactionStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    failed = "failed"
}
export enum NfcTransferType {
    phoneToPhone = "phoneToPhone",
    cardToPhone = "cardToPhone"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPortfolioProject(id: string, title: string, description: string, imageRefs: Array<ExternalBlob>, details: string): Promise<boolean>;
    addService(title: string, description: string, features: Array<string>): Promise<boolean>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    createPdfGuide(title: string, sections: Array<PdfSection>, branding: string, navigation: Array<string>): Promise<string>;
    deleteAdminApkFile(): Promise<void>;
    deletePdfGuide(title: string): Promise<void>;
    deletePortfolioProject(id: string): Promise<boolean>;
    deleteService(title: string): Promise<boolean>;
    generateWidgetAuthToken(parentId: Principal, expiresIn: bigint): Promise<string>;
    getAdminApkFile(): Promise<AdminApkFile | null>;
    getAllPdfGuides(): Promise<Array<PdfGuide>>;
    getAllSecurityVerificationResults(): Promise<Array<SecurityVerificationResult>>;
    getCallerNfcPermission(): Promise<NfcPermission | null>;
    getCallerNfcSettings(): Promise<NfcSettings | null>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerWalletBalance(): Promise<WalletBalance | null>;
    getCallerWidgetData(): Promise<WidgetData | null>;
    getCardToken(token: string): Promise<CardToken | null>;
    getChildActivityStats(childId: Principal): Promise<ChildActivityStats | null>;
    getContactInfo(): Promise<ContactInfo | null>;
    getContactSubmissions(): Promise<Array<ContactSubmission>>;
    getCurrencyConversionRate(fromCurrency: string, toCurrency: string): Promise<CurrencyConversionRate | null>;
    getFilterStatus(parentId: Principal): Promise<FilterStatus | null>;
    getHomeContent(): Promise<HomeContent | null>;
    getNfcAlerts(): Promise<Array<NfcAlert>>;
    getNfcComplianceReports(): Promise<Array<NfcComplianceReport>>;
    getNfcDetectionLogs(): Promise<Array<NfcDetectionLog>>;
    getNfcPermission(user: Principal): Promise<NfcPermission | null>;
    getNfcSettings(user: Principal): Promise<NfcSettings | null>;
    getNfcTransactions(): Promise<Array<NfcTransaction>>;
    getPaymentTransactions(): Promise<Array<PaymentTransaction>>;
    getPdfGuide(title: string): Promise<PdfGuide | null>;
    getPortfolioProjects(): Promise<Array<PortfolioProject>>;
    getReinforcementProgress(childId: Principal): Promise<ReinforcementProgress | null>;
    getSecurityAuditLogById(logId: string): Promise<SecurityAuditLog | null>;
    getSecurityAuditLogs(): Promise<Array<SecurityAuditLog>>;
    getSecurityAuditLogsByEncryptionStatus(status: EncryptionStatus): Promise<Array<SecurityAuditLog>>;
    getSecurityAuditLogsByTransactionId(transactionId: string): Promise<Array<SecurityAuditLog>>;
    getSecurityAuditLogsByTransactionStatus(status: NfcTransactionStatus): Promise<Array<SecurityAuditLog>>;
    getSecurityAuditLogsByTransferType(transferType: NfcTransferType): Promise<Array<SecurityAuditLog>>;
    getSecurityAuditSummary(): Promise<{
        verifiedCount: bigint;
        failedCount: bigint;
        phoneToPhoneCount: bigint;
        totalLogs: bigint;
        completedCount: bigint;
        cardToPhoneCount: bigint;
        failedTransactionCount: bigint;
        unverifiedCount: bigint;
    }>;
    getSecurityVerificationResult(transactionId: string): Promise<SecurityVerificationResult | null>;
    getSecurityVerificationResultsByStatus(status: EncryptionStatus): Promise<Array<SecurityVerificationResult>>;
    getSecurityVerificationResultsByTimeRange(startTime: bigint, endTime: bigint): Promise<Array<SecurityVerificationResult>>;
    getServices(): Promise<Array<Service>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getTransactionReceipt(transactionId: string): Promise<TransactionReceipt | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVisitCount(): Promise<bigint>;
    getWalletBalance(user: Principal): Promise<WalletBalance | null>;
    getWidgetConfig(parentId: Principal): Promise<WidgetConfig | null>;
    getWidgetData(parentId: Principal): Promise<WidgetData | null>;
    incrementVisitCount(): Promise<void>;
    initializeAccessControl(): Promise<void>;
    initializeDefaultPdfGuide(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    recordCardToken(token: string, cardType: string, issuer: string, last4: string, expiry: string): Promise<void>;
    recordChildActivityStats(childId: Principal, parentId: Principal, totalTimeOnline: bigint, blockedAttempts: bigint, safeSearchEnabled: boolean, lastActivity: bigint): Promise<void>;
    recordFilterStatus(parentId: Principal, level: string, isActive: boolean): Promise<void>;
    recordNfcAlert(message: string, alertType: string): Promise<void>;
    recordNfcComplianceReport(reportType: string, details: string, user: Principal): Promise<void>;
    recordNfcDetectionLog(detectedType: NfcTransferType, status: string, cardToken: string | null): Promise<void>;
    recordNfcTransaction(to: Principal, amount: bigint, transferType: NfcTransferType, status: NfcTransactionStatus, cardToken: string | null, currency: string, description: string): Promise<string>;
    recordPaymentTransaction(amount: bigint, status: string, transactionId: string): Promise<void>;
    recordReinforcementProgress(childId: Principal, parentId: Principal, positiveActions: bigint, milestonesAchieved: bigint, lastReward: bigint): Promise<void>;
    recordSecurityAuditLog(transactionId: string, status: NfcTransactionStatus, encryptionStatus: EncryptionStatus, transferType: NfcTransferType, from: Principal, to: Principal, amount: bigint, currency: string, description: string, verificationDetails: string): Promise<void>;
    recordSecurityVerificationResult(transactionId: string, encryptionStatus: EncryptionStatus, verificationDetails: string): Promise<void>;
    recordTransactionReceipt(transactionId: string, to: Principal, amount: bigint, currency: string, status: NfcTransactionStatus, transferType: NfcTransferType, cardToken: string | null, description: string): Promise<void>;
    recordWidgetConfig(parentId: Principal, widgetSize: string, theme: string, refreshInterval: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitContactForm(name: string, email: string, message: string): Promise<boolean>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCallerNfcPermission(cardScanConsent: boolean, phoneTransferConsent: boolean): Promise<void>;
    updateCallerNfcSettings(defaultCurrency: string, transactionLimit: bigint, cardScanEnabled: boolean, phoneTransferEnabled: boolean): Promise<void>;
    updateContactInfo(phone: string, email: string, address: string): Promise<void>;
    updateCurrencyConversionRate(fromCurrency: string, toCurrency: string, rate: bigint): Promise<void>;
    updateHomeContent(heroText: string, missionStatement: string): Promise<void>;
    updateNfcPermission(user: Principal, cardScanConsent: boolean, phoneTransferConsent: boolean): Promise<void>;
    updateNfcSettings(user: Principal, defaultCurrency: string, transactionLimit: bigint, cardScanEnabled: boolean, phoneTransferEnabled: boolean): Promise<void>;
    updatePdfGuide(title: string, sections: Array<PdfSection>, branding: string, navigation: Array<string>): Promise<void>;
    updatePortfolioProject(id: string, title: string, description: string, imageRefs: Array<ExternalBlob>, details: string): Promise<boolean>;
    updateService(title: string, description: string, features: Array<string>): Promise<boolean>;
    updateWalletBalance(user: Principal, balance: bigint, currency: string): Promise<void>;
    uploadAdminApkFile(fileRef: ExternalBlob, version: string): Promise<void>;
    validateWidgetAuthToken(token: string): Promise<boolean>;
}