import React, { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerWidgetData, useRecordFilterStatus } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Shield, Clock, AlertTriangle, Award, Eye, Pause, Play } from 'lucide-react';
import { toast } from 'sonner';

export function ParentalWidgetPage() {
  const navigate = useNavigate();
  const { identity, loginStatus } = useInternetIdentity();
  const { data: widgetData, isLoading, error, refetch } = useGetCallerWidgetData();
  const recordFilterStatus = useRecordFilterStatus();

  const isAuthenticated = !!identity;

  useEffect(() => {
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      refetch();
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  const handlePauseRestrictions = async () => {
    try {
      await recordFilterStatus.mutateAsync({
        level: widgetData?.filterStatus.level || 'default',
        isActive: false,
      });
      toast.success('Restrictions paused');
      refetch();
    } catch (error) {
      toast.error('Failed to pause restrictions');
    }
  };

  const handleResumeRestrictions = async () => {
    try {
      await recordFilterStatus.mutateAsync({
        level: widgetData?.filterStatus.level || 'default',
        isActive: true,
      });
      toast.success('Restrictions resumed');
      refetch();
    } catch (error) {
      toast.error('Failed to resume restrictions');
    }
  };

  const handleViewDashboard = () => {
    navigate({ to: '/admin' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-purple-200 dark:border-purple-800">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CyberGuard Widget
            </CardTitle>
            <CardDescription>Please log in to access parental monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-sm text-muted-foreground mb-4">
              Authentication required to view child activity and controls
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl border-purple-200 dark:border-purple-800">
          <CardContent className="p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 bg-purple-600 rounded-full animate-pulse" />
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-75" />
              <div className="w-4 h-4 bg-indigo-600 rounded-full animate-pulse delay-150" />
            </div>
            <p className="text-center mt-4 text-muted-foreground">Loading widget data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !widgetData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Error Loading Data</CardTitle>
            <CardDescription>Unable to fetch widget data</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} className="w-full">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalChildren = widgetData.childStats.length;
  const totalBlockedAttempts = widgetData.childStats.reduce((sum, child) => sum + Number(child.blockedAttempts), 0);
  const totalTimeOnline = widgetData.childStats.reduce((sum, child) => sum + Number(child.totalTimeOnline), 0);
  const totalMilestones = widgetData.reinforcementProgress.reduce((sum, progress) => sum + Number(progress.milestonesAchieved), 0);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-purple-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                CyberGuard Widget
              </h1>
              <p className="text-sm text-muted-foreground">Parental Monitoring Dashboard</p>
            </div>
          </div>
          <Badge variant={widgetData.filterStatus.isActive ? 'default' : 'secondary'} className="text-sm px-3 py-1">
            <Eye className="w-3 h-3 mr-1" />
            {widgetData.filterStatus.isActive ? 'Active' : 'Paused'}
          </Badge>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Children Monitored</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{totalChildren}</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 dark:border-blue-800 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300 flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Time Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{formatTime(totalTimeOnline)}</div>
            </CardContent>
          </Card>

          <Card className="border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-red-700 dark:text-red-300 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Blocked Attempts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-900 dark:text-red-100">{totalBlockedAttempts}</div>
            </CardContent>
          </Card>

          <Card className="border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300 flex items-center">
                <Award className="w-4 h-4 mr-1" />
                Milestones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">{totalMilestones}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Status */}
        <Card className="border-purple-200 dark:border-purple-800">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-purple-600" />
              Filter Status
            </CardTitle>
            <CardDescription>Current protection level and status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Protection Level</p>
                <p className="text-sm text-muted-foreground capitalize">{widgetData.filterStatus.level}</p>
              </div>
              <Badge variant={widgetData.filterStatus.isActive ? 'default' : 'secondary'} className="text-lg px-4 py-2">
                {widgetData.filterStatus.isActive ? 'Active' : 'Paused'}
              </Badge>
            </div>
            <Separator />
            <div className="flex space-x-2">
              {widgetData.filterStatus.isActive ? (
                <Button
                  onClick={handlePauseRestrictions}
                  variant="outline"
                  className="flex-1 border-orange-300 text-orange-700 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
                  disabled={recordFilterStatus.isPending}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Restrictions
                </Button>
              ) : (
                <Button
                  onClick={handleResumeRestrictions}
                  variant="outline"
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950"
                  disabled={recordFilterStatus.isPending}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume Restrictions
                </Button>
              )}
              <Button onClick={handleViewDashboard} className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                View Full Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Last Alert */}
        {widgetData.lastAlert && (
          <Card className="border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
            <CardHeader>
              <CardTitle className="flex items-center text-orange-700 dark:text-orange-300">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Last Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-medium text-orange-900 dark:text-orange-100">{widgetData.lastAlert.title}</p>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">{widgetData.lastAlert.message}</p>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                {new Date(Number(widgetData.lastAlert.timestamp) / 1000000).toLocaleString()}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Child Activity Details */}
        {widgetData.childStats.length > 0 && (
          <Card className="border-purple-200 dark:border-purple-800">
            <CardHeader>
              <CardTitle>Child Activity Details</CardTitle>
              <CardDescription>Individual monitoring statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {widgetData.childStats.map((child, index) => (
                  <div key={child.childId.toString()} className="p-4 rounded-lg border border-purple-100 dark:border-purple-800 bg-purple-50/50 dark:bg-purple-900/10">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium">Child {index + 1}</p>
                      <Badge variant={child.safeSearchEnabled ? 'default' : 'secondary'}>
                        {child.safeSearchEnabled ? 'Safe Search On' : 'Safe Search Off'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Time Online</p>
                        <p className="font-medium">{formatTime(Number(child.totalTimeOnline))}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Blocked</p>
                        <p className="font-medium">{Number(child.blockedAttempts)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Active</p>
                        <p className="font-medium">{new Date(Number(child.lastActivity) / 1000000).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reinforcement Progress */}
        {widgetData.reinforcementProgress.length > 0 && (
          <Card className="border-green-200 dark:border-green-800">
            <CardHeader>
              <CardTitle className="flex items-center text-green-700 dark:text-green-300">
                <Award className="w-5 h-5 mr-2" />
                Reinforcement Progress
              </CardTitle>
              <CardDescription>Positive behavior tracking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {widgetData.reinforcementProgress.map((progress, index) => (
                  <div key={progress.childId.toString()} className="p-4 rounded-lg border border-green-100 dark:border-green-800 bg-green-50/50 dark:bg-green-900/10">
                    <p className="font-medium mb-2">Child {index + 1}</p>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Positive Actions</p>
                        <p className="font-medium text-green-700 dark:text-green-300">{Number(progress.positiveActions)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Milestones</p>
                        <p className="font-medium text-green-700 dark:text-green-300">{Number(progress.milestonesAchieved)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Last Reward</p>
                        <p className="font-medium text-green-700 dark:text-green-300">
                          {new Date(Number(progress.lastReward) / 1000000).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer Info */}
        <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <p className="text-muted-foreground">
                Last updated: {new Date(Number(widgetData.timestamp) / 1000000).toLocaleString()}
              </p>
              <p className="text-muted-foreground">Auto-refreshes every 30 seconds</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
