import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createVuetify} from 'vuetify'
import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth"

import App from './App.vue'
import router from './router/index.js'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const firebaseConfig = {
    apiKey: "AIzaSyAuhlkFWI6gNKDll2IkZds7bkaBM0tUaGs",
    authDomain: "films-project-25c44.firebaseapp.com",
    projectId: "films-project-25c44",
    storageBucket: "films-project-25c44.appspot.com",
    messagingSenderId: "1069794898251",
    appId: "1:1069794898251:web:1ce5587660f0fc46dbf8ce"
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);

export {auth}

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark'
    }
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(vuetify)
app.mount('#app')
