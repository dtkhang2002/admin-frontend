<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import type {PageState} from "primevue/paginator";
import { useUser } from '../stores/userStore';
import { useRole } from '../stores/roleStore';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const userStore = useUser();
const roleStore = useRole();
const editDialog = ref(false);
const deleteDialog = ref(false);
const submitted = ref(false);
const dialogHeader = reactive({
    header: ''
});
const user = ref(
    {
        id: 0,
        full_name: '',
        email: '',
        password: '',
        confirm_password: '',
        role_id: 0
    }
);

const role_list = computed(() => roleStore.getListRole);

const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const searchParam = reactive({
    page: 1,
    size: 10
});

const changePage = async(event: PageState) => {
    searchParam.page = event.page + 1;
    refreshUser();
}

const refreshUser = async() => {
    await roleStore.apiGetListRole();
    await userStore.apiGetListUser(searchParam);
}

const updateUser = async(users: any) => {
    dialogHeader.header = 'Cập nhật thông tin người dùng';
    user.value = {...users};
    editDialog.value = true;
}

const checkPassword = (user: any) => {
    const summary = user.value.id ? 'Cập nhật' : 'Đăng kí';
    const detail = user.value.id ? 'Cập nhật người dùng mới thất bại, mật khẩu mới không khớp' : 'Đăng kí người dùng mới thất bại, mật khẩu mới không khớp';

    if (user.value.password !== user.value.confirm_password) {
        toast.add({ severity: 'error', summary, detail, life: 3000 });
        return false;
    }
    return true;
}

const resetUser = async () => {
    editDialog.value = false;
    await refreshUser();
    await userStore.apiGetCurrentUser();
    user.value.email = '';
    user.value.password = '';
    user.value.confirm_password = '';
    user.value.role_id = 0;
}

const updateUsers = async() => {
    submitted.value = true;
    if(user.value.email.trim() && user.value.password.trim() && user.value.confirm_password.trim()) {
        try {
            if (user.value.id) {
                if (!checkPassword(user)) return;
                await userStore.apiUpdateUserById(user.value.id, user.value);
                toast.add({ severity: 'success', summary: 'Cập nhật', detail: 'Cập nhật người dùng thành công', life: 3000 });
            } else {
                await userStore.apiRegister(user.value);
                toast.add({ severity: 'success', summary: 'Đăng ký', detail: 'Đăng ký người dùng mới thành công', life: 3000 });
            }
            await resetUser();
        } catch (e) {
            const summary = user.value.id ? 'Cập nhật' : 'Đăng kí';
            const detail = user.value.id ? 'Cập nhật người dùng thất bại, email đã tồn tại' : 'Đăng kí người dùng mới thất bại, email đã tồn tại';
            toast.add({ severity: 'error', summary, detail, life: 3000 });
        }
    }
}



const confirmDeleteUser = async(users: any) => {
    user.value = {...users};
    deleteDialog.value = true;
}

const hideEdiDialog = async() => {
    user.value.email = '';
    user.value.full_name = '';
    user.value.password = '';
    user.value.confirm_password = '';
    user.value.role_id = 0;
    editDialog.value = false;
    submitted.value = false;
}

const hideDeleteDialog = async() => {
    deleteDialog.value = false;
}

const deleteStaff = async() => {
    await userStore.apiDeleteUserById(user.value.id);
    toast.add({ severity: 'success', summary: 'Xóa', detail: 'Xóa người dùng thành công', life: 3000 });
    deleteDialog.value = false;
    await refreshUser();
}

const openNewUser = async() => {
    dialogHeader.header = 'Đăng ký người dùng mới';
    editDialog.value = true;
}

watch(editDialog, (newValue) => {
      if (!newValue) {
        user.value.email = '';
        user.value.full_name = '';
        user.value.password = '';
        user.value.confirm_password = '';
        user.value.role_id = 0;
      }
    });

onMounted(refreshUser)
</script>

