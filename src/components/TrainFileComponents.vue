<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import type {PageState} from "primevue/paginator";
import { useTrainFile } from '../stores/trainFileStore';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const trainFileStore = useTrainFile();
const uploadFileDialog = ref(false);
const trainDialog = ref(false);
const deleteDialog = ref(false);

const file = ref<File | null>(null);

const fileTrain = ref({
    id: 0,
    status: 0,
    file_name: '',
    file_path: ''
});

const searchParam = reactive({
    page: 1,
    size: 10,
    file_name: null,
    user_name: null
});

const fileTrainUpload = ref({
    status: 0,
});

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    file.value = target.files[0];
  }
}

const onUpload = async() => {
  if (file.value) {
    const formData = new FormData();
    formData.append('file', file.value);

    const response = await trainFileStore.apiUploadFile(formData);
    if (response == 400) {
      uploadFileDialog.value = false;
      toast.add({ severity: 'error', summary: 'Tải file', detail: 'Tải file thất bại, sai định dạng hoặc cấu trúc file', life: 3000 });
    } else {
      uploadFileDialog.value = false;
      toast.add({ severity: 'success', summary: 'Tải file', detail: 'Tải file lên thành công', life: 3000 });
      await refreshTrainFile();
    }
  }
}


const refreshTrainFile = async() => {
    await trainFileStore.apiGetListTrainFile(searchParam);
}

const changePage = async(event: PageState) => {
    searchParam.page = event.page + 1;
    refreshTrainFile();
}

const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});

const openNew = async() => {
    uploadFileDialog.value = true
}

const searchFile = async() => {
    await trainFileStore.apiGetListTrainFile(searchParam);
    toast.add({ severity: 'success', summary: 'Tìm kiếm', detail: 'Tìm kiếm file thành công', life: 3000 });
}

const deleteSearchParam = async() => {
    searchParam.user_name = null;
    searchParam.file_name = null;
}

const updateFile = async(trainfile: any) => {
    fileTrain.value = {...trainfile};
    trainDialog.value = true
}

const confirmDeleteFile = async(trainfile: any) => {
    fileTrain.value = {...trainfile};
    deleteDialog.value = true
}

const hideDeleteDialog = async() => {
    deleteDialog.value = false
}

const hideTrainDialog = async() => {
    trainDialog.value = false
    file.value = null
}

const train = async() => {
    await trainFileStore.apiUpdateFile(fileTrain.value.id, fileTrainUpload.value);
    toast.add({ severity: 'success', summary: 'Huấn luyện', detail: 'Huấn luyện chatbot thành công', life: 3000 });
    trainDialog.value = false;
    await refreshTrainFile();
}

const doDeleteFile = async() => {
    await trainFileStore.apiDeleteFile(fileTrain.value.id);
    toast.add({ severity: 'success', summary: 'Xóa', detail: 'Xóa file thành công', life: 3000 });
    deleteDialog.value = false;
    await refreshTrainFile();
}

watch(uploadFileDialog, (newValue) => {
      if (!newValue) {
        file.value = null;
      }
    });

onMounted(refreshTrainFile)
</script>

