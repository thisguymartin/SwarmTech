// API Client for SwarmTech
const API_BASE = window.location.origin + '/api';
const WS_URL = `ws://${window.location.host}/ws`;

class SwarmTechAPI {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectTimeout = null;
    this.eventId = 1; // Default event
  }

  // WebSocket connection
  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    console.log('Connecting to WebSocket...');
    this.ws = new WebSocket(WS_URL);

    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.emit('connected', {});
    };

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message:', data);
        this.emit(data.type, data);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.emit('disconnected', {});
      // Attempt to reconnect after 3 seconds
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    };
  }

  // Event emitter
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => callback(data));
    }
  }

  // Send WebSocket message
  send(type, data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, ...data }));
    }
  }

  // User API
  async login(username) {
    const response = await fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    return response.json();
  }

  async getUsers() {
    const response = await fetch(`${API_BASE}/users`);
    return response.json();
  }

  // Messages API
  async getMessages(eventId = this.eventId) {
    const response = await fetch(`${API_BASE}/messages?event_id=${eventId}`);
    return response.json();
  }

  async sendMessage(username, message, eventId = this.eventId) {
    const response = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, message, event_id: eventId })
    });
    const result = await response.json();

    // Broadcast via WebSocket
    this.send('message', { username, message, event_id: eventId });

    return result;
  }

  // Pins API
  async getPins(eventId = this.eventId) {
    const response = await fetch(`${API_BASE}/pins?event_id=${eventId}`);
    return response.json();
  }

  async updatePin(username, name, latitude, longitude, eventId = this.eventId) {
    const response = await fetch(`${API_BASE}/pins`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        name,
        latitude,
        longitude,
        event_id: eventId,
        pin_type: 'agent'
      })
    });
    const result = await response.json();

    // Broadcast via WebSocket
    this.send('pin', { username, name, latitude, longitude, event_id: eventId });

    return result;
  }

  async deletePin(pinId) {
    const response = await fetch(`${API_BASE}/pins/${pinId}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  // Events API
  async getEvents() {
    const response = await fetch(`${API_BASE}/events`);
    return response.json();
  }

  async getEvent(eventId) {
    const response = await fetch(`${API_BASE}/events/${eventId}`);
    return response.json();
  }
}

// Create global API instance
const api = new SwarmTechAPI();
