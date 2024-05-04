import { defineStore } from "pinia";
import axios from "axios";
import { QA, Question } from "../interfaces/message";

export const useMessage = defineStore({
  id: "question",
  state: (): QA => {
    return {
      question: "",
      answer: "",
    };
  },
  actions: {
    async apiAskQuestion(params: Question) {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/chatbot`,
        params,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );
      return response.data.answer;
    },

    async apiClearSession() {
      await axios.get(`${import.meta.env.VITE_API_URL}/chatbot`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
    },
  },
  getters: {
    getAnswer: (state) => state.answer,
  },
});
