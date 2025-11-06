// Modern Login Component
Vue.component('login', {
  template: '#login-template',
  data() {
    return {
      name: '',
    }
  },
  mounted() {
    Vue.nextTick(() => {
      if (this.$refs.loginInput) {
        this.$refs.loginInput.focus();
      }
    });
  },
  methods: {
    async setSessionName() {
      if (this.name.trim() !== '') {
        try {
          // Register/login user
          await api.login(this.name.trim());
          this.$emit('name-set', this.name.trim());
        } catch (error) {
          console.error('Error logging in:', error);
          alert('Error logging in. Please try again.');
        }
      }
    }
  }
});
