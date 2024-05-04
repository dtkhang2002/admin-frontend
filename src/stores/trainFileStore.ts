import { TrainFileData, TrainFileUpdate } from "./../interfaces/trainFile";
import { defineStore } from "pinia";
import axios from "axios";

export const useTrainFile = defineStore({
  id: "trainfile",
  state: (): TrainFileData => {
    return {
      items: [],
      total: 0,
      page: 1,
      size: 0,
      pages: 0,
    };
  },
  actions: {
    async apiGetListTrainFile(params: object) {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/file`, {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      this.items = response.data.items;
      this.page = response.data.page;
      this.size = response.data.size;
      this.total = response.data.total;
      this.pages = response.data.pages;
    },
    async apiUploadFile(data: FormData) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/file`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return response.data["status"];
    },
    async apiUpdateFile(file_id: number, params: TrainFileUpdate) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/file/${file_id}`,
        params,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
    },
    async apiDeleteFile(file_id: number) {
      await axios.delete(`${import.meta.env.VITE_API_URL}/file/${file_id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    },
  },
  getters: {
    getFileList: (state) => state.items,
    getPageSize: (state) => state.size,
    getTotalRecord: (state) => state.total,
    getPageNum: (state) => state.page,
    getTotalPage: (state) => state.pages,
  },
});
