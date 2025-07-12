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
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Users
        </h2>
        <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
      </div>
      
      {currentUser ? (
        <div className="mb-6 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20 backdrop-blur-sm">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
              <span className="text-white font-bold text-lg">
                {currentUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-100 text-lg">{currentUser.username}</p>
              <p className="text-slate-300 text-sm">{currentUser.email}</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            className="w-full py-3 px-4 bg-gradient-to-r from-slate-700 to-slate-600 text-slate-200 rounded-xl hover:from-slate-600 hover:to-slate-500 transition-all duration-300 font-medium border border-slate-600/50"
          >
            Switch User
          </button>
        </div>
      ) : (
        <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="w-full p-4 text-left border border-slate-600/30 rounded-xl hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-blue-500 group-hover:to-purple-600 rounded-full flex items-center justify-center mr-4 transition-all duration-300 shadow-lg">
                  <span className="text-slate-200 group-hover:text-white text-sm font-bold transition-colors duration-300">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-100 group-hover:text-white transition-colors duration-300">{user.username}</div>
                  <div className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">{user.email}</div>
                  {user._count && (
                    <div className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300 mt-1">
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
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-medium shadow-lg border border-blue-500/20"
        >
          Create New User
        </button>
      ) : (
        <form onSubmit={handleCreateUser} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser(prev => ({ ...prev, username: e.target.value }))}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            className="w-full p-3 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
            required
          />
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-500 hover:to-purple-500 transition-all duration-300 font-medium shadow-lg"
            >
              Create
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="flex-1 bg-slate-700 text-slate-300 py-3 px-4 rounded-xl hover:bg-slate-600 transition-all duration-300 font-medium border border-slate-600/50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
