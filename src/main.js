import '@fortawesome/fontawesome-free/css/all.min.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'

import { createApp } from 'vue'
import App from './App.vue'


// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// IMPORTA o que você realmente usa no App.vue
import { faBookmark, faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'

// adiciona na library
library.add(faBookmark, faTrash, faCheck)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