<template>
    <div>
        <div class="card">
            <Toolbar class="mb-4">
                <template #start>
                <Button
                    label="Đăng ký người dùng mới"
                    icon="pi pi-user-plus"
                    severity="success"
                    class="mr-2"
                    @click="openNewUser"
                ></Button>
                </template>
            </Toolbar>
            <DataTable ref="dt" :value="userStore.getListUser" dataKey="id" 
                responsiveLayout="scroll"
                :paginator="true" :rows="userStore.getPageSize" :totalRecords="userStore.getTotalRecord"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                @page="changePage"
                :lazy="true"
                :filters="filters"
                autoLayout="true">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <h4 class="m-0">Manage User</h4>
                    </div>
                </template>
                <Column field="id" header="Id" style="width: 5%"></Column>
                <Column field="full_name" header="Họ và tên" style="width: 10%"></Column>
                <Column field="email" header="Email" style="width: 10%"></Column>
                <Column field="role_name" header="Vai trò" style="width: 5%">
                    <template #body="slotProps">
                        <span :style="{color: slotProps.data.role_name === 'ADMIN' ? 'red' : 'green'}">
                            {{ slotProps.data.role_name}}
                        </span>
                    </template>
                </Column>
                <Column field="created_at" header="Ngày tạo" style="width: 10%"></Column>
                <Column :exportable="false" style="width: 3%">
                    <template #body="slotProps">
                        <Toast/>
                        <Button v-if="slotProps.data.role_id == 2" icon="pi pi-user-edit" outlined rounded class="mr-2" @click="updateUser(slotProps.data)"></Button>
                        <Button v-if="slotProps.data.role_id == 2" icon="pi pi-trash" outlined rounded severity="danger" @click="confirmDeleteUser(slotProps.data)"></Button>
                    </template>
                </Column>
            </DataTable>
        </div>
        <Dialog v-model:visible="editDialog" :style="{width: '1000px'}" :header="dialogHeader.header" :modal="true" class="p-fluid">
            <div class="field">
                <label for="email">Email</label>
                <InputText id="email" type="email"v-model.trim="user.email" required="true" autofocus :class="{'p-invalid': submitted && !user.email}" />
                <small class="p-error" v-if="submitted && !user.email">Email bắt buộc.</small>
            </div>
            <div class="field">
                <label for="full_name">Họ và tên</label>
                <InputText id="full_name" type="text"v-model.trim="user.full_name" required="true" autofocus :class="{'p-invalid': submitted && !user.full_name}" />
                <small class="p-error" v-if="submitted && !user.full_name">Họ và tên bắt buộc.</small>
            </div>
            <div class="field">
                <label for="password">Mật khẩu</label>
                <InputText id="password" type="password"v-model.trim="user.password" required="true" autofocus :class="{'p-invalid': submitted && !user.email}" />
                <small class="p-error" v-if="submitted && !user.password">Mật khẩu bắt buộc.</small>
            </div>
            <div class="field">
                <label for="confirmPassword">Xác nhận mật khẩu</label>
                <InputText id="confirmPassword" type="password"v-model.trim="user.confirm_password" required="true" autofocus :class="{'p-invalid': submitted && !user.email}" />
                <small class="p-error" v-if="submitted && !user.confirm_password">Xác nhận mật khẩu bắt buộc.</small>
            </div>
            <div class="field">
                <label for="Role">Role</label>
                <Dropdown v-model="user.role_id" :options="role_list" optionLabel="name" showClear optionValue="id" placeholder="Lựa chọn vai trò" checkmark :highlightOnSelect="false" class="w-20rem" />
                <small class="p-error" v-if="submitted && !user.role_id">Vai trò bắt buộc.</small>
            </div>
            <template #footer>
                <Toast/>
                <Button label="Đóng" icon="pi pi-times" text @click="hideEdiDialog"/>
                <Button label="Lưu" icon="pi pi-check" text @click="updateUsers" />
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Xác nhận xóa người dùng" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span v-if="user">Bạn có chắc bạn muốn xóa người dùng có email là <b>{{user.email}}</b>?</span>
            </div>
            <template #footer>
                <Button label="Không" icon="pi pi-times" text @click="hideDeleteDialog"/>
                <Button label="Có" icon="pi pi-check" text @click="deleteStaff" />
            </template>
        </Dialog>
    </div>
</template>