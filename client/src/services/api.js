const API_BASE = '/api/v1';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        let errorMsg = data?.error?.message;
        if (!errorMsg) {
          if (response.status === 500) {
            errorMsg = 'Cannot connect to backend server on port 5000. Please ensure the backend is running via `npm.cmd run dev` or `npm.cmd run dev:server`.';
          } else {
            errorMsg = `Request failed with status ${response.status}`;
          }
        }
        const error = new Error(errorMsg);
        error.code = data?.error?.code || (response.status === 500 ? 'SERVER_OFFLINE' : 'API_ERROR');
        error.status = response.status;
        error.details = data?.error?.details;
        throw error;
      }

      return data;
    } catch (err) {
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        const networkErr = new Error('Cannot connect to AI Mystery Room server. Please verify backend is running.');
        networkErr.code = 'NETWORK_ERROR';
        throw networkErr;
      }
      throw err;
    }
  }

  // Health check
  async getHealth() {
    return this.request('/health');
  }

  // Create mystery (initiates async generation job)
  async createMystery(config) {
    return this.request('/mysteries', {
      method: 'POST',
      body: JSON.stringify(config),
    });
  }

  // Poll generation job status
  async getGenerationJob(jobId) {
    return this.request(`/generation-jobs/${jobId}`);
  }

  // Retrieve public mystery case data
  async getMystery(mysteryId) {
    return this.request(`/mysteries/${mysteryId}`);
  }

  // Start an investigation session
  async createSession(mysteryId) {
    return this.request(`/mysteries/${mysteryId}/sessions`, {
      method: 'POST',
    });
  }

  // Retrieve a single evidence item
  async getEvidence(sessionId, evidenceId) {
    return this.request(`/sessions/${sessionId}/evidence/${evidenceId}`);
  }

  // Update session progress (discovered/bookmarked clues)
  async updateProgress(sessionId, progress) {
    return this.request(`/sessions/${sessionId}/progress`, {
      method: 'PATCH',
      body: JSON.stringify(progress),
    });
  }

  // Submit final verdict
  async submitVerdict(sessionId, culpritId) {
    return this.request(`/sessions/${sessionId}/verdict`, {
      method: 'POST',
      body: JSON.stringify({ culpritId }),
    });
  }
}

export const api = new ApiService();
