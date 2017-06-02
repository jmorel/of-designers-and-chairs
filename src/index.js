import Vue from 'vue'
import Vuex from 'vuex'
import App from './Components/App.vue'

Vue.use(Vuex);

// Simple routing using Vuex

const store = new Vuex.Store({
    state: {
        currentDesigner: null
    },
    mutations: {
        hashchange(state) {
            state.currentDesigner = decodeURIComponent(window.location.hash.substr(1));
        }
    }
});

window.addEventListener('hashchange', function () {
    store.commit('hashchange')
});

// Our app

new Vue({
    el: '#app',
    store,
    render: h => h(App),
});
