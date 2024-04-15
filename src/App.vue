<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import NavbarComponents from './components/NavbarComponents.vue';
import { onMounted, watch } from 'vue';

const route = useRoute();
const router = useRouter();

const returnLoginPage = async() => {
    const token = localStorage.getItem("access_token");
    if ((!token || isTokenExpired(token))) {
        localStorage.clear();
        sessionStorage.clear();
        router.push("/login");
    } else {
        const savedPath = sessionStorage.getItem('savedPath');
        if (savedPath) {
            router.push(savedPath);
        } else {
            router.push("/");
        }
    }
}

const isTokenExpired = (token: string): boolean => {
    const jwt = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    if (jwt.exp < currentTime) {
        return true;
    } else {
        return false;
    }
}

onMounted(returnLoginPage);

watch(() => route.path, (newPath) => {
    sessionStorage.setItem('savedPath', newPath);
});
</script>

<template>
 <div class="section">
    <div class="container">
        <NavbarComponents class="sticky-navbar" v-if="!route.meta.hideNavbar"/>
        <RouterView/>
    </div>
 </div>
</template>

<style scoped>
.sticky-navbar {
    position: sticky;
    top: 0;
    z-index: 1000;
}
</style>
