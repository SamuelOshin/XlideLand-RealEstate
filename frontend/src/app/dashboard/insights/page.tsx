'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Map,
  DollarSign,
  Home,
  Calendar,
  Target,
  Filter,
  Download,
  RefreshCw,
  MapPin,
  Clock,
  Users,
  Building2,
  AlertTriangle,
  Info,
  Star,
  Eye
} from 'lucide-react'

// Mock market data - in real app this would come from API
const mockMarketData = {
  overview: {
    avgPrice: 485000,
    priceChange: 5.2,
    medianPrice: 425000,
    inventory: 1247,
    inventoryChange: -12.3,
    daysOnMarket: 28,
    daysOnMarketChange: -15.2,
    soldLastMonth: 156,
    soldChange: 8.7
  },
  priceHistory: [
    { month: 'Jan', price: 465000 },
    { month: 'Feb', price: 470000 },
    { month: 'Mar', price: 468000 },
    { month: 'Apr', price: 475000 },
    { month: 'May', price: 480000 },
    { month: 'Jun', price: 485000 }
  ],
  neighborhoods: [
    {
      name: 'Back Bay',
      avgPrice: 1250000,
      priceChange: 8.5,
      inventory: 45,
      daysOnMarket: 21,
      hotness: 'very-hot'
    },
    {
      name: 'South End',
      avgPrice: 985000,
      priceChange: 6.2,
      inventory: 78,
      daysOnMarket: 25,
      hotness: 'hot'
    },
    {
      name: 'Cambridge',
      avgPrice: 875000,
      priceChange: 4.1,
      inventory: 112,
      daysOnMarket: 32,
      hotness: 'warm'
    },
    {
      name: 'Somerville',
      avgPrice: 650000,
      priceChange: 7.3,
      inventory: 89,
      daysOnMarket: 28,
      hotness: 'hot'
    },
    {
      name: 'Charlestown',
      avgPrice: 725000,
      priceChange: 3.8,
      inventory: 67,
      daysOnMarket: 35,
      hotness: 'warm'
    },
    {
      name: 'North End',
      avgPrice: 1100000,
      priceChange: -2.1,
      inventory: 23,
      daysOnMarket: 45,
      hotness: 'cool'
    }
  ],
  propertyTypes: [
    { type: 'Condo', percentage: 45, avgPrice: 425000, change: 6.2 },
    { type: 'Single Family', percentage: 30, avgPrice: 785000, change: 4.8 },
    { type: 'Townhouse', percentage: 15, avgPrice: 650000, change: 7.1 },
    { type: 'Multi-Family', percentage: 10, avgPrice: 520000, change: 3.2 }
  ],
  predictions: {
    nextQuarter: {
      priceChange: 3.5,
      confidence: 'medium',
      factors: ['Low inventory', 'High demand', 'Interest rates']
    },
    yearEnd: {
      priceChange: 8.2,
      confidence: 'high',
      factors: ['Economic growth', 'Population increase', 'Infrastructure improvements']
    }
  },
  alerts: [
    {
      id: '1',
      type: 'price-drop',
      title: 'Price Drops in Back Bay',
      description: '3 properties in your saved list have reduced prices',
      severity: 'high',
      timestamp: '2024-06-21T10:00:00Z'
    },
    {
      id: '2',
      type: 'market-trend',
      title: 'Rising Demand in Somerville',
      description: 'Properties are selling 25% faster than last month',
      severity: 'medium',
      timestamp: '2024-06-21T08:30:00Z'
    },
    {
      id: '3',
      type: 'new-listings',
      title: 'New Luxury Listings',
      description: '5 new properties match your high-end criteria',
      severity: 'low',
      timestamp: '2024-06-20T16:45:00Z'
    }
  ]
}

