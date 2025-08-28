'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, Clock, Wifi, WifiOff } from 'lucide-react';

const NiftyTracker = () => {
  const [niftyData, setNiftyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isOnline, setIsOnline] = useState(true);

  // Your live backend URL
  const API_URL = 'https://nifty-backend.vercel.app/api/nifty';

  const fetchNiftyData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setNiftyData(data);
      setLastUpdate(new Date());
      setIsOnline(true);
      
    } catch (err) {
      console.error('Failed to fetch Nifty data:', err);
      setError(err.message);
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNiftyData();
    
    // Auto-refresh every 2 minutes (120000ms)
    const interval = setInterval(fetchNiftyData, 120000);
    
    return () => clearInterval(interval);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatTime = (date) => {
    return date ? date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }) : '';
  };

  const calculateChange = () => {
    if (!niftyData) return { change: 0, percentage: 0 };
    
    const change = niftyData.c - niftyData.pc;
    const percentage = (change / niftyData.pc) * 100;
    
    return { change, percentage };
  };

  const { change, percentage } = calculateChange();
  const isPositive = change >= 0;

  if (loading && !niftyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Loading live Nifty data...</p>
          <p className="text-sm text-gray-500 mt-2">Connecting to your backend</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Live Nifty Tracker
          </h1>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-green-500" />
                <span>Connected • {niftyData?.source || 'Live Data'}</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span>Connection Issues</span>
              </>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-center">
            <p className="font-medium">Unable to fetch live data</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Main Price Card */}
        {niftyData && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">NIFTY 50</h2>
              
              {/* Current Price */}
              <div className="text-5xl font-bold text-gray-800 mb-4">
                ₹{formatPrice(niftyData.c)}
              </div>
              
              {/* Change and Percentage */}
              <div className={`flex items-center justify-center gap-2 text-xl font-semibold ${
                isPositive ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPositive ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <TrendingDown className="w-6 h-6" />
                )}
                <span>
                  {isPositive ? '+' : ''}₹{formatPrice(Math.abs(change))} 
                  ({isPositive ? '+' : ''}{percentage.toFixed(2)}%)
                </span>
              </div>
              
              {/* Last Update */}
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Last updated: {formatTime(lastUpdate)}</span>
                {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              </div>
            </div>
          </div>
        )}

        {/* Detailed Stats */}
        {niftyData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">OPEN</h3>
              <p className="text-2xl font-bold text-gray-800">₹{formatPrice(niftyData.o)}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">HIGH</h3>
              <p className="text-2xl font-bold text-green-600">₹{formatPrice(niftyData.h)}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">LOW</h3>
              <p className="text-2xl font-bold text-red-600">₹{formatPrice(niftyData.l)}</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-1">PREV CLOSE</h3>
              <p className="text-2xl font-bold text-gray-800">₹{formatPrice(niftyData.pc)}</p>
            </div>
          </div>
        )}

        {/* Refresh Button */}
        <div className="text-center">
          <button
            onClick={fetchNiftyData}
            disabled={loading}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white shadow-lg transition-all ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-xl active:scale-95'
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </button>
          
          <p className="text-sm text-gray-500 mt-3">
            Auto-refreshes every 2 minutes
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>Data source: {niftyData?.source || 'Live API'}</p>
          <p>Powered by your custom Vercel backend</p>
        </div>
      </div>
    </div>
  );
};

export default NiftyTracker;
