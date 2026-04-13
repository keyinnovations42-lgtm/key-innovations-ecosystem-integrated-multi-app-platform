import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Iter "mo:base/Iter";
import Int "mo:base/Int";
import Principal "mo:base/Principal";
import Array "mo:base/Array";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Debug "mo:base/Debug";
import AccessControl "authorization/access-control";

actor Backend {
  let storage = Storage.new();
  include MixinStorage(storage);

  // Initialize the access control system
  let accessControlState = AccessControl.initState();

  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);

  type ContactSubmission = {
    name : Text;
    email : Text;
    message : Text;
    timestamp : Int;
  };

  type PortfolioProject = {
    id : Text;
    title : Text;
    description : Text;
    imageRefs : [Storage.ExternalBlob];
    details : Text;
  };

  type Service = {
    title : Text;
    description : Text;
    features : [Text];
  };

  type PaymentTransaction = {
    amount : Nat;
    status : Text;
    timestamp : Int;
    transactionId : Text;
  };

  type UserProfile = {
    name : Text;
  };

  type ContactInfo = {
    phone : Text;
    email : Text;
    address : Text;
  };

  type HomeContent = {
    heroText : Text;
    missionStatement : Text;
  };

  type AdminApkFile = {
    fileRef : Storage.ExternalBlob;
    version : Text;
    uploadTimestamp : Int;
  };

  type FilterMode = {
    #block;
    #blur;
    #alert;
  };

  type FilterSettings = {
    mode : FilterMode;
    sensitivity : Nat;
    whitelist : [Text];
    blacklist : [Text];
  };

  type DetectionStats = {
    totalScanned : Nat;
    blockedCount : Nat;
    effectiveness : Nat;
    lastUpdated : Int;
  };

  type ModelVersion = {
    version : Text;
    releaseDate : Int;
    changelog : Text;
  };

  type DetectionLog = {
    timestamp : Int;
    contentType : Text;
    result : Text;
  };

  type DevicePermission = {
    permissionType : Text;
    granted : Bool;
    timestamp : Int;
  };

  type PermissionPolicy = {
    permissionType : Text;
    required : Bool;
    description : Text;
  };

  type PermissionValidation = {
    permissionType : Text;
    status : Text;
    timestamp : Int;
  };

  type BlockedAccessAttempt = {
    timestamp : Int;
    url : Text;
    contentType : Text;
    reason : Text;
    userId : Principal;
  };

  type AlertType = {
    #explicitContent;
    #violence;
    #inappropriateLanguage;
    #generalSafety;
  };

  type AlertCategory = {
    #contentBlock;
    #warning;
    #educational;
  };

  type AlertMessageV2 = {
    id : Text;
    title : Text;
    message : Text;
    alertType : AlertType;
    category : AlertCategory;
    priority : Nat;
    timestamp : Int;
  };

  type PrivacyPolicySection = {
    id : Text;
    title : Text;
    content : Text;
    lastUpdated : Int;
  };

  type RegulatoryCompliance = {
    coppaCompliant : Bool;
    gdprCompliant : Bool;
    details : Text;
  };

  type UserRightsInfo = {
    dataAccess : Text;
    dataDeletion : Text;
    rightsExplanation : Text;
  };

  type PrivacyPolicyContent = {
    sections : [PrivacyPolicySection];
    regulatoryCompliance : RegulatoryCompliance;
    contactInfo : ContactInfo;
    userRights : UserRightsInfo;
    lastUpdated : Int;
  };

  type FoulLanguageFilter = {
    word : Text;
    replacement : Text;
    severity : Nat;
    enabled : Bool;
  };

  type FoulLanguageDetection = {
    detectedWord : Text;
    originalContent : Text;
    filteredContent : Text;
    severity : Nat;
    timestamp : Int;
    userId : Principal;
  };

  type AgeGroup = {
    #toddler;
    #child;
    #preTeen;
    #teenager;
  };

  type AgeConfiguration = {
    age : Nat;
    ageGroup : AgeGroup;
    filteringStrength : Nat;
    lastUpdated : Int;
  };

  type ReinforcementType = {
    #positive;
    #negative;
  };

  type ReinforcementMessage = {
    id : Text;
    message : Text;
    reinforcementType : ReinforcementType;
    ageGroup : AgeGroup;
    priority : Nat;
    timestamp : Int;
  };

  type SystemComponent = {
    id : Text;
    name : Text;
    description : Text;
    type_ : Text;
    features : [Text];
    icon : Text;
    color : Text;
    securityLevel : Text;
    position : {
      x : Nat;
      y : Nat;
    };
  };

  type SystemConnection = {
    from : Text;
    to : Text;
    connectionLabel : Text;
    direction : Text;
    style : Text;
    icon : Text;
  };

  type SystemOverview = {
    components : [SystemComponent];
    connections : [SystemConnection];
    lastUpdated : Int;
  };

  type AgeRange = {
    #toddler;
    #child;
    #teen;
    #adult;
  };

  type AgeDetectionResult = {
    imageRef : Storage.ExternalBlob;
    detectedAgeRange : AgeRange;
    confidenceScore : Nat;
    timestamp : Int;
  };

  type AgeDetectionTestSummary = {
    totalTests : Nat;
    underageDetections : Nat;
    averageConfidence : Nat;
    timestamp : Int;
  };

  type SafeSearchEngine = {
    #google;
    #bing;
    #youtube;
  };

  type SafeSearchSetting = {
    engine : SafeSearchEngine;
    enabled : Bool;
    strictness : Nat;
  };

  type SafeSearchConfig = {
    enabled : Bool;
    settings : [SafeSearchSetting];
    lastUpdated : Int;
  };

  type SafeSearchAlert = {
    id : Text;
    message : Text;
    engine : SafeSearchEngine;
    timestamp : Int;
  };

  type PdfSection = {
    title : Text;
    content : Text;
    images : [Text];
  };

  type PdfGuide = {
    title : Text;
    sections : [PdfSection];
    branding : Text;
    navigation : [Text];
    createdAt : Int;
  };

  // New types for NFC Transfer
  type NfcTransferType = {
    #phoneToPhone;
    #cardToPhone;
  };

  type NfcTransactionStatus = {
    #pending;
    #completed;
    #failed;
    #cancelled;
  };

  type NfcTransaction = {
    id : Text;
    from : Principal;
    to : Principal;
    amount : Nat;
    transferType : NfcTransferType;
    status : NfcTransactionStatus;
    timestamp : Int;
    cardToken : ?Text;
    currency : Text;
    description : Text;
  };

  type WalletBalance = {
    user : Principal;
    balance : Nat;
    currency : Text;
    lastUpdated : Int;
  };

  type CardToken = {
    token : Text;
    cardType : Text;
    issuer : Text;
    last4 : Text;
    expiry : Text;
    createdAt : Int;
  };

  type NfcPermission = {
    user : Principal;
    cardScanConsent : Bool;
    phoneTransferConsent : Bool;
    lastUpdated : Int;
  };

  type TransactionReceipt = {
    transactionId : Text;
    from : Principal;
    to : Principal;
    amount : Nat;
    currency : Text;
    status : NfcTransactionStatus;
    timestamp : Int;
    transferType : NfcTransferType;
    cardToken : ?Text;
    description : Text;
  };

  type CurrencyConversionRate = {
    fromCurrency : Text;
    toCurrency : Text;
    rate : Nat;
    lastUpdated : Int;
  };

  type NfcDetectionLog = {
    id : Text;
    detectedType : NfcTransferType;
    timestamp : Int;
    status : Text;
    user : Principal;
    cardToken : ?Text;
  };

  type NfcSettings = {
    user : Principal;
    defaultCurrency : Text;
    transactionLimit : Nat;
    cardScanEnabled : Bool;
    phoneTransferEnabled : Bool;
    lastUpdated : Int;
  };

  type NfcAlert = {
    id : Text;
    message : Text;
    alertType : Text;
    timestamp : Int;
    user : Principal;
  };

  type NfcComplianceReport = {
    id : Text;
    reportType : Text;
    details : Text;
    timestamp : Int;
    user : Principal;
  };

  // New types for Security Audit Layer
  type EncryptionStatus = {
    #verified;
    #unverified;
    #failed;
  };

  type SecurityAuditLog = {
    id : Text;
    transactionId : Text;
    timestamp : Int;
    status : NfcTransactionStatus;
    encryptionStatus : EncryptionStatus;
    transferType : NfcTransferType;
    from : Principal;
    to : Principal;
    amount : Nat;
    currency : Text;
    description : Text;
    verificationDetails : Text;
  };

  type SecurityVerificationResult = {
    transactionId : Text;
    encryptionStatus : EncryptionStatus;
    verificationDetails : Text;
    timestamp : Int;
  };

  // New types for Parental Monitoring Widget
  type ChildActivityStats = {
    childId : Principal;
    parentId : Principal;
    totalTimeOnline : Nat;
    blockedAttempts : Nat;
    safeSearchEnabled : Bool;
    lastActivity : Int;
  };

  type FilterStatus = {
    level : Text;
    isActive : Bool;
    lastUpdated : Int;
  };

  type ReinforcementProgress = {
    childId : Principal;
    parentId : Principal;
    positiveActions : Nat;
    milestonesAchieved : Nat;
    lastReward : Int;
  };

  type WidgetData = {
    parentId : Principal;
    childStats : [ChildActivityStats];
    lastAlert : ?AlertMessageV2;
    filterStatus : FilterStatus;
    reinforcementProgress : [ReinforcementProgress];
    timestamp : Int;
  };

  type WidgetConfig = {
    parentId : Principal;
    widgetSize : Text;
    theme : Text;
    refreshInterval : Nat;
    lastUpdated : Int;
  };

  type WidgetAuthToken = {
    parentId : Principal;
    token : Text;
    expiresAt : Int;
    createdAt : Int;
  };

  var contactSubmissions = textMap.empty<ContactSubmission>();
  var portfolioProjects = textMap.empty<PortfolioProject>();
  var services = textMap.empty<Service>();
  var paymentTransactions = textMap.empty<PaymentTransaction>();
  var visitCount = 0;
  var userProfiles = principalMap.empty<UserProfile>();
  var contactInfo : ?ContactInfo = null;
  var homeContent : ?HomeContent = null;
  var stripeConfig : ?Stripe.StripeConfiguration = null;
  var sessionOwners = textMap.empty<Principal>();
  var adminApkFile : ?AdminApkFile = null;
  var filterSettings = principalMap.empty<FilterSettings>();
  var detectionStats = principalMap.empty<DetectionStats>();
  var modelVersion : ?ModelVersion = null;
  var detectionLogs = principalMap.empty<OrderedMap.Map<Text, DetectionLog>>();
  var devicePermissions = principalMap.empty<OrderedMap.Map<Text, DevicePermission>>();
  var permissionPolicies = textMap.empty<PermissionPolicy>();
  var permissionValidations = principalMap.empty<OrderedMap.Map<Text, PermissionValidation>>();
  var blockedAccessAttempts = principalMap.empty<OrderedMap.Map<Text, BlockedAccessAttempt>>();
  var alertMessages = textMap.empty<AlertMessageV2>();
  var privacyPolicyContent : ?PrivacyPolicyContent = null;
  var foulLanguageFilters = textMap.empty<FoulLanguageFilter>();
  var foulLanguageDetections = principalMap.empty<OrderedMap.Map<Text, FoulLanguageDetection>>();
  var ageConfigurations = principalMap.empty<AgeConfiguration>();
  var reinforcementMessages = textMap.empty<ReinforcementMessage>();
  var systemOverview : ?SystemOverview = null;
  var ageDetectionResults = principalMap.empty<AgeDetectionResult>();
  var ageDetectionTestSummaries = principalMap.empty<AgeDetectionTestSummary>();
  var safeSearchConfigs = principalMap.empty<SafeSearchConfig>();
  var safeSearchAlerts = principalMap.empty<OrderedMap.Map<Text, SafeSearchAlert>>();
  var pdfGuides = textMap.empty<PdfGuide>();

  // NFC-related state
  var nfcTransactions = textMap.empty<NfcTransaction>();
  var walletBalances = principalMap.empty<WalletBalance>();
  var cardTokens = textMap.empty<CardToken>();
  var nfcPermissions = principalMap.empty<NfcPermission>();
  var transactionReceipts = textMap.empty<TransactionReceipt>();
  var currencyConversionRates = textMap.empty<CurrencyConversionRate>();
  var nfcDetectionLogs = textMap.empty<NfcDetectionLog>();
  var nfcSettings = principalMap.empty<NfcSettings>();
  var nfcAlerts = textMap.empty<NfcAlert>();
  var nfcComplianceReports = textMap.empty<NfcComplianceReport>();

  // Security Audit Layer state
  var securityAuditLogs = textMap.empty<SecurityAuditLog>();
  var securityVerificationResults = textMap.empty<SecurityVerificationResult>();

  // Parental Monitoring Widget state
  var childActivityStats = principalMap.empty<ChildActivityStats>();
  var filterStatuses = principalMap.empty<FilterStatus>();
  var reinforcementProgress = principalMap.empty<ReinforcementProgress>();
  var widgetConfigs = principalMap.empty<WidgetConfig>();
  var widgetAuthTokens = textMap.empty<WidgetAuthToken>();

  // Access Control Functions
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can access profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Public function - anyone can submit contact form
  public func submitContactForm(name : Text, email : Text, message : Text) : async Bool {
    let submission : ContactSubmission = {
      name;
      email;
      message;
      timestamp = Time.now();
    };
    contactSubmissions := textMap.put(contactSubmissions, email # Int.toText(Time.now()), submission);
    true;
  };

  // Admin-only - sensitive customer data
  public query ({ caller }) func getContactSubmissions() : async [ContactSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view contact submissions");
    };
    Iter.toArray(textMap.vals(contactSubmissions));
  };

  // Admin-only - content management
  public shared ({ caller }) func addPortfolioProject(id : Text, title : Text, description : Text, imageRefs : [Storage.ExternalBlob], details : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add portfolio projects");
    };
    let project : PortfolioProject = {
      id;
      title;
      description;
      imageRefs;
      details;
    };
    portfolioProjects := textMap.put(portfolioProjects, id, project);
    true;
  };

  // Admin-only - content management
  public shared ({ caller }) func updatePortfolioProject(id : Text, title : Text, description : Text, imageRefs : [Storage.ExternalBlob], details : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update portfolio projects");
    };
    let project : PortfolioProject = {
      id;
      title;
      description;
      imageRefs;
      details;
    };
    portfolioProjects := textMap.put(portfolioProjects, id, project);
    true;
  };

  // Admin-only - content management
  public shared ({ caller }) func deletePortfolioProject(id : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete portfolio projects");
    };
    portfolioProjects := textMap.delete(portfolioProjects, id);
    true;
  };

  // Public - display on website
  public query func getPortfolioProjects() : async [PortfolioProject] {
    Iter.toArray(textMap.vals(portfolioProjects));
  };

  // Admin-only - content management
  public shared ({ caller }) func addService(title : Text, description : Text, features : [Text]) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can add services");
    };
    let service : Service = {
      title;
      description;
      features;
    };
    services := textMap.put(services, title, service);
    true;
  };

  // Admin-only - content management
  public shared ({ caller }) func updateService(title : Text, description : Text, features : [Text]) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update services");
    };
    let service : Service = {
      title;
      description;
      features;
    };
    services := textMap.put(services, title, service);
    true;
  };

  // Admin-only - content management
  public shared ({ caller }) func deleteService(title : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete services");
    };
    services := textMap.delete(services, title);
    true;
  };

  // Public - display on website
  public query func getServices() : async [Service] {
    Iter.toArray(textMap.vals(services));
  };

  // Public - anyone can increment visit count
  public func incrementVisitCount() : async () {
    visitCount += 1;
  };

  // Public - display on website
  public query func getVisitCount() : async Nat {
    visitCount;
  };

  // Admin-only - content management
  public shared ({ caller }) func updateContactInfo(phone : Text, email : Text, address : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update contact info");
    };
    contactInfo := ?{
      phone;
      email;
      address;
    };
  };

  // Public - display on website
  public query func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };

  // Admin-only - content management
  public shared ({ caller }) func updateHomeContent(heroText : Text, missionStatement : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update home content");
    };
    homeContent := ?{
      heroText;
      missionStatement;
    };
  };

  // Public - display on website
  public query func getHomeContent() : async ?HomeContent {
    homeContent;
  };

  // Admin-only - sensitive configuration
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case null Debug.trap("Stripe needs to be first configured");
      case (?value) value;
    };
  };

  // Public - customers need to create payment sessions
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    let sessionId = await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
    // Track who created this session
    sessionOwners := textMap.put(sessionOwners, sessionId, caller);
    sessionId;
  };

  // Restricted - only session owner or admin can check status
  public shared ({ caller }) func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    // Check if caller is the session owner or an admin
    let isOwner = switch (textMap.get(sessionOwners, sessionId)) {
      case null false; // Session not found in our records
      case (?owner) Principal.equal(owner, caller);
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    if (not (isOwner or isAdmin)) {
      Debug.trap("Unauthorized: Can only check status of your own payment sessions");
    };

    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Admin-only - recording transactions should be restricted
  public shared ({ caller }) func recordPaymentTransaction(amount : Nat, status : Text, transactionId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can record payment transactions");
    };
    let transaction : PaymentTransaction = {
      amount;
      status;
      timestamp = Time.now();
      transactionId;
    };
    paymentTransactions := textMap.put(paymentTransactions, transactionId, transaction);
  };

  // Admin-only - sensitive financial data
  public query ({ caller }) func getPaymentTransactions() : async [PaymentTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can view payment transactions");
    };
    Iter.toArray(textMap.vals(paymentTransactions));
  };

  // Admin-only - upload new APK file
  public shared ({ caller }) func uploadAdminApkFile(fileRef : Storage.ExternalBlob, version : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can upload APK files");
    };
    adminApkFile := ?{
      fileRef;
      version;
      uploadTimestamp = Time.now();
    };
  };

  // Admin-only - get current APK file reference
  public query ({ caller }) func getAdminApkFile() : async ?AdminApkFile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can access APK files");
    };
    adminApkFile;
  };

  // Admin-only - delete current APK file
  public shared ({ caller }) func deleteAdminApkFile() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete APK files");
    };
    adminApkFile := null;
  };

  // PDF Guide Generation

  // Admin-only - create PDF guide
  public shared ({ caller }) func createPdfGuide(title : Text, sections : [PdfSection], branding : Text, navigation : [Text]) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can create PDF guides");
    };

    let guide : PdfGuide = {
      title;
      sections;
      branding;
      navigation;
      createdAt = Time.now();
    };

    pdfGuides := textMap.put(pdfGuides, title, guide);
    title;
  };

  // Admin-only - get PDF guide
  public query ({ caller }) func getPdfGuide(title : Text) : async ?PdfGuide {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get PDF guides");
    };

    textMap.get(pdfGuides, title);
  };

  // Admin-only - delete PDF guide
  public shared ({ caller }) func deletePdfGuide(title : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can delete PDF guides");
    };

    pdfGuides := textMap.delete(pdfGuides, title);
  };

  // Admin-only - get all PDF guides
  public query ({ caller }) func getAllPdfGuides() : async [PdfGuide] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get all PDF guides");
    };

    Iter.toArray(textMap.vals(pdfGuides));
  };

  // Admin-only - update PDF guide
  public shared ({ caller }) func updatePdfGuide(title : Text, sections : [PdfSection], branding : Text, navigation : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update PDF guides");
    };

    let guide : PdfGuide = {
      title;
      sections;
      branding;
      navigation;
      createdAt = Time.now();
    };

    pdfGuides := textMap.put(pdfGuides, title, guide);
  };

  // Admin-only - initialize default PDF guide
  public shared ({ caller }) func initializeDefaultPdfGuide() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can initialize default PDF guide");
    };

    let defaultSections : [PdfSection] = [
      {
        title = "Overview";
        content = "This section provides an overview of the Key Innovations ecosystem, including the website and CyberGuard app.";
        images = ["generated/system-overview-diagram.dim_1200x800.png"];
      },
      {
        title = "Website Setup";
        content = "This section provides step-by-step instructions for setting up the website, including admin dashboard usage, Stripe integration, and contact management.";
        images = ["generated/hero-banner.dim_1200x600.png", "generated/portfolio-corporate-site.dim_400x300.png"];
      },
      {
        title = "CyberGuard App Setup";
        content = "This section provides instructions for installing the CyberGuard app as a PWA and configuring device permissions.";
        images = ["generated/onboarding-permissions.dim_800x400.png", "generated/device-admin-setup.dim_400x600.png", "generated/accessibility-permission.dim_400x600.png"];
      },
      {
        title = "Using Core Features";
        content = "This section details core features such as age configuration, language filtering, alert handling, and Safe Search extension sync.";
        images = ["generated/age-config-interface.dim_400x300.png", "generated/language-filter-dashboard.dim_800x600.png", "generated/extension-sync-diagram.dim_600x400.png"];
      },
      {
        title = "Admin Tools";
        content = "This section provides an overview of admin tools, including the admin APK, safe download process, and dashboard management.";
        images = ["generated/permission-dashboard.dim_400x300.png", "generated/system-overview-dashboard.dim_800x600.png"];
      },
      {
        title = "Privacy & Safety";
        content = "This section summarizes key privacy and safety features, including encryption, COPPA/GDPR compliance, and user rights.";
        images = ["generated/child-friendly-language-alert.dim_400x300.png", "generated/privacy-policy-icon.png"];
      },
    ];

    let defaultNavigation : [Text] = [
      "Overview",
      "Website Setup",
      "CyberGuard App Setup",
      "Using Core Features",
      "Admin Tools",
      "Privacy & Safety",
    ];

    let guide : PdfGuide = {
      title = "Key Innovations Quick Start Guide";
      sections = defaultSections;
      branding = "generated/key-innovations-logo-transparent.dim_200x200.png";
      navigation = defaultNavigation;
      createdAt = Time.now();
    };

    pdfGuides := textMap.put(pdfGuides, "Key Innovations Quick Start Guide", guide);
  };

  // NFC Transfer Functions

  // User-only - record NFC transaction (caller is automatically the sender)
  public shared ({ caller }) func recordNfcTransaction(to : Principal, amount : Nat, transferType : NfcTransferType, status : NfcTransactionStatus, cardToken : ?Text, currency : Text, description : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can record NFC transactions");
    };

    // Caller is automatically the sender - prevents impersonation
    let from = caller;
    let transactionId = Int.toText(Time.now()) # Principal.toText(from) # Principal.toText(to);

    let transaction : NfcTransaction = {
      id = transactionId;
      from;
      to;
      amount;
      transferType;
      status;
      timestamp = Time.now();
      cardToken;
      currency;
      description;
    };

    nfcTransactions := textMap.put(nfcTransactions, transactionId, transaction);
    transactionId;
  };

  // User can view their own transactions, admin can view all
  public query ({ caller }) func getNfcTransactions() : async [NfcTransaction] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get NFC transactions");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    if (isAdmin) {
      // Admin can see all transactions
      Iter.toArray(textMap.vals(nfcTransactions));
    } else {
      // Users can only see their own transactions
      let allTransactions = Iter.toArray(textMap.vals(nfcTransactions));
      let userTransactions = Array.filter<NfcTransaction>(
        allTransactions,
        func(tx : NfcTransaction) : Bool {
          Principal.equal(tx.from, caller) or Principal.equal(tx.to, caller)
        }
      );
      userTransactions;
    };
  };

  // User can update their own wallet, admin can update any wallet
  public shared ({ caller }) func updateWalletBalance(user : Principal, balance : Nat, currency : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update wallet balance");
    };

    // Users can only update their own wallet, admins can update any
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only update your own wallet balance");
    };

    let wallet : WalletBalance = {
      user;
      balance;
      currency;
      lastUpdated = Time.now();
    };

    walletBalances := principalMap.put(walletBalances, user, wallet);
  };

  // User can view their own wallet, admin can view any wallet
  public query ({ caller }) func getWalletBalance(user : Principal) : async ?WalletBalance {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get wallet balance");
    };

    // Users can only view their own wallet, admins can view any
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own wallet balance");
    };

    principalMap.get(walletBalances, user);
  };

  // User can view their own wallet balance
  public query ({ caller }) func getCallerWalletBalance() : async ?WalletBalance {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get wallet balance");
    };

    principalMap.get(walletBalances, caller);
  };

  // Admin-only - record card token (sensitive payment data)
  public shared ({ caller }) func recordCardToken(token : Text, cardType : Text, issuer : Text, last4 : Text, expiry : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can record card tokens");
    };

    let cardToken : CardToken = {
      token;
      cardType;
      issuer;
      last4;
      expiry;
      createdAt = Time.now();
    };

    cardTokens := textMap.put(cardTokens, token, cardToken);
  };

  // Admin-only - get card token (sensitive payment data)
  public query ({ caller }) func getCardToken(token : Text) : async ?CardToken {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get card token");
    };

    textMap.get(cardTokens, token);
  };

  // User can update their own NFC permission
  public shared ({ caller }) func updateNfcPermission(user : Principal, cardScanConsent : Bool, phoneTransferConsent : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update NFC permission");
    };

    // Users can only update their own permissions, admins can update any
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only update your own NFC permissions");
    };

    let permission : NfcPermission = {
      user;
      cardScanConsent;
      phoneTransferConsent;
      lastUpdated = Time.now();
    };

    nfcPermissions := principalMap.put(nfcPermissions, user, permission);
  };

  // User can update their own NFC permission
  public shared ({ caller }) func updateCallerNfcPermission(cardScanConsent : Bool, phoneTransferConsent : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update NFC permission");
    };

    let permission : NfcPermission = {
      user = caller;
      cardScanConsent;
      phoneTransferConsent;
      lastUpdated = Time.now();
    };

    nfcPermissions := principalMap.put(nfcPermissions, caller, permission);
  };

  // User can view their own NFC permission, admin can view any
  public query ({ caller }) func getNfcPermission(user : Principal) : async ?NfcPermission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get NFC permission");
    };

    // Users can only view their own permissions, admins can view any
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own NFC permissions");
    };

    principalMap.get(nfcPermissions, user);
  };

  // User can view their own NFC permission
  public query ({ caller }) func getCallerNfcPermission() : async ?NfcPermission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get NFC permission");
    };

    principalMap.get(nfcPermissions, caller);
  };

  // User can record transaction receipt for their own transactions (caller is automatically the sender)
  public shared ({ caller }) func recordTransactionReceipt(transactionId : Text, to : Principal, amount : Nat, currency : Text, status : NfcTransactionStatus, transferType : NfcTransferType, cardToken : ?Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can record transaction receipts");
    };

    // Caller is automatically the sender - prevents impersonation
    let from = caller;

    let receipt : TransactionReceipt = {
      transactionId;
      from;
      to;
      amount;
      currency;
      status;
      timestamp = Time.now();
      transferType;
      cardToken;
      description;
    };

    transactionReceipts := textMap.put(transactionReceipts, transactionId, receipt);
  };

  // User can view their own transaction receipts, admin can view any
  public query ({ caller }) func getTransactionReceipt(transactionId : Text) : async ?TransactionReceipt {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get transaction receipt");
    };

    let receipt = textMap.get(transactionReceipts, transactionId);
    
    switch (receipt) {
      case null null;
      case (?r) {
        // Users can only view their own receipts, admins can view any
        if (not (Principal.equal(caller, r.from) or Principal.equal(caller, r.to)) and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only view your own transaction receipts");
        };
        receipt;
      };
    };
  };

  // Admin-only - update currency conversion rate
  public shared ({ caller }) func updateCurrencyConversionRate(fromCurrency : Text, toCurrency : Text, rate : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can update currency conversion rate");
    };

    let conversionRate : CurrencyConversionRate = {
      fromCurrency;
      toCurrency;
      rate;
      lastUpdated = Time.now();
    };

    currencyConversionRates := textMap.put(currencyConversionRates, fromCurrency # toCurrency, conversionRate);
  };

  // User can view currency conversion rates
  public query ({ caller }) func getCurrencyConversionRate(fromCurrency : Text, toCurrency : Text) : async ?CurrencyConversionRate {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get currency conversion rate");
    };

    textMap.get(currencyConversionRates, fromCurrency # toCurrency);
  };

  // User can record their own NFC detection log (caller is automatically the user)
  public shared ({ caller }) func recordNfcDetectionLog(detectedType : NfcTransferType, status : Text, cardToken : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can record NFC detection logs");
    };

    // Caller is automatically the user - prevents impersonation
    let user = caller;
    let logId = Int.toText(Time.now()) # Principal.toText(user);

    let detectionLog : NfcDetectionLog = {
      id = logId;
      detectedType;
      timestamp = Time.now();
      status;
      user;
      cardToken;
    };

    nfcDetectionLogs := textMap.put(nfcDetectionLogs, logId, detectionLog);
  };

  // Admin can view all logs, users can view their own
  public query ({ caller }) func getNfcDetectionLogs() : async [NfcDetectionLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get NFC detection logs");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    if (isAdmin) {
      // Admin can see all logs
      Iter.toArray(textMap.vals(nfcDetectionLogs));
    } else {
      // Users can only see their own logs
      let allLogs = Iter.toArray(textMap.vals(nfcDetectionLogs));
      let userLogs = Array.filter<NfcDetectionLog>(
        allLogs,
        func(log : NfcDetectionLog) : Bool {
          Principal.equal(log.user, caller)
        }
      );
      userLogs;
    };
  };

  // User can update their own NFC settings
  public shared ({ caller }) func updateNfcSettings(user : Principal, defaultCurrency : Text, transactionLimit : Nat, cardScanEnabled : Bool, phoneTransferEnabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update NFC settings");
    };

    // Users can only update their own settings, admins can update any
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only update your own NFC settings");
    };

    let settings : NfcSettings = {
      user;
      defaultCurrency;
      transactionLimit;
      cardScanEnabled;
      phoneTransferEnabled;
      lastUpdated = Time.now();
    };

    nfcSettings := principalMap.put(nfcSettings, user, settings);
  };

  // User can update their own NFC settings
  public shared ({ caller }) func updateCallerNfcSettings(defaultCurrency : Text, transactionLimit : Nat, cardScanEnabled : Bool, phoneTransferEnabled : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can update NFC settings");
    };

    let settings : NfcSettings = {
      user = caller;
      defaultCurrency;
      transactionLimit;
      cardScanEnabled;
      phoneTransferEnabled;
      lastUpdated = Time.now();
    };

    nfcSettings := principalMap.put(nfcSettings, caller, settings);
  };

  // User can view their own NFC settings, admin can view any
  public query ({ caller }) func getNfcSettings(user : Principal) : async ?NfcSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get NFC settings");
    };

    // Users can only view their own settings, admins can view any
    if (not Principal.equal(caller, user) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own NFC settings");
    };

    principalMap.get(nfcSettings, user);
  };

  // User can view their own NFC settings
  public query ({ caller }) func getCallerNfcSettings() : async ?NfcSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get NFC settings");
    };

    principalMap.get(nfcSettings, caller);
  };

  // User can record their own NFC alert (caller is automatically the user)
  public shared ({ caller }) func recordNfcAlert(message : Text, alertType : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can record NFC alerts");
    };

    // Caller is automatically the user - prevents impersonation
    let user = caller;
    let alertId = Int.toText(Time.now()) # Principal.toText(user);

    let alert : NfcAlert = {
      id = alertId;
      message;
      alertType;
      timestamp = Time.now();
      user;
    };

    nfcAlerts := textMap.put(nfcAlerts, alertId, alert);
  };

  // Admin can view all alerts, users can view their own
  public query ({ caller }) func getNfcAlerts() : async [NfcAlert] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get NFC alerts");
    };

    let isAdmin = AccessControl.isAdmin(accessControlState, caller);
    
    if (isAdmin) {
      // Admin can see all alerts
      Iter.toArray(textMap.vals(nfcAlerts));
    } else {
      // Users can only see their own alerts
      let allAlerts = Iter.toArray(textMap.vals(nfcAlerts));
      let userAlerts = Array.filter<NfcAlert>(
        allAlerts,
        func(alert : NfcAlert) : Bool {
          Principal.equal(alert.user, caller)
        }
      );
      userAlerts;
    };
  };

  // Admin-only - record NFC compliance report
  public shared ({ caller }) func recordNfcComplianceReport(reportType : Text, details : Text, user : Principal) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can record NFC compliance reports");
    };

    let reportId = Int.toText(Time.now()) # Principal.toText(user);

    let report : NfcComplianceReport = {
      id = reportId;
      reportType;
      details;
      timestamp = Time.now();
      user;
    };

    nfcComplianceReports := textMap.put(nfcComplianceReports, reportId, report);
  };

  // Admin-only - get NFC compliance reports
  public query ({ caller }) func getNfcComplianceReports() : async [NfcComplianceReport] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get NFC compliance reports");
    };

    Iter.toArray(textMap.vals(nfcComplianceReports));
  };

  // Security Audit Layer Functions

  // Admin-only - record security audit log
  public shared ({ caller }) func recordSecurityAuditLog(transactionId : Text, status : NfcTransactionStatus, encryptionStatus : EncryptionStatus, transferType : NfcTransferType, from : Principal, to : Principal, amount : Nat, currency : Text, description : Text, verificationDetails : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can record security audit logs");
    };

    let logId = Int.toText(Time.now()) # transactionId;

    let auditLog : SecurityAuditLog = {
      id = logId;
      transactionId;
      timestamp = Time.now();
      status;
      encryptionStatus;
      transferType;
      from;
      to;
      amount;
      currency;
      description;
      verificationDetails;
    };

    securityAuditLogs := textMap.put(securityAuditLogs, logId, auditLog);
  };

  // Admin-only - get security audit logs
  public query ({ caller }) func getSecurityAuditLogs() : async [SecurityAuditLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security audit logs");
    };

    Iter.toArray(textMap.vals(securityAuditLogs));
  };

  // Admin-only - get security audit log by ID
  public query ({ caller }) func getSecurityAuditLogById(logId : Text) : async ?SecurityAuditLog {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security audit log");
    };

    textMap.get(securityAuditLogs, logId);
  };

  // Admin-only - get security audit logs by transaction ID
  public query ({ caller }) func getSecurityAuditLogsByTransactionId(transactionId : Text) : async [SecurityAuditLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security audit logs");
    };

    let allLogs = Iter.toArray(textMap.vals(securityAuditLogs));
    let filteredLogs = Array.filter<SecurityAuditLog>(
      allLogs,
      func(log : SecurityAuditLog) : Bool {
        log.transactionId == transactionId;
      }
    );
    filteredLogs;
  };

  // Admin-only - get security audit logs by encryption status
  public query ({ caller }) func getSecurityAuditLogsByEncryptionStatus(status : EncryptionStatus) : async [SecurityAuditLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security audit logs");
    };

    let allLogs = Iter.toArray(textMap.vals(securityAuditLogs));
    let filteredLogs = Array.filter<SecurityAuditLog>(
      allLogs,
      func(log : SecurityAuditLog) : Bool {
        log.encryptionStatus == status;
      }
    );
    filteredLogs;
  };

  // Admin-only - get security audit logs by transaction status
  public query ({ caller }) func getSecurityAuditLogsByTransactionStatus(status : NfcTransactionStatus) : async [SecurityAuditLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security audit logs");
    };

    let allLogs = Iter.toArray(textMap.vals(securityAuditLogs));
    let filteredLogs = Array.filter<SecurityAuditLog>(
      allLogs,
      func(log : SecurityAuditLog) : Bool {
        log.status == status;
      }
    );
    filteredLogs;
  };

  // Admin-only - get security audit logs by transfer type
  public query ({ caller }) func getSecurityAuditLogsByTransferType(transferType : NfcTransferType) : async [SecurityAuditLog] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security audit logs");
    };

    let allLogs = Iter.toArray(textMap.vals(securityAuditLogs));
    let filteredLogs = Array.filter<SecurityAuditLog>(
      allLogs,
      func(log : SecurityAuditLog) : Bool {
        log.transferType == transferType;
      }
    );
    filteredLogs;
  };

  // Admin-only - record security verification result
  public shared ({ caller }) func recordSecurityVerificationResult(transactionId : Text, encryptionStatus : EncryptionStatus, verificationDetails : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can record security verification results");
    };

    let result : SecurityVerificationResult = {
      transactionId;
      encryptionStatus;
      verificationDetails;
      timestamp = Time.now();
    };

    securityVerificationResults := textMap.put(securityVerificationResults, transactionId, result);
  };

  // Admin-only - get security verification result
  public query ({ caller }) func getSecurityVerificationResult(transactionId : Text) : async ?SecurityVerificationResult {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security verification result");
    };

    textMap.get(securityVerificationResults, transactionId);
  };

  // Admin-only - get all security verification results
  public query ({ caller }) func getAllSecurityVerificationResults() : async [SecurityVerificationResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security verification results");
    };

    Iter.toArray(textMap.vals(securityVerificationResults));
  };

  // Admin-only - get security verification results by status
  public query ({ caller }) func getSecurityVerificationResultsByStatus(status : EncryptionStatus) : async [SecurityVerificationResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security verification results");
    };

    let allResults = Iter.toArray(textMap.vals(securityVerificationResults));
    let filteredResults = Array.filter<SecurityVerificationResult>(
      allResults,
      func(result : SecurityVerificationResult) : Bool {
        result.encryptionStatus == status;
      }
    );
    filteredResults;
  };

  // Admin-only - get security verification results by time range
  public query ({ caller }) func getSecurityVerificationResultsByTimeRange(startTime : Int, endTime : Int) : async [SecurityVerificationResult] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security verification results");
    };

    let allResults = Iter.toArray(textMap.vals(securityVerificationResults));
    let filteredResults = Array.filter<SecurityVerificationResult>(
      allResults,
      func(result : SecurityVerificationResult) : Bool {
        result.timestamp >= startTime and result.timestamp <= endTime
      }
    );
    filteredResults;
  };

  // Admin-only - get security audit summary
  public query ({ caller }) func getSecurityAuditSummary() : async {
    totalLogs : Nat;
    verifiedCount : Nat;
    unverifiedCount : Nat;
    failedCount : Nat;
    phoneToPhoneCount : Nat;
    cardToPhoneCount : Nat;
    completedCount : Nat;
    failedTransactionCount : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can get security audit summary");
    };

    let allLogs = Iter.toArray(textMap.vals(securityAuditLogs));
    let totalLogs = allLogs.size();
    var verifiedCount = 0;
    var unverifiedCount = 0;
    var failedCount = 0;
    var phoneToPhoneCount = 0;
    var cardToPhoneCount = 0;
    var completedCount = 0;
    var failedTransactionCount = 0;

    for (log in allLogs.vals()) {
      switch (log.encryptionStatus) {
        case (#verified) { verifiedCount += 1 };
        case (#unverified) { unverifiedCount += 1 };
        case (#failed) { failedCount += 1 };
      };

      switch (log.transferType) {
        case (#phoneToPhone) { phoneToPhoneCount += 1 };
        case (#cardToPhone) { cardToPhoneCount += 1 };
      };

      switch (log.status) {
        case (#completed) { completedCount += 1 };
        case (#failed) { failedTransactionCount += 1 };
        case (_) {};
      };
    };

    {
      totalLogs;
      verifiedCount;
      unverifiedCount;
      failedCount;
      phoneToPhoneCount;
      cardToPhoneCount;
      completedCount;
      failedTransactionCount;
    };
  };

  // Parental Monitoring Widget Functions

  // User (parent) can record child activity stats for their own children, admin can record for any
  public shared ({ caller }) func recordChildActivityStats(childId : Principal, parentId : Principal, totalTimeOnline : Nat, blockedAttempts : Nat, safeSearchEnabled : Bool, lastActivity : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can record child activity stats");
    };

    // Users can only record stats for their own children (where they are the parent), admins can record for any
    if (not Principal.equal(caller, parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only record stats for your own children");
    };

    let stats : ChildActivityStats = {
      childId;
      parentId;
      totalTimeOnline;
      blockedAttempts;
      safeSearchEnabled;
      lastActivity;
    };

    childActivityStats := principalMap.put(childActivityStats, childId, stats);
  };

  // User (parent) can get child activity stats for their own children, admin can get any
  public query ({ caller }) func getChildActivityStats(childId : Principal) : async ?ChildActivityStats {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get child activity stats");
    };

    let stats = principalMap.get(childActivityStats, childId);
    
    switch (stats) {
      case null null;
      case (?s) {
        // Users can only view stats for their own children, admins can view any
        if (not Principal.equal(caller, s.parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only view stats for your own children");
        };
        stats;
      };
    };
  };

  // User (parent) can record filter status for themselves, admin can record for any
  public shared ({ caller }) func recordFilterStatus(parentId : Principal, level : Text, isActive : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can record filter status");
    };

    // Users can only record their own filter status, admins can record for any
    if (not Principal.equal(caller, parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only record your own filter status");
    };

    let status : FilterStatus = {
      level;
      isActive;
      lastUpdated = Time.now();
    };

    filterStatuses := principalMap.put(filterStatuses, parentId, status);
  };

  // User (parent) can get their own filter status, admin can get any
  public query ({ caller }) func getFilterStatus(parentId : Principal) : async ?FilterStatus {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get filter status");
    };

    // Users can only view their own filter status, admins can view any
    if (not Principal.equal(caller, parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own filter status");
    };

    principalMap.get(filterStatuses, parentId);
  };

  // User (parent) can record reinforcement progress for their own children, admin can record for any
  public shared ({ caller }) func recordReinforcementProgress(childId : Principal, parentId : Principal, positiveActions : Nat, milestonesAchieved : Nat, lastReward : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can record reinforcement progress");
    };

    // Users can only record progress for their own children, admins can record for any
    if (not Principal.equal(caller, parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only record progress for your own children");
    };

    let progress : ReinforcementProgress = {
      childId;
      parentId;
      positiveActions;
      milestonesAchieved;
      lastReward;
    };

    reinforcementProgress := principalMap.put(reinforcementProgress, childId, progress);
  };

  // User (parent) can get reinforcement progress for their own children, admin can get any
  public query ({ caller }) func getReinforcementProgress(childId : Principal) : async ?ReinforcementProgress {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get reinforcement progress");
    };

    let progress = principalMap.get(reinforcementProgress, childId);
    
    switch (progress) {
      case null null;
      case (?p) {
        // Users can only view progress for their own children, admins can view any
        if (not Principal.equal(caller, p.parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only view progress for your own children");
        };
        progress;
      };
    };
  };

  // User (parent) can record their own widget config, admin can record for any
  public shared ({ caller }) func recordWidgetConfig(parentId : Principal, widgetSize : Text, theme : Text, refreshInterval : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can record widget config");
    };

    // Users can only record their own widget config, admins can record for any
    if (not Principal.equal(caller, parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only record your own widget config");
    };

    let config : WidgetConfig = {
      parentId;
      widgetSize;
      theme;
      refreshInterval;
      lastUpdated = Time.now();
    };

    widgetConfigs := principalMap.put(widgetConfigs, parentId, config);
  };

  // User (parent) can get their own widget config, admin can get any
  public query ({ caller }) func getWidgetConfig(parentId : Principal) : async ?WidgetConfig {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get widget config");
    };

    // Users can only view their own widget config, admins can view any
    if (not Principal.equal(caller, parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own widget config");
    };

    principalMap.get(widgetConfigs, parentId);
  };

  // User (parent) can generate auth token for themselves, admin can generate for any
  public shared ({ caller }) func generateWidgetAuthToken(parentId : Principal, expiresIn : Nat) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can generate widget auth tokens");
    };

    // Users can only generate tokens for themselves, admins can generate for any
    if (not Principal.equal(caller, parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only generate auth tokens for yourself");
    };

    let token = Int.toText(Time.now()) # Principal.toText(parentId);
    let authToken : WidgetAuthToken = {
      parentId;
      token;
      expiresAt = Time.now() + expiresIn;
      createdAt = Time.now();
    };

    widgetAuthTokens := textMap.put(widgetAuthTokens, token, authToken);
    token;
  };

  // User (parent) can validate their own auth token, admin can validate any
  public query ({ caller }) func validateWidgetAuthToken(token : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can validate widget auth tokens");
    };

    switch (textMap.get(widgetAuthTokens, token)) {
      case null false;
      case (?authToken) {
        // Users can only validate their own tokens, admins can validate any
        if (not Principal.equal(caller, authToken.parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Can only validate your own auth tokens");
        };
        Time.now() <= authToken.expiresAt;
      };
    };
  };

  // User (parent) can get their own widget data, admin can get any
  public query ({ caller }) func getWidgetData(parentId : Principal) : async ?WidgetData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get widget data");
    };

    // Users can only view their own widget data, admins can view any
    if (not Principal.equal(caller, parentId) and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own widget data");
    };

    // Filter child stats to only include children belonging to this parent
    let allChildStats = Iter.toArray(principalMap.vals(childActivityStats));
    let parentChildStats = Array.filter<ChildActivityStats>(
      allChildStats,
      func(stats : ChildActivityStats) : Bool {
        Principal.equal(stats.parentId, parentId)
      }
    );

    let filterStatus = switch (principalMap.get(filterStatuses, parentId)) {
      case null {
        {
          level = "default";
          isActive = true;
          lastUpdated = Time.now();
        };
      };
      case (?status) status;
    };

    // Filter reinforcement progress to only include children belonging to this parent
    let allProgress = Iter.toArray(principalMap.vals(reinforcementProgress));
    let parentProgress = Array.filter<ReinforcementProgress>(
      allProgress,
      func(progress : ReinforcementProgress) : Bool {
        Principal.equal(progress.parentId, parentId)
      }
    );

    ?{
      parentId;
      childStats = parentChildStats;
      lastAlert = null;
      filterStatus;
      reinforcementProgress = parentProgress;
      timestamp = Time.now();
    };
  };

  // User (parent) can get their own widget data
  public query ({ caller }) func getCallerWidgetData() : async ?WidgetData {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only users can get widget data");
    };

    // Filter child stats to only include children belonging to this parent
    let allChildStats = Iter.toArray(principalMap.vals(childActivityStats));
    let parentChildStats = Array.filter<ChildActivityStats>(
      allChildStats,
      func(stats : ChildActivityStats) : Bool {
        Principal.equal(stats.parentId, caller)
      }
    );

    let filterStatus = switch (principalMap.get(filterStatuses, caller)) {
      case null {
        {
          level = "default";
          isActive = true;
          lastUpdated = Time.now();
        };
      };
      case (?status) status;
    };

    // Filter reinforcement progress to only include children belonging to this parent
    let allProgress = Iter.toArray(principalMap.vals(reinforcementProgress));
    let parentProgress = Array.filter<ReinforcementProgress>(
      allProgress,
      func(progress : ReinforcementProgress) : Bool {
        Principal.equal(progress.parentId, caller)
      }
    );

    ?{
      parentId = caller;
      childStats = parentChildStats;
      lastAlert = null;
      filterStatus;
      reinforcementProgress = parentProgress;
      timestamp = Time.now();
    };
  };
};

