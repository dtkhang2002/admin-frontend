import { SettingCreate } from "./../interfaces/settings";
import { defineStore } from "pinia";
import axios from "axios";
import { SettingResponse } from "../interfaces/settings";

export const useSettings = defineStore({
  id: "setting",
  state: (): SettingResponse => {
    return {
      pageContent: {
        id: 0,
        threshold_score: 0,
        number_references: 0,
        temperature: 0,
        maximum_number_questions: 0,
        prompt_question: "",
        prompt_answer: "",
        created_at: "",
        updated_at: "",
      },
    };
  },
  actions: {
    async apiGetSettings() {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/settings`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      this.pageContent = response.data.pageContent;
    },
    async apiCreateSettings(params: SettingCreate) {
      await axios.post(`${import.meta.env.VITE_API_URL}/settings`, params, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    },
    async apiUpdateSettings(params: SettingCreate, settings_id: number) {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/settings/${settings_id}`,
        params,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
    },
  },
  getters: {
    getSettings: (state) => state.pageContent,
  },
});
