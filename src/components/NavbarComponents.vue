<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from 'vue-router';
import { useUser } from "../stores/userStore";
import { useToast } from "primevue/usetoast";
import { nextTick } from 'vue';

const toast = useToast();
const router = useRouter();
const userStore = useUser();

const submitted = ref(false);
const showButton = ref(false);
const changePasswordDialog = ref(false);
const logoutDialog = ref(false);

const userUpdate = ref(
    {
        current_password: '',
        new_password: '',
        confirm_password: ''
    }
);

const items = ref([
    {
        label: 'File',
        icon: 'pi pi-file',
        route: '/file'
    },
    {
        label: 'Lịch sử trò chuyện',
        icon: 'pi pi-history',
        route: '/history'
    },
    {
        label: 'Cài đặt',
        icon: 'pi pi-cog',
        route: '/settings'
    },
    {
        label: 'Người dùng',
        icon: 'pi pi-user',
        route: '/user'
    },
]);

const changePassword = async() => {
    changePasswordDialog.value = true;

}

const hideChangePasswordDialog = async() => {
    userUpdate.value.current_password = '';
    userUpdate.value.new_password = '';
    userUpdate.value.confirm_password = '';
    changePasswordDialog.value = false;
    submitted.value = false;
}


const updatenew_password = async() => {
    submitted.value = true;
    if(userUpdate.value.new_password && userUpdate.value.confirm_password && userUpdate.value.current_password){
        try {
            await userStore.apiUpdateCurrentUser(userUpdate.value);
            toast.add({ severity: 'success', summary: 'Đổi mật khẩu', detail: 'Đổi mật khẩu thành công', life: 3000 });
            setTimeout(() => {
                localStorage.removeItem("access_token");
                router.push("/login");
            }, 1000);
        } catch (error) {
            toast.add({ severity: 'error', summary: 'Đổi mật khẩu', detail: 'Đổi mật khẩu thất bại, mật khẩu hiện tại không đúng', life: 3000 });
            return;
        }

        if (userUpdate.value.new_password !== userUpdate.value.confirm_password) {
            toast.add({ severity: 'error', summary: 'Đổi mật khẩu', detail: 'Mật khẩu mới không khớp', life: 3000 });
            return;
        }
    }
    
}

const autoRefresh = async() => {
    await userStore.apiGetCurrentUser();
} 

const signOut = async() => {
    logoutDialog.value = false;
    toast.add({ severity: 'success', summary: 'Đăng xuất', detail: 'Đăng xuất thành công', life: 3000 });
    await nextTick();
    sessionStorage.clear()
    localStorage.clear();
    router.push("/login");
}

const showLogoutDialog = async() => {
    logoutDialog.value = true;
}

const hideLogoutDialog = async() => {
    logoutDialog.value = false;
}



onMounted(autoRefresh)
</script>

<template>
<div style="position: sticky; top: 0;">
    <Menubar :model="items" class="w-full">
        <template #item="{ item, props, root }">
            <router-link 
                :to="item.route" 
                class="flex align-items-center" 
                v-bind="props.action" 
                :class="{ active: $route.path === item.route }"
            >
                <span :class="item.icon" />
                <span class="ml-2">{{ item.label }}</span>
                <Badge v-if="item.badge" :class="{ 'ml-auto': !root, 'ml-2': root }" :value="item.badge" />
                <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{ item.shortcut }}</span>
            </router-link>
        </template>
        
        <template #end>
            <div class="flex align-items-center gap-2">
                <Avatar icon="pi pi-user" class="mr-2" shape="circle" />
                <div class="hover-container" @mouseover="showButton = true" @mouseleave="showButton = false">
                    <h4>{{ userStore.getCurrentUser.full_name }}</h4>
                    <Button v-show="showButton" label="Đổi mật khẩu" severity="info" icon="pi pi-refresh" @click="changePassword"/>
                </div>
                <Toast/>
                <Button label="Đăng xuất" severity="danger" icon="pi pi-sign-out" @click="showLogoutDialog"/>
            </div>
        </template>
    </Menubar>

    <Dialog v-model:visible="changePasswordDialog" :style="{width: '1000px'}" header="Đổi mật khẩu" :modal="true" class="p-fluid">
            <div class="field">
                <label for="current_password">Mật khẩu hiện tại</label>
                <InputText id="current_password" type="password"v-model.trim="userUpdate.current_password" required="true" autofocus :class="{'p-invalid': submitted && !userUpdate.current_password}" />
                <small class="p-error" v-if="submitted && !userUpdate.current_password">Mật khẩu hiện tại là bắt buộc.</small>
            </div>
            <div class="field">
                <label for="new_password">Mật khẩu mới</label>
                <InputText id="new_password" type="password"v-model.trim="userUpdate.new_password" required="true" autofocus :class="{'p-invalid': submitted && !userUpdate.new_password}" />
                <small class="p-error" v-if="submitted && !userUpdate.new_password">Mật khẩu mới là bắt buộc.</small>
            </div>
            <div class="field">
                <label for="confirm_password">Xác nhận mật khẩu mới</label>
                <InputText id="confirm_password" type="password"v-model.trim="userUpdate.confirm_password" required="true" autofocus :class="{'p-invalid': submitted && !userUpdate.confirm_password}" />
                <small class="p-error" v-if="submitted && !userUpdate.confirm_password">Mật khẩu xác nhận là bắt buộc.</small>
            </div>
            <template #footer>
                <Toast/>
                <Button label="Đóng" icon="pi pi-times" text @click="hideChangePasswordDialog"/>
                <Button label="Lưu" icon="pi pi-check" text @click="updatenew_password" />
            </template>
        </Dialog>

        <Dialog v-model:visible="logoutDialog" :style="{width: '450px'}" header="Xác nhận đăng xuất" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Bạn chắc chắn muốn đăng xuất không?</span>
            </div>
            <template #footer>
                <Button label="Không" icon="pi pi-times" text @click="hideLogoutDialog"/>
                <Button label="Có" icon="pi pi-check" text @click="signOut" />
            </template>
        </Dialog>
</div>

</template>

<style scoped>
.hover-container {
    position: relative;
    display: inline-block;
}

.hover-container button {
    position: absolute;
    top: 0;
    right: 0;
    display: none;
}

.hover-container:hover button {
    display: block;
}

.active {
    background-color: aliceblue;
}
</style>