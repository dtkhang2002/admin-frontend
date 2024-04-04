import { UserLogin, UserCreate, UserUpdate } from './../interfaces/user';
import { defineStore } from "pinia";
import { UserData } from "../interfaces/user";
import axios from "axios";

export const useUser = defineStore({
    id: 'user',
    state: (): UserData => {
        return {
            items: [],
            total: 0,
            page: 1,
            size: 0,
            pages: 0,
            pageContent: {
                id: 0,
                full_name: '',
                email: '',
                role_id: 0,
                created_at: '',
                updated_at: '',
                files: []
            }
        }
    },
    actions: {
        async apiGetListUser(params: object) {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user`, 
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

        async apiGetCurrentUser() {
            const response = axios.get(`${import.meta.env.VITE_API_URL}/user/me`, 
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            });
            this.pageContent = (await response).data.pageContent
        },
        
        async apiUpdateCurrentUser(params: UserUpdate) {
            await axios.put(`${import.meta.env.VITE_API_URL}/user/me`, params,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            })
        },
        async apiUpdateUserById(user_id: number, params: UserCreate) {
            await axios.put(`${import.meta.env.VITE_API_URL}/user/${user_id}`, params,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            })
        },
        async apiDeleteUserById(user_id: number) {
            await axios.delete(`${import.meta.env.VITE_API_URL}/user/${user_id}`,
            {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            })
        },
        async apiRegister(params: UserCreate) {
            return await axios.post(`${import.meta.env.VITE_API_URL}/register`, params, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("access_token")}`
                }
            })
        },
        
        async apiLogin(params: UserLogin) {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`, params);
            return response.data['access_token']
        }
        
    },
    getters: {
        getListUser: (state) => state.items,
        getPageSize: (state) => state.size,
        getTotalRecord: (state) => state.total,
        getPageNum: (state) => state.page,
        getTotalPage: (state) => state.pages,
        getCurrentUser: (state) => state.pageContent
    }
})