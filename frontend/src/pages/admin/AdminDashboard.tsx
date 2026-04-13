import { Link } from '@tanstack/react-router';
import { Shield, FileText, Home, Briefcase, Image, Mail, CreditCard, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { AdminAuth } from '../../components/AdminAuth';

export function AdminDashboard() {
  const adminCards = [
    {
      title: 'Security Audit',
      description: 'View encryption verification logs and transaction security',
      icon: Shield,
      link: '/admin/security-audit',
      color: 'text-primary',
    },
    {
      title: 'PDF Quick Start Guide',
      description: 'Generate and manage PDF documentation',
      icon: FileText,
      link: '/admin/pdf-guide',
      color: 'text-blue-600',
    },
    {
      title: 'Home Content',
      description: 'Edit hero text and mission statement',
      icon: Home,
      link: '/admin/home',
      color: 'text-green-600',
    },
    {
      title: 'Services',
      description: 'Manage service offerings',
      icon: Briefcase,
      link: '/admin/services',
      color: 'text-purple-600',
    },
    {
      title: 'Portfolio',
      description: 'Manage portfolio projects',
      icon: Image,
      link: '/admin/portfolio',
      color: 'text-orange-600',
    },
    {
      title: 'Contact Info',
      description: 'Update company contact information',
      icon: Mail,
      link: '/admin/contact',
      color: 'text-pink-600',
    },
    {
      title: 'Payment Settings',
      description: 'Configure Stripe payment integration',
      icon: CreditCard,
      link: '/admin/payment',
      color: 'text-yellow-600',
    },
    {
      title: 'NFC Settings',
      description: 'Manage NFC transfer settings',
      icon: Settings,
      link: '/settings',
      color: 'text-teal-600',
    },
  ];

  return (
    <AdminAuth>
      <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your NFC Transfer application and security settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {adminCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link key={card.link} to={card.link}>
                <Card className="h-full hover:shadow-lg transition-all cursor-pointer border-2 hover:border-primary">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 ${card.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle>{card.title}</CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </AdminAuth>
  );
}
