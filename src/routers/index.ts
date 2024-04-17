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
            component: TrainFile,
            meta: { requiresAuth: true }
        },
        {
            path: "/file",
            component: TrainFile,
            meta: { requiresAuth: true }
        },
        {
            path: "/user",
            component: User,
            meta: { requiresAuth: true }
        },
        {
            path: "/settings",
            component: Settings,
            meta: { requiresAuth: true }
        },
        {
            path: "/history",
            component: History,
            meta: { requiresAuth: true }
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

const isTokenExpired = (token: string): boolean => {
    const jwt = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (jwt.exp < currentTime) {
        return true;
    } else {
        return false;
    }
}

router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem("access_token");

    if (to.meta.requiresAuth && (!token || isTokenExpired(token))) {
        sessionStorage.setItem('savedPath', to.path);
        next({ path: '/login' });
    } else if (to.meta.guest && token && !isTokenExpired(token)) {
        next({ path: '/' });
    } else {
        next();
    }
});