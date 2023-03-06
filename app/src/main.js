/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

import './assets/style.css'

export const API_URL = 'http://0.0.0.0:5006/' // For non-docker

const app = createApp(App)

registerPlugins(app)

app.mount('#app')
