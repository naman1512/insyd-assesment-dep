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
      console.log('Loading users...');
      const usersList = await apiService.getUsers();
      console.log('Users loaded:', usersList);
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
    <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-200">
      <div className="flex items-center mb-6">
        <div className="w-3 h-3 bg-gray-800 rounded-full mr-3"></div>
        <h2 className="text-2xl font-bold text-gray-800">User Selection</h2>
      </div>
      
      {currentUser ? (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-md">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center shadow-md mr-4">
              <span className="text-white font-bold text-lg">
                {currentUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-lg">{currentUser.username}</p>
              <p className="text-gray-600 text-sm">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="w-full mt-3 py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 hover:text-gray-800 transition-all duration-200 border border-gray-300 hover:border-gray-400 shadow-md"
          >
            Switch User
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {users.map(user => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 group shadow-md hover:shadow-lg hover:border-gray-300"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shadow-md mr-4 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800 group-hover:text-gray-900">{user.username}</div>
                  <div className="text-gray-600 text-sm group-hover:text-gray-700">{user.email}</div>
                  {user._count && (
                    <div className="text-xs text-gray-500 mt-1 group-hover:text-gray-600">
                      {user._count.followers} followers • {user._count.following} following • {user._count.posts} posts
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
          className="w-full bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          Create New User
        </button>
      ) : (
        <form onSubmit={handleCreateUser} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={newUser.username}
              onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={newUser.email}
              onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
              required
            />
          </div>
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-400 hover:text-gray-800 transition-all duration-200 shadow-md"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
