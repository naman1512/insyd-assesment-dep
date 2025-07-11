'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
  duration?: number;
  onClose: () => void;
}

export default function Toast({ message, type = 'success', duration = 3000, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'info':
        return 'ℹ';
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return '✓';
    }
  };

  const getColorClasses = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
      case 'info':
        return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100';
      case 'warning':
        return 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-yellow-100';
      case 'error':
        return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100';
      default:
        return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${getColorClasses()} border rounded-lg p-4 shadow-xl hover:shadow-2xl transition-all duration-300 max-w-sm`}>
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mr-3 shadow-md">
            <span className="text-white font-bold">
              {getIcon()}
            </span>
          </div>
          <div className="flex-1">
            <p className="text-gray-800 font-medium leading-relaxed">
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 text-gray-500 hover:text-gray-700 transition-colors duration-200"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}
