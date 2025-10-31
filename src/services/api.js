const API_BASE_URL = 'https://forum-api.dicoding.dev/v1';

class ApiService {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchWithAuth(url, options = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });

    return response.json();
  }

  // Auth endpoints
  async register({ name, email, password }) {
    return this.fetchWithAuth('/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async login({ email, password }) {
    return this.fetchWithAuth('/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async getOwnProfile() {
    return this.fetchWithAuth('/users/me');
  }

  async getAllUsers() {
    return this.fetchWithAuth('/users');
  }

  // Thread endpoints
  async getAllThreads() {
    return this.fetchWithAuth('/threads');
  }

  async getThreadDetail(threadId) {
    return this.fetchWithAuth(`/threads/${threadId}`);
  }

  async createThread({ title, body, category = '' }) {
    return this.fetchWithAuth('/threads', {
      method: 'POST',
      body: JSON.stringify({ title, body, category }),
    });
  }

  // Comment endpoints
  async createComment(threadId, content) {
    return this.fetchWithAuth(`/threads/${threadId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Vote endpoints
  async upVoteThread(threadId) {
    return this.fetchWithAuth(`/threads/${threadId}/up-vote`, {
      method: 'POST',
    });
  }

  async downVoteThread(threadId) {
    return this.fetchWithAuth(`/threads/${threadId}/down-vote`, {
      method: 'POST',
    });
  }

  async neutralizeVoteThread(threadId) {
    return this.fetchWithAuth(`/threads/${threadId}/neutral-vote`, {
      method: 'POST',
    });
  }

  async upVoteComment(threadId, commentId) {
    return this.fetchWithAuth(`/threads/${threadId}/comments/${commentId}/up-vote`, {
      method: 'POST',
    });
  }

  async downVoteComment(threadId, commentId) {
    return this.fetchWithAuth(`/threads/${threadId}/comments/${commentId}/down-vote`, {
      method: 'POST',
    });
  }

  async neutralizeVoteComment(threadId, commentId) {
    return this.fetchWithAuth(`/threads/${threadId}/comments/${commentId}/neutral-vote`, {
      method: 'POST',
    });
  }

  // Leaderboard endpoints
  async getLeaderboards() {
    return this.fetchWithAuth('/leaderboards');
  }
}

const api = new ApiService(API_BASE_URL);
export default api;
