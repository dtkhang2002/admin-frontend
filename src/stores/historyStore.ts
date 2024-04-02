import { defineStore } from "pinia";
import axios from "axios";
import { HistoryData } from "../interfaces/history";

export const useHistory = defineStore({
    id: 'history',
    state: (): HistoryData => {
        return {
            items: [],
            total: 0,
            page: 1,
            size: 0,
            pages: 0
        }
    },
    actions: {
        async apiGetListHistory(params: object) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/history`, 
                {
                    params,
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                    }
                }
            );
            this.items = response.data.items;
            this.page = response.data.page;
            this.size = response.data.size;
            this.total = response.data.total;
            this.pages = response.data.pages;
        },
        async apiGetListHistoryByUserId(userId: string) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/history/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            });
            this.items = response.data.items;
            this.page = response.data.page;
            this.size = response.data.size;
        },
        async apiGetHistoryMe() {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/history/me`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            });
            this.items = response.data.items;
            this.page = response.data.page;
            this.size = response.data.size;
        },
        async deleteHistoryMe() {
            await axios.delete(`${import.meta.env.VITE_API_URL}/history/me`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            })
        },
        async deleteHistoryByUserId(user_id: string) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/history/${user_id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            })
        },
    },
    getters: {
        getHistoryList: (state) => state.items,
        getPageSize: (state) => state.size,
        getTotalRecord: (state) => state.total,
        getPageNum: (state) => state.page,
        getTotalPage: (state) => state.pages
    }
})