<template>
  <div>
    <div class="card">
      <Toolbar class="mb-4">
        <template #start>
          <Button
            label="Tải lên file huấn luyện mới"
            icon="pi pi-plus"
            severity="success"
            class="mr-2"
            @click="openNew"
          />
        </template>
      </Toolbar>
      <DataTable
        ref="dt"
        :value="trainFileStore.getFileList"
        dataKey="id"
        responsiveLayout="scroll"
        :paginator="true"
        :rows="trainFileStore.getPageSize"
        :totalRecords="trainFileStore.getTotalRecord"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        @page="changePage"
        :lazy="true"
        :filters="filters"
        autoLayout="true"
      >
        <template #header>
          <form @submit.prevent="searchFile">
            <div
              class="flex flex-wrap gap-2 align-items-center justify-content-between"
            >
              <div class="flex justify-content-center align-items-center gap-2">
                <div class="InputGroup">
                  <label for="user-id" class="p-2">Người tải: </label>
                  <InputText
                    id="user-id"
                    placeholder="Người tải"
                    v-model="searchParam.user_name"
                    class="p-2"
                  />
                </div>

                <div class="InputGroup">
                  <label for="file-name" class="p-2">Tên file: </label>
                  <InputText
                    id="file-name"
                    placeholder="Tên file"
                    v-model="searchParam.file_name"
                    class="p-2"
                  />
                </div>

                <div
                  class="flex justify-content-center align-items-center p-2"
                  style="margin-left: auto"
                >
                  <Toast />
                  <Button
                    severity="success"
                    icon="pi pi-search"
                    label="Tìm kiếm"
                    type="submit"
                  ></Button>
                </div>

                <div
                  class="flex justify-content-center align-items-center p-2"
                  style="margin-left: auto"
                >
                  <Button
                    severity="danger"
                    icon="pi pi-times"
                    label="Xóa tìm kiếm"
                    @click="deleteSearchParam"
                  ></Button>
                </div>
              </div>
            </div>
          </form>
        </template>

        <Column field="id" header="Id" style="width: 5%"></Column>
        <Column field="status" header="Trạng thái" style="width: 10%">
          <template #body="slotProps">
            <span
              :style="{ color: slotProps.data.status === 0 ? 'red' : 'green' }"
            >
              {{
                slotProps.data.status === 0
                  ? "Chưa huấn luyện"
                  : "Đã huấn luyện"
              }}
            </span>
          </template>
        </Column>

        <Column field="file_name" header="Tên file" style="width: 10%"></Column>
        <Column
          field="file_path"
          header="Đường dẫn file"
          style="width: 10%"
        ></Column>
        <Column
          field="created_at"
          header="Thời gian tải lên"
          style="width: 10%"
        ></Column>
        <Column
          field="user_name"
          header="Người tải lên"
          style="width: 10%"
        ></Column>
        <Column :exportable="false" style="width: 6%">
          <template #body="slotProps">
            <Toast />
            <Button
              v-if="slotProps.data.status == 0"
              icon="pi pi-arrow-up"
              outlined
              rounded
              class="mr-2"
              @click="updateFile(slotProps.data)"
            />
            <Button
              v-if="slotProps.data.status == 0"
              icon="pi pi-trash"
              outlined
              rounded
              severity="danger"
              @click="confirmDeleteFile(slotProps.data)"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <Dialog
      v-model:visible="trainDialog"
      :style="{ width: '450px' }"
      header="Xác nhận huấn luyện"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="fileTrain"
          >Bạn chắc chắn muốn sử dụng file <b>{{ fileTrain.file_name }}</b> để
          huấn luyện chatbot?
          <b style="color: red"
            >Khi đã huấn luyện thì file sẽ không thể xóa khỏi hệ thống</b
          ></span
        >
      </div>
      <template #footer>
        <Button
          label="Không"
          icon="pi pi-times"
          text
          @click="hideTrainDialog"
        />
        <Button label="Có" icon="pi pi-check" text @click="train" />
      </template>
    </Dialog>
    <Dialog
      v-model:visible="deleteDialog"
      :style="{ width: '450px' }"
      header="Xác nhận xóa file huấn luyện"
      :modal="true"
    >
      <div class="confirmation-content">
        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
        <span v-if="fileTrain"
          >Bạn chắc chắn muốn xóa file <b>{{ fileTrain.file_name }}</b
          >?</span
        >
      </div>
      <template #footer>
        <Button
          label="Không"
          icon="pi pi-times"
          text
          @click="hideDeleteDialog"
        />
        <Button label="Có" icon="pi pi-check" text @click="doDeleteFile" />
      </template>
    </Dialog>
  </div>
  <Dialog
    v-model:visible="uploadFileDialog"
    :style="{ width: '900px', height: '200px' }"
    header="Tải lên file huấn luyện mới"
    :modal="true"
    class="p-fluid"
  >
    <div
      class="flex flex-row align-items-center justify-content-end gap-3 py-5"
    >
      <div
        class="flex flex-wrap justify-content-center align-items-center gap-2"
      >
        <input
          class="btn-pick-file"
          type="file"
          id="inputTagCsvK"
          accept=".csv"
          @change="onFileChange"
        />
      </div>
      <Button
        label="Tải lên"
        icon="pi pi-upload"
        class="w-10rem mx-auto"
        @click="onUpload"
        :disabled="!file"
      ></Button>
    </div>
  </Dialog>
</template>
