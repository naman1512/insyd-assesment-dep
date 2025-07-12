'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { apiService } from '@/services/api';
import { User } from '@/types';

export default function UserSelector() {
  const { currentUser, setCurrentUser, users, setUsers } = useApp();
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '' });

  const loadUsers = useCallback(async () => {
    try {
      const usersList = await apiService.getUsers();
      setUsers(usersList);
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  }, [setUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.username || !newUser.email) return;

    try {
      const user = await apiService.createUser(newUser);
      setUsers([...users, user]);
      setNewUser({ username: '', email: '' });
      setIsCreating(false);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Select User</h2>
      
      {currentUser ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-3">
              <span className="text-white font-medium">
                {currentUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentUser.username}</p>
              <p className="text-sm text-gray-600">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="w-full py-2 px-4 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Switch User
          </button>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="w-full p-3 text-left border rounded hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                  {user._count && (
                    <div className="text-xs text-gray-500">
                      {user._count.followers} followers • {user._count.following} following
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {!isCreating ? (
        <button
          onClick={() => setIsCreating(true)}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Create New User
        </button>
      ) : (
        <form onSubmit={handleCreateUser} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
