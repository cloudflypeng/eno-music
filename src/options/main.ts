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
// TODO: add a dialog to confirm the deletion of a task, just one dialog for all tasks
// TODO: ann a new page about the custom playlist just like the official playlist
// TODO: add a message Component to show the message
// TODO: fix onEnd in the play component
