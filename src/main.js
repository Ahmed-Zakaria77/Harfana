import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router/index.js'
import './assets/styles/main.css'
import { useAuthStore } from './stores/auth.js'

const pinia=createPinia()
createApp(App).use(pinia).use(router).mount('#app')
useAuthStore(pinia).initialize()
