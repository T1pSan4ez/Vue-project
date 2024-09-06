import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {createVuetify} from 'vuetify'
import {initializeApp} from "firebase/app";
import { getAuth} from 'firebase/auth';
import { getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";

import App from './App.vue'
import router from './router/index.js'
import vInstruction from './directives/instruction.js';

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
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

export {
    auth,
    db,
    storage
};

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            light: {
                colors: {
                    primary: '#1976D2',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                },
            },
            dark: {
                colors: {
                    primary: '#1E88E5',
                    secondary: '#424242',
                    accent: '#FF4081',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FB8C00',
                },
            },
            blackguard: {
                dark: true,
                colors: {
                    background: '#0E0E30',
                    surface: '#1C1C3A',
                    primary: '#8E9EFF',
                    secondary: '#03DAC6',
                    accent: '#8E9EFF',
                    error: '#FF5370',
                    info: '#82AAFF',
                    success: '#22C55E',
                    warning: '#F59E0B',
                },
            },
            polaris: {
                dark: false,
                colors: {
                    background: '#2C1F1F',
                    surface: '#3E2723',
                    primary: '#F57C00',
                    secondary: '#FF6F00',
                    accent: '#FF8F00',
                    error: '#E64A19',
                    info: '#1976D2',
                    success: '#388E3C',
                    warning: '#FBC02D',
                },
            },
            nebula: {
                dark: true,
                colors: {
                    background: '#0D1B2A',
                    surface: '#1B263B',
                    primary: '#3385f4',
                    secondary: '#778DA9',
                    accent: '#E0E1DD',
                    error: '#D32F2F',
                    info: '#0288D1',
                    success: '#388E3C',
                    warning: '#FFA000',
                },
            },
        }
    }
})

const app = createApp(App)
app.use(router)
app.use(createPinia())
app.use(vuetify)
app.directive('instruction', vInstruction);
app.mount('#app')
