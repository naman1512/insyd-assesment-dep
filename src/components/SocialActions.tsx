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

  console.log('SocialActions render:', { currentUser, users, usersLength: users?.length });

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
      showToast(`Now following ${user?.username || 'user'}`, 'success', 3000);
    } catch (error) {
      console.error('Failed to follow user:', error);
      showToast('Failed to follow user', 'error', 3000);
    }
  };

  const handleUnfollow = async (userId: string) => {
    if (!currentUser) return;
    try {
      await apiService.unfollowUser(userId, currentUser.id);
      await loadFollowing();
      const user = users?.find(u => u.id === userId);
      showToast(`Unfollowed ${user?.username || 'user'}`, 'info', 3000);
    } catch (error) {
      console.error('Failed to unfollow user:', error);
      showToast('Failed to unfollow user', 'error', 3000);
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
      
      // Show success message
      showToast(
        `Post created! ${result.notificationsSent} notifications sent to followers.`,
        'success',
        4000
      );
    } catch (error) {
      console.error('Failed to create post:', error);
      showToast('Failed to create post', 'error', 3000);
    }
  };

  const isFollowing = (userId: string) => {
    return following.some(user => user.id === userId);
  };

  const otherUsers = users.filter(user => user && user.id !== currentUser?.id);

  if (!currentUser) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 shadow-xl border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
            <div className="text-gray-500 text-2xl">👤</div>
          </div>
          <p className="text-gray-600 text-lg">Please select a user</p>
          <p className="text-gray-500 text-sm mt-2">Choose a user to access social actions</p>
        </div>
      </div>
    );
  }

  // Don't render until users are loaded
  if (!users || users.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 shadow-xl border border-gray-200">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="text-gray-500 text-2xl">⏳</div>
          </div>
          <p className="text-gray-600 text-lg">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Post */}
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-3 h-3 bg-gray-800 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Create Post</h2>
        </div>
        {!isCreatingPost ? (
          <button
            onClick={() => setIsCreatingPost(true)}
            className="w-full bg-gray-800 text-white font-semibold py-4 px-6 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            ✨ Create New Post
          </button>
        ) : (
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Post Title</label>
              <input
                type="text"
                placeholder="Enter an engaging title..."
                value={newPost.title}
                onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Content</label>
              <textarea
                placeholder="Share your thoughts with the architecture community..."
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                className="w-full p-4 bg-white border border-gray-300 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-all duration-200 h-32 resize-none"
                required
              />
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-gray-800 text-white font-semibold py-3 px-6 rounded-lg hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="flex-1 bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-400 hover:text-gray-800 transition-all duration-200 shadow-md"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Users to Follow */}
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-3 h-3 bg-gray-800 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Connect</h2>
        </div>
        <div className="space-y-3">
          {otherUsers.filter(user => user && user.username).map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 group shadow-md hover:shadow-lg hover:border-gray-300">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center shadow-md mr-4 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-white font-bold text-lg">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800 text-lg group-hover:text-gray-900">{user.username}</div>
                  <div className="text-gray-600 text-sm group-hover:text-gray-700">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => isFollowing(user.id) ? handleUnfollow(user.id) : handleFollow(user.id)}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg ${
                  isFollowing(user.id)
                    ? 'bg-gray-300 text-gray-700 border border-gray-300 hover:bg-gray-400 hover:text-gray-800 hover:border-gray-400'
                    : 'bg-gray-800 text-white hover:bg-gray-700'
                }`}
              >
                {isFollowing(user.id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Posts */}
      <div className="bg-gradient-to-br from-white to-gray-100 rounded-lg p-6 shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:bg-gradient-to-br hover:from-gray-50 hover:to-gray-200">
        <div className="flex items-center mb-6">
          <div className="w-3 h-3 bg-gray-800 rounded-full mr-3"></div>
          <h2 className="text-2xl font-bold text-gray-800">Recent Posts</h2>
        </div>
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center mx-auto mb-4">
              <div className="text-gray-500 text-2xl">📝</div>
            </div>
            <p className="text-gray-600 text-lg">No posts yet</p>
            <p className="text-gray-500 text-sm mt-2">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.filter(post => post && post.user && post.user.username).slice(0, 5).map(post => (
              <div key={post.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 group shadow-md hover:shadow-lg hover:border-gray-300">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center shadow-md mr-3 group-hover:scale-105 transition-transform duration-200">
                      <span className="text-white font-bold">
                        {post.user.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg group-hover:text-gray-900">{post.title}</h3>
                      <span className="text-gray-600 text-sm group-hover:text-gray-700">
                        by {post.user.username}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-700 mb-3 leading-relaxed group-hover:text-gray-800">{post.content}</p>
                <p className="text-xs text-gray-500 group-hover:text-gray-600">
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
