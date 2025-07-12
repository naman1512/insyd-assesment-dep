'use client';

import { useState, useEffect, useCallback } from 'react';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/contexts/ToastContext';
import { apiService } from '@/services/api';
import { User, Post } from '@/types';

export default function SocialActions() {
  const { currentUser, users } = useApp();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>([]);
  const [following, setFollowing] = useState<User[]>([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  const loadPosts = useCallback(async () => {
    try {
      const postsList = await apiService.getPosts();
      setPosts(postsList);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  }, []);

  const loadFollowing = useCallback(async () => {
    if (!currentUser) return;
    try {
      const followingList = await apiService.getUserFollowing(currentUser.id);
      setFollowing(followingList);
    } catch (error) {
      console.error('Failed to load following:', error);
    }
  }, [currentUser]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (currentUser) {
      loadFollowing();
    }
  }, [currentUser, loadFollowing]);

  const handleFollow = async (userId: string) => {
    if (!currentUser) return;
    try {
      await apiService.followUser(userId, currentUser.id);
      await loadFollowing();
      const user = users?.find(u => u.id === userId);
      showToast(`Now following ${user?.username || 'user'}`, 'success');
    } catch (error) {
      console.error('Failed to follow user:', error);
      showToast('Failed to follow user', 'error');
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!currentUser) return;
    try {
      await apiService.unfollowUser(userId, currentUser.id);
      await loadFollowing();
      const user = users?.find(u => u.id === userId);
      showToast(`Unfollowed ${user?.username || 'user'}`, 'info');
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      showToast('Failed to unfollow user', 'error');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !newPost.title || !newPost.content) return;

    try {
      const result = await apiService.createPost({
        userId: currentUser.id,
        title: newPost.title,
        content: newPost.content
      });
      
      setPosts(prev => [result.post, ...prev]);
      setNewPost({ title: '', content: '' });
      setIsCreatingPost(false);
      
      showToast(`Post created! ${result.notificationsSent} notifications sent.`, 'success');
    } catch (error) {
      console.error('Failed to create post:', error);
      showToast('Failed to create post', 'error');
    }
  };

  const isFollowing = (userId: string) => {
    return following.some(user => user.id === userId);
  };

  const otherUsers = users.filter(user => user && user.id !== currentUser?.id);

  if (!currentUser) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">👤</span>
          </div>
          <p className="text-slate-300 text-lg">Select a user to start creating and sharing</p>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 shadow-2xl">
        <div className="text-center py-12">
          <div className="animate-pulse">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4"></div>
          </div>
          <p className="text-slate-300 text-lg">Loading the social universe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Create
          </h2>
          <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse"></div>
        </div>
        {!isCreatingPost ? (
          <button
            onClick={() => setIsCreatingPost(true)}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 font-medium shadow-lg border border-purple-500/20 group"
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-xl group-hover:scale-110 transition-transform duration-300">✨</span>
              <span>Share Something Amazing</span>
            </span>
          </button>
        ) : (
          <form onSubmit={handleCreatePost} className="space-y-4">
            <input
              type="text"
              placeholder="Give it a catchy title..."
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
              required
            />
            <textarea
              placeholder="What's inspiring you today?"
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-4 bg-slate-700/50 border border-slate-600/50 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 h-32 resize-none"
              required
            />
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl hover:from-purple-500 hover:to-pink-500 transition-all duration-300 font-medium shadow-lg"
              >
                Share
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="flex-1 bg-slate-700 text-slate-300 py-3 px-4 rounded-xl hover:bg-slate-600 transition-all duration-300 font-medium border border-slate-600/50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
            Connect
          </h2>
          <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {otherUsers.filter(user => user && user.username).map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-slate-600/30 rounded-xl hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:border-green-500/30 transition-all duration-300 group">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-green-500 group-hover:to-emerald-600 rounded-full flex items-center justify-center mr-4 transition-all duration-300 shadow-lg">
                  <span className="text-slate-200 group-hover:text-white font-bold transition-colors duration-300">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-slate-100 group-hover:text-white transition-colors duration-300">{user.username}</div>
                  <div className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => isFollowing(user.id) ? handleUnfollow(user.id) : handleFollow(user.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  isFollowing(user.id)
                    ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 border border-slate-600/50'
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-500 hover:to-emerald-500 shadow-lg'
                }`}
              >
                {isFollowing(user.id) ? 'Following' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
            Feed
          </h2>
          <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full animate-pulse"></div>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-slate-300 text-lg mb-2">The feed awaits your creativity</p>
            <p className="text-slate-400 text-sm">Share the first post and start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {posts.filter(post => post && post.user && post.user.username).slice(0, 5).map(post => (
              <div key={post.id} className="p-4 border border-slate-600/30 rounded-xl hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-red-500/10 hover:border-orange-500/30 transition-all duration-300 group">
                <div className="flex items-center mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 group-hover:from-orange-500 group-hover:to-red-600 rounded-full flex items-center justify-center mr-3 transition-all duration-300 shadow-lg">
                    <span className="text-slate-200 group-hover:text-white text-xs font-bold transition-colors duration-300">
                      {post.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-slate-200 transition-colors duration-300 font-medium">
                    {post.user.username}
                  </span>
                </div>
                <h3 className="font-bold text-slate-100 group-hover:text-white mb-2 transition-colors duration-300">{post.title}</h3>
                <p className="text-slate-300 group-hover:text-slate-200 mb-3 transition-colors duration-300 leading-relaxed">{post.content}</p>
                <p className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors duration-300">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
