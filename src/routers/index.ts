import {createRouter, createWebHistory} from "vue-router";
import TrainFile from "../views/TrainFile.vue";
import User from "../views/User.vue";
import Settings from "../views/Settings.vue";
import History from "../views/History.vue";
import Login from "../views/Login.vue";

export const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            component: TrainFile
        },
        {
            path: "/file",
            component: TrainFile
        },
        {
            path: "/user",
            component: User
        },
        {
            path: "/settings",
            component: Settings
        },
        {
            path: "/history",
            component: History
        },
        {
            path: "/login",
            component: Login,
            meta: { hideNavbar: true }
        },
        {
            path: "/logout",
            component: Login,
            meta: { hideNavbar: true }
        }
    ]
})
