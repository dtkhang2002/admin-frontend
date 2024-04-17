<script setup lang="ts">
import { useRoute } from 'vue-router';
import NavbarComponents from './components/NavbarComponents.vue';
import { watch } from 'vue';

const route = useRoute();

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
