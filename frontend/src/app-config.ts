// App Configuration
// Key Innovations Ecosystem - Integrated Multi-App Platform

type AppVersion = 'ecosystem';

const APP_VERSION: AppVersion = 'ecosystem';

function getAppConfig(version: AppVersion) {
  return {
    isAdminVersion: false,
    isClientVersion: true,
    appTitle: 'Key Innovations - Integrated Ecosystem',
    appDescription: 'Corporate website, CyberGuard parental control system, and NFC Transfer application - all integrated with unified authentication and dashboard connectivity',
    ecosystemApps: [
      {
        id: 'website',
        name: 'Key Innovations Website',
        description: 'Corporate portfolio with active Stripe integration',
        icon: 'building',
      },
      {
        id: 'cyberguard',
        name: 'CyberGuard',
        description: 'Parental control system with age-based filtering',
        icon: 'shield',
      },
      {
        id: 'nfctransfer',
        name: 'NFC Transfer',
        description: 'Secure digital wallet with NFC technology',
        icon: 'wallet',
      },
    ],
  };
}

export { APP_VERSION };
export const APP_CONFIG = getAppConfig(APP_VERSION);
