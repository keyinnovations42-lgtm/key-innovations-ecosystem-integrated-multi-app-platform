import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-lg font-bold text-primary-foreground">KI</span>
              </div>
              <span className="text-lg font-bold text-primary">Key Innovations</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Integrated ecosystem of corporate website, CyberGuard parental control, and NFC Transfer application.
            </p>
          </div>

          {/* Ecosystem Apps */}
          <div>
            <h3 className="font-semibold text-base mb-3">Ecosystem Apps</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Corporate Website & Services</li>
              <li>CyberGuard Parental Control</li>
              <li>NFC Transfer Wallet</li>
              <li>Unified Admin Dashboard</li>
            </ul>
          </div>

          {/* Security Info */}
          <div>
            <h3 className="font-semibold text-base mb-3">Security & Privacy</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>End-to-end encryption</li>
              <li>SSL verification</li>
              <li>COPPA/GDPR compliant</li>
              <li>Secure authentication</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-muted-foreground">
            <p className="flex items-center justify-center gap-1 flex-wrap text-center">
              © {currentYear}. Built with <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href="https://caffeine.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline touch-manipulation"
              >
                caffeine.ai
              </a>
            </p>
            <p className="text-center">
              Integrated multi-app platform on the Internet Computer
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
