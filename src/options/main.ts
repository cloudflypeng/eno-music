import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './Options.vue'
import { setupApp } from '~/logic/common-setup'
import '../styles'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

setupApp(app)
app.mount('#app')
