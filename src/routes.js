import Vue from "vue";
import VueRouter from "vue-router";

import Home from "./components/Home/index.vue";

Vue.use(VueRouter);

const routes = [
    {
        path: "/",
        component: Home
    }
]

export default new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(from, to, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})