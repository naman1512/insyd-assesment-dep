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
      <div className="bg-white rounded-lg p-6 shadow-lg border">
        <div className="text-center py-8">
          <p className="text-gray-600">Please select a user to access social features</p>
        </div>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-lg border">
        <div className="text-center py-8">
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Create Post</h2>
        {!isCreatingPost ? (
          <button
            onClick={() => setIsCreatingPost(true)}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
          >
            Create New Post
          </button>
        ) : (
          <form onSubmit={handleCreatePost} className="space-y-3">
            <input
              type="text"
              placeholder="Post title"
              value={newPost.title}
              onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="What's on your mind?"
              value={newPost.content}
              onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              required
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Post
              </button>
              <button
                type="button"
                onClick={() => setIsCreatingPost(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Users</h2>
        <div className="space-y-3">
          {otherUsers.filter(user => user && user.username).map(user => (
            <div key={user.id} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm font-medium">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{user.username}</div>
                  <div className="text-sm text-gray-600">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => isFollowing(user.id) ? handleUnfollow(user.id) : handleFollow(user.id)}
                className={`px-4 py-1 rounded text-sm transition-colors ${
                  isFollowing(user.id)
                    ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {isFollowing(user.id) ? 'Unfollow' : 'Follow'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Posts</h2>
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No posts yet</p>
            <p className="text-sm text-gray-500 mt-1">Be the first to share something!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.filter(post => post && post.user && post.user.username).slice(0, 5).map(post => (
              <div key={post.id} className="p-4 border rounded hover:bg-gray-50 transition-colors">
                <div className="flex items-center mb-2">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                    <span className="text-white text-xs font-medium">
                      {post.user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600">
                    {post.user.username}
                  </span>
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{post.title}</h3>
                <p className="text-gray-700 mb-2">{post.content}</p>
                <p className="text-xs text-gray-500">
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
