// Modern Map Component
Vue.component('st-map', {
  template: '#map-template',
  props: ['name'],
  data() {
    return {
      map: null,
      pins: {},
      ourPinMarker: null,
      ourPin: null,
      userColors: new Map(),
    }
  },
  async mounted() {
    await this.initMap();
  },
  methods: {
    async initMap() {
      // Generate random color for this user
      const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#e67e22', '#34495e'];
      const userColor = colors[Math.floor(Math.random() * colors.length)];

      // Random starting point in Phoenix AZ
      const startLat = 33.46 + Math.random() * (33.7 - 33.46);
      const startLng = -112.25 + Math.random() * (-111.88 + 112.25);

      // Create map
      this.map = L.map('map', {
        center: [startLat, startLng],
        minZoom: 4,
        zoom: 11
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c'],
      }).addTo(this.map);

      // Create our pin
      this.ourPin = {
        username: this.name,
        name: this.name,
        latitude: startLat,
        longitude: startLng,
        color: userColor
      };

      const ourIcon = this.createFontIcon('fa-map-marker', userColor);
      this.ourPinMarker = L.marker([startLat, startLng], { icon: ourIcon })
        .bindTooltip(this.name + ' (You)')
        .addTo(this.map);

      // Update pin position when map moves (throttled)
      let updateTimeout = null;
      this.map.on('move', () => {
        if (updateTimeout) clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
          const center = this.map.getCenter();
          this.updateOurPin(center.lat, center.lng);
        }, 200);
      });

      // Load existing pins
      await this.loadPins();

      // Listen for pin updates via WebSocket
      api.on('pin', () => {
        this.loadPins();
      });

      // Send our initial position
      await this.updateOurPin(startLat, startLng);
    },

    createFontIcon(faClass, color) {
      return L.divIcon({
        className: '',
        html: `<i class="fa ${faClass}" aria-hidden="true" style="color: ${color}; font-size: 2em; text-shadow: 1px 1px 3px black"></i>`,
      });
    },

    async updateOurPin(lat, lng) {
      this.ourPin.latitude = lat;
      this.ourPin.longitude = lng;

      try {
        await api.updatePin(this.name, this.name, lat, lng);
        this.ourPinMarker.setLatLng([lat, lng]);
      } catch (error) {
        console.error('Error updating pin:', error);
      }
    },

    async loadPins() {
      try {
        const pins = await api.getPins();

        // Update or add pins
        pins.forEach(pin => {
          // Skip our own pin (already handled)
          if (pin.name === this.name) return;

          const pinId = pin.id;
          const color = pin.color || '#3388ff';

          if (this.pins[pinId]) {
            // Update existing pin
            this.pins[pinId].setLatLng([pin.latitude, pin.longitude]);
          } else {
            // Add new pin
            const icon = this.createFontIcon('fa-map-marker', color);
            const marker = L.marker([pin.latitude, pin.longitude], { icon })
              .bindTooltip(pin.name)
              .addTo(this.map);
            this.pins[pinId] = marker;
          }
        });
      } catch (error) {
        console.error('Error loading pins:', error);
      }
    },
  },
});
