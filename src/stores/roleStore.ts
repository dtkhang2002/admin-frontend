import { defineStore } from "pinia";
import { RoleData } from "../interfaces/role";
import axios from "axios";

export const useRole = defineStore({
  id: "role",
  state: (): RoleData => {
    return {
      pageContent: [],
    };
  },
  actions: {
    async apiGetListRole() {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/role`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      this.pageContent = response.data.pageContent;
    },
  },
  getters: {
    getListRole: (state) => state.pageContent,
  },
});
