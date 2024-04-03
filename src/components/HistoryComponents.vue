<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import type {PageState} from "primevue/paginator";
import { useHistory } from '../stores/historyStore';
import { useToast } from "primevue/usetoast";

const toast = useToast();
const historyStore = useHistory();
const dt = ref();

const filters = ref({
    'global': {value: null, matchMode: FilterMatchMode.CONTAINS},
});


const searchParam = reactive({
    page: 1,
    size: 10,
    user_id: null,
    question: null,
    answer: null,
    start_at: null,
    end_at: null
});

const deleteSearchParam = async() => {
    searchParam.user_id = null;
    searchParam.question = null;
    searchParam.answer = null;
    searchParam.start_at = null;
    searchParam.end_at = null;
}

const exportCSV = async() => {
    await historyStore.apiExportCSV(searchParam)
};

const refreshHistory = async() => {
    await historyStore.apiGetListHistory(searchParam);
}

const changePage = async(event: PageState) => {
    searchParam.page = event.page + 1;
    refreshHistory();
}

const searchHistory = async() => {
    await historyStore.apiGetListHistory(searchParam);
    toast.add({ severity: 'success', summary: 'Tìm kiếm', detail: 'Tìm kiếm lịch sử thành công', life: 3000 });
}

onMounted(refreshHistory)
</script>

<template>
    <div>
        <div class="card">
            <DataTable ref="dt" :value="historyStore.getHistoryList" dataKey="id" 
                responsiveLayout="scroll"
                :paginator="true" :rows="historyStore.getPageSize" :totalRecords="historyStore.getTotalRecord"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                @page="changePage"
                :lazy="true"
                :filters="filters"
                autoLayout="true">
                <template #header>
                    <div class="flex flex-wrap gap-2 align-items-center justify-content-between">
                        <div class="flex flex-wrap gap-2">
                            <div class="InputGroup">
                                <label for="user-id-1" class="p-2">Mã người hỏi: </label>
                                <InputText id="user-id-1" v-model="searchParam.user_id" class="p-2" placeholder="Mã người hỏi"/>
                            </div>

                            <div class="InputGroup">
                                <label for="file-name-1" class="p-2">Câu hỏi: </label>
                                <InputText id="file-name-1" placeholder="Câu hỏi" v-model="searchParam.question" class="p-2"/>
                            </div>

                            <div class="InputGroup">
                                <label for="user-id-2" class="p-2">Câu trả lời: </label>
                                <InputText id="user-id-2" placeholder="Câu trả lời" v-model="searchParam.answer" class="p-2"/>
                            </div>

                            <div class="InputGroup">
                                <label for="user-id-3" class="p-2">Từ: </label>
                                <Calendar id="calendar-24h" v-model="searchParam.start_at" showTime hourFormat="24" />
                            </div>

                            <div class="InputGroup">
                                <label for="file-name-3" class="p-2">Đến: </label>
                                <Calendar id="calendar-24h" v-model="searchParam.end_at" showTime hourFormat="24" />
                            </div>
                        </div>

                        <div class="align-items-center gap-2">
                            <div class="flex justify-content-center align-items-center p-2" style="margin-left: auto">
                                <Toast />
                                <Button severity="success" icon="pi pi-search" label="Tìm kiếm" @click="searchHistory"></Button>
                            </div>
                        </div>

                        <div class="align-items-center gap-2">
                            <div class="flex justify-content-center align-items-center p-2" style="margin-left: auto">
                                <Toast />
                                <Button severity="danger" icon="pi pi-times"label="Xóa tìm kiếm" @click="deleteSearchParam"></Button>
                            </div>
                        </div>

                        <div class="align-items-center gap-2">
                            <div class="flex justify-content-center align-items-center p-2" style="margin-left: auto">
                                <Button
                                    label="Xuất ra file CSV"
                                    icon="pi pi-external-link"
                                    severity="success"
                                    class="mr-2"
                                    @click="exportCSV"
                                ></Button>
                            </div>
                        </div>
                    </div>
                </template>

                <Column field="id" header="Id" style="width: 5%"></Column>
                <Column field="user_id" header="Mã người hỏi" style="width: 10%"></Column>
                <Column field="question" header="Câu hỏi" style="width: 20%"></Column>
                <Column field="answer" header="Câu trả lời" style="width: 20%"></Column>
                <Column field="created_at" header="Thời gian" style="width: 10%">
                    <template #body="props">
                        {{ props.data.created_at }}
                    </template>
                </Column>
            </DataTable>

        </div>
    </div>
    
</template>