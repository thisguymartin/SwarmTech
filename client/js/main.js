// Modern Main App

Vue.component('st-dashboard', {
  template: '#dashboard-template',
  props: ['name'],
  data() {
    return {
      windowHeight: 0,
      windowWidth: 0,
      toggleView: true
    }
  },
  methods: {
    getWindowWidth() {
      this.windowWidth = document.documentElement.clientWidth;
    },
    getWindowHeight() {
      this.windowHeight = document.documentElement.clientHeight;
    },
    toggleButton() {
      this.toggleView = !this.toggleView;
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.getWindowWidth);
      window.addEventListener('resize', this.getWindowHeight);
      this.getWindowHeight();
      this.getWindowWidth();
    });
  }
});

Vue.component('st-main', {
  template: '#main-template',
  data() {
    return {
      name: '',
    }
  },
  methods: {
    setName(name) {
      this.name = name;
    }
  }
});

// Initialize Vue app
new Vue({ el: '#main' });