export default function InsightsPage() {
  const { user, role } = useAuth()
  const [timeRange, setTimeRange] = useState('6m') // '1m' | '3m' | '6m' | '1y'
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all')
  const [marketData, setMarketData] = useState(mockMarketData)
  const [loading, setLoading] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatPercentage = (value: number) => {
    const sign = value > 0 ? '+' : ''
    return `${sign}${value.toFixed(1)}%`
  }

  const getHotnessColor = (hotness: string) => {
    switch (hotness) {
      case 'very-hot': return 'bg-red-100 text-red-800'
      case 'hot': return 'bg-orange-100 text-orange-800'
      case 'warm': return 'bg-yellow-100 text-yellow-800'
      case 'cool': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getHotnessIcon = (hotness: string) => {
    switch (hotness) {
      case 'very-hot': return '🔥🔥'
      case 'hot': return '🔥'
      case 'warm': return '📈'
      case 'cool': return '❄️'
      default: return '➡️'
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'price-drop': return <TrendingDown className="h-5 w-5 text-green-600" />
      case 'market-trend': return <TrendingUp className="h-5 w-5 text-blue-600" />
      case 'new-listings': return <Building2 className="h-5 w-5 text-purple-600" />
      default: return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getAlertSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-l-red-500 bg-red-50'
      case 'medium': return 'border-l-yellow-500 bg-yellow-50'
      case 'low': return 'border-l-blue-500 bg-blue-50'
      default: return 'border-l-gray-500 bg-gray-50'
    }
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    format = 'number' 
  }: { 
    title: string
    value: number
    change: number
    icon: any
    format?: 'number' | 'currency' | 'percentage'
  }) => {
    const formattedValue = format === 'currency' 
      ? formatPrice(value)
      : format === 'percentage'
      ? formatPercentage(value)
      : value.toLocaleString()

    const isPositive = change > 0
    const changeColor = isPositive ? 'text-green-600' : 'text-red-600'
    const TrendIcon = isPositive ? TrendingUp : TrendingDown

    return (
      <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-emerald-50 rounded-lg">
            <Icon className="h-6 w-6 text-emerald-600" />
          </div>
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            <TrendIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{formatPercentage(change)}</span>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-2xl font-bold text-gray-900">{formattedValue}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Market Insights</h1>
          <p className="text-gray-600 mt-1">
            Stay informed with real-time market data and trends
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          >
            <option value="1m">Last Month</option>
            <option value="3m">Last 3 Months</option>
            <option value="6m">Last 6 Months</option>
            <option value="1y">Last Year</option>
          </select>
          
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          
          <button 
            onClick={() => setLoading(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Price"
          value={marketData.overview.avgPrice}
          change={marketData.overview.priceChange}
          icon={DollarSign}
          format="currency"
        />
        <StatCard
          title="Properties Sold"
          value={marketData.overview.soldLastMonth}
          change={marketData.overview.soldChange}
          icon={Home}
        />
        <StatCard
          title="Days on Market"
          value={marketData.overview.daysOnMarket}
          change={marketData.overview.daysOnMarketChange}
          icon={Calendar}
        />
        <StatCard
          title="Active Inventory"
          value={marketData.overview.inventory}
          change={marketData.overview.inventoryChange}
          icon={Building2}
        />
      </div>

      {/* Price Trends Chart */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Price Trends</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Boston Metro Area</span>
            <BarChart3 className="h-5 w-5 text-emerald-600" />
          </div>
        </div>
        
        {/* Simple chart visualization */}
        <div className="space-y-4">
          {marketData.priceHistory.map((data, index) => (
            <div key={data.month} className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-12">{data.month}</span>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                    style={{ width: `${(data.price / 500000) * 100}%` }}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-semibold text-gray-900 w-24 text-right">
                {formatPrice(data.price)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Neighborhoods and Property Types */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Neighborhoods */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Neighborhood Insights</h2>
            <Map className="h-5 w-5 text-emerald-600" />
          </div>
          
          <div className="space-y-4">
            {marketData.neighborhoods.map((neighborhood, index) => (
              <div key={neighborhood.name} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-emerald-200 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{getHotnessIcon(neighborhood.hotness)}</div>
                  <div>
                    <h3 className="font-medium text-gray-900">{neighborhood.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{neighborhood.inventory} properties</span>
                      <span>•</span>
                      <span>{neighborhood.daysOnMarket} days avg</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="font-semibold text-gray-900">{formatPrice(neighborhood.avgPrice)}</div>
                  <div className={`text-sm font-medium ${
                    neighborhood.priceChange > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatPercentage(neighborhood.priceChange)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Property Types */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Property Types</h2>
            <PieChart className="h-5 w-5 text-emerald-600" />
          </div>
          
          <div className="space-y-4">
            {marketData.propertyTypes.map((type, index) => (
              <div key={type.type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">{type.type}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-semibold text-gray-900">{formatPrice(type.avgPrice)}</span>
                    <span className={`text-xs font-medium ${
                      type.change > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formatPercentage(type.change)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                      style={{ width: `${type.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 w-10 text-right">{type.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Market Predictions */}
      <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-emerald-900">Market Predictions</h2>
          <Target className="h-5 w-5 text-emerald-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-emerald-900 mb-2">Next Quarter</h3>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl font-bold text-emerald-900">
                {formatPercentage(marketData.predictions.nextQuarter.priceChange)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                marketData.predictions.nextQuarter.confidence === 'high' 
                  ? 'bg-green-100 text-green-800'
                  : marketData.predictions.nextQuarter.confidence === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {marketData.predictions.nextQuarter.confidence} confidence
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {marketData.predictions.nextQuarter.factors.map(factor => (
                <span key={factor} className="px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full">
                  {factor}
                </span>
              ))}
            </div>
          </div>
          
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4">
            <h3 className="font-semibold text-emerald-900 mb-2">Year End</h3>
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-2xl font-bold text-emerald-900">
                {formatPercentage(marketData.predictions.yearEnd.priceChange)}
              </span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                marketData.predictions.yearEnd.confidence === 'high' 
                  ? 'bg-green-100 text-green-800'
                  : marketData.predictions.yearEnd.confidence === 'medium'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {marketData.predictions.yearEnd.confidence} confidence
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {marketData.predictions.yearEnd.factors.map(factor => (
                <span key={factor} className="px-2 py-1 bg-emerald-200 text-emerald-800 text-xs rounded-full">
                  {factor}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Alerts */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Market Alerts</h2>
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
            Manage Alerts
          </button>
        </div>
        
        <div className="space-y-4">
          {marketData.alerts.map(alert => (
            <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getAlertSeverityColor(alert.severity)}`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 mb-1">{alert.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
