<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useSettings } from "../stores/settingsStore";
import { SettingCreate } from "../interfaces/settings";
import { router } from "../routers";
import { useToast } from "primevue/usetoast";

const toast = useToast();
const settingStore = useSettings();
const threshold_score = ref(0);
const number_references = ref(0);
const temperature = ref(0);
const maximum_number_question = ref(0);
const prompt_question = ref("");
const prompt_answer = ref("");
const submitted = ref(false);

const refreshSettings = async () => {
  await settingStore.apiGetSettings();
  const settings = settingStore.getSettings;
  threshold_score.value = settings.threshold_score;
  number_references.value = settings.number_references;
  temperature.value = settings.temperature;
  maximum_number_question.value = settings.maximum_number_questions;
  prompt_question.value = settings.prompt_question;
  prompt_answer.value = settings.prompt_answer;
};

const updateSettings = async () => {
  submitted.value = true;
  if (
    !prompt_question.value.trim() ||
    !prompt_answer.value.trim() ||
    !threshold_score.value ||
    !number_references.value ||
    !temperature.value ||
    !maximum_number_question.value
  ) {
    toast.add({
      severity: "error",
      summary: "Cập nhật",
      detail: "Cập nhật cấu hình thất bại",
      life: 3000,
    });
    return;
  } else {
    let settingsUpdate: SettingCreate = {
      threshold_score: threshold_score.value,
      number_references: number_references.value,
      temperature: temperature.value,
      maximum_number_questions: maximum_number_question.value,
      prompt_question: prompt_question.value.trim(),
      prompt_answer: prompt_answer.value.trim(),
    };
    await settingStore.apiUpdateSettings(settingsUpdate, 1);
    toast.add({
      severity: "success",
      summary: "Cập nhật",
      detail: "Cập nhật cấu hình thành công",
      life: 3000,
    });
    router.push("/admin/settings");
  }
};
const isButtonDisabled = computed(() => {
  return (
    !threshold_score.value ||
    !number_references.value ||
    !temperature.value ||
    !maximum_number_question.value ||
    !prompt_question.value ||
    !prompt_answer.value
  );
});
onMounted(refreshSettings);
</script>

<template>
  <form @submit.prevent="updateSettings">
    <div class="card flex flex-column md:flex-row gap-3">
      <div class="InputGroup">
        <label for="threshold-score" class="p-2">Threshold-Score</label>
        <InputNumber
          id="threshold-score"
          :minFractionDigits="1"
          :maxFractionDigits="1"
          placeholder="Threshold-Score"
          v-model.trim="threshold_score"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !threshold_score }"
        />
        <small class="p-error" v-if="submitted && !threshold_score"
          >Threshold_score bắt buộc.</small
        >
      </div>

      <div class="InputGroup">
        <label for="number-references" class="p-2">Number of References</label>
        <InputNumber
          id="number-references"
          placeholder="Number references"
          v-model.trim="number_references"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !number_references }"
        />
        <small class="p-error" v-if="submitted && !number_references"
          >Number_references bắt buộc.</small
        >
      </div>

      <div class="InputGroup">
        <label for="temperature" class="p-2">Temperature</label>
        <InputNumber
          id="temperature"
          :minFractionDigits="1"
          :maxFractionDigits="1"
          placeholder="Temperature"
          v-model.trim="temperature"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !temperature }"
        />
        <small class="p-error" v-if="submitted && !temperature"
          >Temperature bắt buộc.</small
        >
      </div>

      <div class="InputGroup mb-7">
        <label for="maximum-number-question" class="p-2"
          >Maximum Number of Questions</label
        >
        <InputNumber
          id="maximum-number-question"
          placeholder="Maximum number questions"
          v-model.trim="maximum_number_question"
          required="true"
          autofocus
          :class="{ 'p-invalid': submitted && !maximum_number_question }"
        />
        <small class="p-error" v-if="submitted && !maximum_number_question"
          >Maximum_number_question bắt buộc.</small
        >
      </div>
    </div>

    <div class="card flex flex-column mb-10">
      <label for="textarea-question" class="p-2">Prompt Question</label>
      <Textarea
        id="textarea-question"
        v-model.trim="prompt_question"
        variant="filled"
        autoResize
        rows="5"
        cols="30"
        required="true"
        autofocus
        :class="{ 'p-invalid': submitted && !prompt_question }"
      ></Textarea>
      <small class="p-error" v-if="submitted && !prompt_question"
        >Prompt_question bắt buộc.</small
      >
    </div>

    <div class="card flex flex-column mb-10">
      <label for="textarea-answer" class="p-2">Prompt Answer</label>
      <Textarea
        id="textarea-answer"
        v-model.trim="prompt_answer"
        variant="filled"
        autoResize
        rows="5"
        cols="30"
        :class="{ 'p-invalid': submitted && !prompt_answer }"
      ></Textarea>
      <small class="p-error" v-if="submitted && !prompt_answer"
        >Prompt_answer bắt buộc.</small
      >
    </div>

    <div
      class="w-full md:w-5 flex align-items-center justify-content-center py-5"
    >
      <Toast />
      <Button
        label="Cập nhật"
        icon="pi pi-cog"
        severity="success"
        class="w-10rem"
        type="submit"
        :disabled="isButtonDisabled"
      ></Button>
    </div>
  </form>
</template>
<style scoped>
@media (max-width: 600px) {
  .card {
    flex-direction: column !important;
  }
}
</style>
