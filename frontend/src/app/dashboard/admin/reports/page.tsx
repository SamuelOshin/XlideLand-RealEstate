'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import {
  BarChart3,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Eye,
  MessageSquare,
  Star,
  Activity,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ReportData {
  id: string;
  title: string;
  description: string;
  value: number;
  previousValue: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  icon: React.ComponentType<any>;
  color: string;
}

interface ActivityData {
  date: string;
  users: number;
  properties: number;
  inquiries: number;
  revenue: number;
}

export default function ReportsPage() {
  const { user, isAuthenticated, role } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [activityData, setActivityData] = useState<ActivityData[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    loadReportData();
  }, [isAuthenticated, role, router, dateRange]);

  const loadReportData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockReportData: ReportData[] = [
        {
          id: '1',
          title: 'Total Users',
          description: 'Active platform users',
          value: 1247,
          previousValue: 1180,
          trend: 'up',
          changePercent: 5.7,
          icon: Users,
          color: 'bg-blue-500'
        },
        {
          id: '2',
          title: 'Total Properties',
          description: 'Listed properties',
          value: 324,
          previousValue: 318,
          trend: 'up',
          changePercent: 1.9,
          icon: Building2,
          color: 'bg-green-500'
        },
        {
          id: '3',
          title: 'Total Revenue',
          description: 'Platform earnings',
          value: 45679,
          previousValue: 42340,
          trend: 'up',
          changePercent: 7.9,
          icon: DollarSign,
          color: 'bg-purple-500'
        },
        {
          id: '4',
          title: 'Page Views',
          description: 'Total page views',
          value: 89432,
          previousValue: 94220,
          trend: 'down',
          changePercent: -5.1,
          icon: Eye,
          color: 'bg-orange-500'
        },
        {
          id: '5',
          title: 'Inquiries',
          description: 'Customer inquiries',
          value: 567,
          previousValue: 523,
          trend: 'up',
          changePercent: 8.4,
          icon: MessageSquare,
          color: 'bg-cyan-500'
        },
        {
          id: '6',
          title: 'Avg Rating',
          description: 'Platform rating',
          value: 4.7,
          previousValue: 4.6,
          trend: 'up',
          changePercent: 2.2,
          icon: Star,
          color: 'bg-yellow-500'
        }
      ];

      const mockActivityData: ActivityData[] = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return {
          date: date.toISOString().split('T')[0],
          users: Math.floor(Math.random() * 200) + 50,
          properties: Math.floor(Math.random() * 20) + 5,
          inquiries: Math.floor(Math.random() * 50) + 10,
          revenue: Math.floor(Math.random() * 5000) + 1000
        };
      });

      setReportData(mockReportData);
      setActivityData(mockActivityData);
    } catch (error) {
      console.error('Error loading report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(value);
      case 'number':
        return new Intl.NumberFormat('en-US').format(value);
      case 'rating':
        return value.toFixed(1);
      default:
        return value.toString();
    }
  };

  const getValueType = (title: string) => {
    if (title.toLowerCase().includes('revenue')) return 'currency';
    if (title.toLowerCase().includes('rating')) return 'rating';
    return 'number';
  };

  const exportReport = (format: 'csv' | 'pdf') => {
    // Implement export functionality
  };

  if (!isAuthenticated || role !== 'admin') {
    return null;
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="text-gray-600">Platform performance and statistics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
            </div>
            <Button
              variant="outline"
              onClick={() => loadReportData()}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => exportReport('csv')}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => exportReport('pdf')}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md"
              >
                <Download className="h-4 w-4" />
                PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportData.map((metric) => {
            const IconComponent = metric.icon;
            return (
              <div key={metric.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${metric.color} bg-opacity-10`}>
                    <IconComponent className={`h-6 w-6 ${metric.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {metric.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : metric.trend === 'down' ? (
                      <TrendingDown className="h-4 w-4 text-red-500" />
                    ) : (
                      <Activity className="h-4 w-4 text-gray-500" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        metric.trend === 'up'
                          ? 'text-green-600'
                          : metric.trend === 'down'
                          ? 'text-red-600'
                          : 'text-gray-600'
                      }`}
                    >
                      {metric.changePercent > 0 ? '+' : ''}{metric.changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {formatValue(metric.value, getValueType(metric.title))}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
                  <p className="text-xs text-gray-500">{metric.description}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Daily Activity</h3>
              <p className="text-gray-600">User activity and platform usage over time</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-blue-600">Users</Badge>
              <Badge variant="outline" className="text-green-600">Properties</Badge>
              <Badge variant="outline" className="text-purple-600">Inquiries</Badge>
              <Badge variant="outline" className="text-orange-600">Revenue</Badge>
            </div>
          </div>
          
          {/* Simple Chart Representation */}
          <div className="space-y-4">
            {activityData.map((day, index) => (
              <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-medium text-gray-700">
                    {new Date(day.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-600">Users: {day.users}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-gray-600">Properties: {day.properties}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-600">Inquiries: {day.inquiries}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-600">
                        Revenue: {formatValue(day.revenue, 'currency')}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Visual bars */}
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <div
                      className="bg-blue-500 rounded-sm"
                      style={{
                        height: `${Math.max((day.users / 250) * 40, 4)}px`
                      }}
                    ></div>
                    <div className="text-xs text-center text-gray-500">Users</div>
                  </div>
                  <div className="space-y-1">
                    <div
                      className="bg-green-500 rounded-sm"
                      style={{
                        height: `${Math.max((day.properties / 25) * 40, 4)}px`
                      }}
                    ></div>
                    <div className="text-xs text-center text-gray-500">Properties</div>
                  </div>
                  <div className="space-y-1">
                    <div
                      className="bg-purple-500 rounded-sm"
                      style={{
                        height: `${Math.max((day.inquiries / 60) * 40, 4)}px`
                      }}
                    ></div>
                    <div className="text-xs text-center text-gray-500">Inquiries</div>
                  </div>
                  <div className="space-y-1">
                    <div
                      className="bg-orange-500 rounded-sm"
                      style={{
                        height: `${Math.max((day.revenue / 6000) * 40, 4)}px`
                      }}
                    ></div>
                    <div className="text-xs text-center text-gray-500">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Reports */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">User Reports</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Registrations</span>
                <span className="text-sm font-medium text-gray-900">+47 this week</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm font-medium text-gray-900">892 (71%)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Premium Users</span>
                <span className="text-sm font-medium text-gray-900">156 (12%)</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md" size="sm">
              View Detailed Report
            </Button>
          </div>

          {/* Property Reports */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Property Reports</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">New Listings</span>
                <span className="text-sm font-medium text-gray-900">+23 this week</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sold Properties</span>
                <span className="text-sm font-medium text-gray-900">14 this month</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Days on Market</span>
                <span className="text-sm font-medium text-gray-900">32 days</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md" size="sm">
              View Detailed Report
            </Button>
          </div>

          {/* Financial Reports */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Financial Reports</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Monthly Revenue</span>
                <span className="text-sm font-medium text-gray-900">$45,679</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Commission Earned</span>
                <span className="text-sm font-medium text-gray-900">$12,340</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg. Commission Rate</span>
                <span className="text-sm font-medium text-gray-900">2.7%</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 text-emerald-700 border-emerald-200 hover:border-emerald-300 shadow-sm font-medium transition-all duration-200 hover:shadow-md" size="sm">
              View Detailed Report
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
