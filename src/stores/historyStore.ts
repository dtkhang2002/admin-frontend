import { defineStore } from "pinia";
import axios from "axios";
import { HistoryData } from "../interfaces/history";

export const useHistory = defineStore({
  id: "history",
  state: (): HistoryData => {
    return {
      items: [],
      total: 0,
      page: 1,
      size: 0,
      pages: 0,
    };
  },
  actions: {
    async apiGetListHistory(params: object) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/history`,
        {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      this.items = response.data.items;
      this.page = response.data.page;
      this.size = response.data.size;
      this.total = response.data.total;
      this.pages = response.data.pages;
    },
    async apiGetHistoryMe(params: object) {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/history/me`,
        {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      this.items = response.data.items;
      this.page = response.data.page;
      this.size = response.data.size;
      this.total = response.data.total;
      this.pages = response.data.pages;
    },
    async apiExportCSV(params: object) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/history/csv`,
        {},
        {
          params,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "download.csv";
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(
          /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
        );
        if (fileNameMatch.length >= 2)
          fileName = fileNameMatch[1].replace(/['"]/g, "");
      }
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    },
  },
  getters: {
    getHistoryList: (state) => state.items,
    getPageSize: (state) => state.size,
    getTotalRecord: (state) => state.total,
    getPageNum: (state) => state.page,
    getTotalPage: (state) => state.pages,
  },
});
