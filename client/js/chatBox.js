// Modern Chat Box Component
Vue.component('chat-box', {
  template: '#chat-box-template',
  props: ['name'],
  data() {
    return {
      history: [],
      message: '',
      debug: false,
    }
  },
  computed: {
    debugOutput() {
      return JSON.stringify(this.history, null, 2);
    },
  },
  async created() {
    // Load existing messages
    await this.loadMessages();

    // Listen for new messages via WebSocket
    api.on('message', (data) => {
      console.log('New message received:', data);
      this.loadMessages();
    });

    // Connect to WebSocket
    api.connect();

    Vue.nextTick(() => {
      if (this.$refs.chatInput) {
        this.$refs.chatInput.focus();
      }
      this.scrollToBottom();
    });
  },
  watch: {
    history() {
      Vue.nextTick(() => this.scrollToBottom());
    }
  },
  methods: {
    async loadMessages() {
      try {
        const messages = await api.getMessages();
        this.history = messages.map(msg => ({
          name: msg.username,
          message: msg.message,
          timestamp: msg.created_at
        }));
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    },
    async sendMessage() {
      if (this.message === ':debug') {
        this.debug = !this.debug;
        this.message = '';
        return;
      }

      if (this.message === ':reset' || this.message === ':clear') {
        this.history = [];
        this.message = '';
        return;
      }

      if (this.message.trim() !== '') {
        try {
          await api.sendMessage(this.name, this.message);
          this.message = '';
          Vue.nextTick(() => this.scrollToBottom());
        } catch (error) {
          console.error('Error sending message:', error);
        }
      }
    },
    scrollToBottom() {
      if (this.$refs.history) {
        this.$refs.history.scrollTop = this.$refs.history.scrollHeight;
      }
    },
  },
});
