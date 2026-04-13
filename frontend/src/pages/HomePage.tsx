import { Link } from '@tanstack/react-router';
import { Wallet, Shield, Building2, ArrowRight, CheckCircle2, Zap, Lock, Globe } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export function HomePage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 sm:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary mb-6 sm:mb-8">
              <Building2 className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Key Innovations Ecosystem
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto">
              Integrated platform featuring corporate website, CyberGuard parental control system, and NFC Transfer application. All connected with unified authentication and dashboard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <>
                  <Link to="/wallet">
                    <Button size="lg" className="w-full sm:w-auto">
                      <Wallet className="mr-2 h-5 w-5" />
                      NFC Wallet
                    </Button>
                  </Link>
                  <Link to="/parental-widget">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto">
                      <Shield className="mr-2 h-5 w-5" />
                      CyberGuard
                    </Button>
                  </Link>
                </>
              ) : (
                <p className="text-muted-foreground">Please login to access the ecosystem</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Apps Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Integrated Applications</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three powerful applications working together seamlessly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-16">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Corporate Website</CardTitle>
                <CardDescription>
                  Professional portfolio with active Stripe integration and SSL verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Service catalog & pricing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Secure payment processing</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Portfolio showcase</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Contact management</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>CyberGuard</CardTitle>
                <CardDescription>
                  Comprehensive parental control with age-based filtering and monitoring
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Real-time content filtering</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Age-based reinforcement</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Language filtering</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Parental monitoring widget</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>NFC Transfer</CardTitle>
                <CardDescription>
                  Secure digital wallet with bidirectional NFC transfer capabilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Phone-to-phone transfers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Card-to-phone transfers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Security audit layer</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-success" />
                    <span>Parental oversight</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Integration Features */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ecosystem Integration</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Seamless connectivity across all applications
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Lock className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-lg">Unified Auth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Single login across all ecosystem applications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-lg">Admin Dashboard</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Centralized management for all applications
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-lg">Real-Time Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Live data synchronization between apps
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-success" />
                </div>
                <CardTitle className="text-lg">PWA Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Install as native app on any device
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Platform Features</h2>
              <p className="text-lg text-muted-foreground">
                Built on the Internet Computer with enterprise-grade security
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">End-to-End Testing</h3>
                  <p className="text-sm text-muted-foreground">
                    Comprehensive testing framework for all app interactions and integrations
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">SSL Verification</h3>
                  <p className="text-sm text-muted-foreground">
                    Full SSL certificate verification and secure HTTPS implementation
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Secure Transactions</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrated payment and data transfer security with audit trails
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cross-App Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Integrated reporting across website, CyberGuard, and NFC Transfer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Login to access the full Key Innovations ecosystem with all integrated applications
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
