'use client';

import UserSelector from "@/components/UserSelector";
import NotificationPanel from "@/components/NotificationPanel";
import SocialActions from "@/components/SocialActions";
import { useApp } from "@/contexts/AppContext";

export default function Home() {
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-6 py-8">
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Insyd</span>
            <span className="text-gray-400 font-light block text-3xl md:text-4xl mt-2">
              Notification System
            </span>
          </h1>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-200">
              <div className="flex items-center justify-center mb-4">
                <div className="w-3 h-3 bg-gray-800 rounded-full mr-3"></div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Real-Time Notification Platform
                </h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">
                Enterprise-grade notification system built for the Architecture Industry. 
                Featuring real-time WebSocket communication, user management, and instant delivery across the platform.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-16">
          {/* Left Column - User Selection */}
          <div className="xl:col-span-1">
            <UserSelector />
          </div>

          {/* Center Column - Social Actions */}
          <div className="xl:col-span-1">
            <SocialActions />
          </div>

          {/* Right Column - Notifications */}
          <div className="xl:col-span-1">
            <NotificationPanel />
          </div>
        </div>

        {/* Technical Specifications */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-8 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">System Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 hover:bg-gray-700 transition-colors duration-200">
                  <span className="text-white text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Real-Time Engine</h3>
                <p className="text-gray-600">Socket.IO WebSocket implementation for instant notification delivery</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 hover:bg-gray-700 transition-colors duration-200">
                  <span className="text-white text-2xl">🔧</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Backend API</h3>
                <p className="text-gray-600">Express.js server with Prisma ORM and SQLite database</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-4 hover:bg-gray-700 transition-colors duration-200">
                  <span className="text-white text-2xl">⚛️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Frontend</h3>
                <p className="text-gray-600">Next.js 15 with TypeScript and modern React patterns</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center">
          <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-200">
            <div className="flex items-center justify-center space-x-4 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-800 font-medium">
                {currentUser ? (
                  <span>Active User: {currentUser.username}</span>
                ) : (
                  'System Ready - Select User to Begin'
                )}
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Production-ready notification infrastructure for scalable social platforms
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
