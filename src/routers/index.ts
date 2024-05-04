import { createRouter, createWebHistory } from "vue-router";
import TrainFile from "../views/TrainFile.vue";
import User from "../views/User.vue";
import Settings from "../views/Settings.vue";
import History from "../views/History.vue";
import Login from "../views/Login.vue";
import Chatbox from "../views/Chatbox.vue";
import RegisterView from "../views/RegisterView.vue";
import MyHistory from "../views/MyHistory.vue";
import NotFound from "../views/NotFound.vue";

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/admin/file",
      component: TrainFile,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/user",
      component: User,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/settings",
      component: Settings,
      meta: { requiresAuth: true },
    },
    {
      path: "/admin/history",
      component: History,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      component: Login,
      meta: { hideNavbar: true },
    },
    {
      path: "/logout",
      component: Login,
      meta: { hideNavbar: true },
    },
    {
      path: "/",
      component: Chatbox,
      meta: { requiresAuth: true },
    },
    {
      path: "/register",
      component: RegisterView,
      meta: { hideNavbar: true },
    },
    {
      path: "/history",
      component: MyHistory,
      meta: { requiresAuth: true },
    },
    {
      path: "/not-authorized",
      component: NotFound,
      meta: { hideNavbar: true },
    },
    {
      path: "/:pathMatch(.*)",
      redirect: "/not-authorized",
    },
  ],
});

const isTokenExpired = (token: string): boolean => {
  const jwt = JSON.parse(atob(token.split(".")[1]));
  const currentTime = Math.floor(Date.now() / 1000);
  if (jwt.exp < currentTime) {
    return true;
  } else {
    return false;
  }
};

const jwt_decode = (token: string): number => {
  const jwt = JSON.parse(atob(token.split(".")[1]));
  return jwt.role;
};

router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem("access_token");

  if (to.path.startsWith("/admin") && token) {
    const userRole = jwt_decode(token);
    if (userRole !== 1) {
      next("/not-authorized");
    } else {
      next();
    }
  } else if (to.meta.requiresAuth && (!token || isTokenExpired(token))) {
    sessionStorage.setItem("savedPath", to.path);
    next({ path: "/login" });
  } else if (to.meta.guest && token && !isTokenExpired(token)) {
    next({ path: "/" });
  } else {
    next();
  }
});
