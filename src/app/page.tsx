'use client';

import UserSelector from "@/components/UserSelector";
import NotificationPanel from "@/components/NotificationPanel";
import SocialActions from "@/components/SocialActions";
import { useApp } from "@/contexts/AppContext";

export default function Home() {
  const { currentUser } = useApp();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Insyd Social
          </h1>
          <p className="text-gray-600">
            Real-time social platform with instant notifications
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UserSelector />
          </div>

          <div className="lg:col-span-1">
            <SocialActions />
          </div>

          <div className="lg:col-span-1">
            <NotificationPanel />
          </div>
        </div>

        <footer className="text-center mt-8">
          <div className="bg-white rounded-lg p-4 shadow-lg border">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-gray-800 font-medium">
                {currentUser ? (
                  <span>Logged in as: {currentUser.username}</span>
                ) : (
                  'Please select a user to continue'
                )}
              </p>
            </div>
            <p className="text-gray-600 text-sm">
              Built with Next.js, Express.js, and Socket.IO
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
