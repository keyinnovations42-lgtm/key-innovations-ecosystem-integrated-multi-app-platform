import { Shield, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { EncryptionStatus } from '../backend';

interface SecurityIndicatorProps {
  status: EncryptionStatus;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export function SecurityIndicator({ status, size = 'md', showLabel = true, className = '' }: SecurityIndicatorProps) {
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';
  
  const getStatusConfig = () => {
    switch (status) {
      case EncryptionStatus.verified:
        return {
          icon: ShieldCheck,
          color: 'text-success',
          bgColor: 'bg-success/10',
          label: 'Verified',
          description: 'Encryption integrity verified successfully',
          badgeVariant: 'default' as const,
          badgeClass: 'bg-success hover:bg-success',
        };
      case EncryptionStatus.unverified:
        return {
          icon: Shield,
          color: 'text-warning',
          bgColor: 'bg-warning/10',
          label: 'Unverified',
          description: 'Encryption verification pending',
          badgeVariant: 'secondary' as const,
          badgeClass: 'bg-warning/20 text-warning hover:bg-warning/30',
        };
      case EncryptionStatus.failed:
        return {
          icon: ShieldX,
          color: 'text-destructive',
          bgColor: 'bg-destructive/10',
          label: 'Failed',
          description: 'Encryption verification failed',
          badgeVariant: 'destructive' as const,
          badgeClass: '',
        };
      default:
        return {
          icon: ShieldAlert,
          color: 'text-muted-foreground',
          bgColor: 'bg-muted',
          label: 'Unknown',
          description: 'Encryption status unknown',
          badgeVariant: 'outline' as const,
          badgeClass: '',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  if (!showLabel) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`inline-flex items-center justify-center rounded-full ${config.bgColor} p-2 ${className}`}>
              <Icon className={`${iconSize} ${config.color}`} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-medium">{config.label}</p>
            <p className="text-xs text-muted-foreground">{config.description}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant={config.badgeVariant} className={`${config.badgeClass} ${className}`}>
            <Icon className={`${iconSize} mr-1`} />
            {config.label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
