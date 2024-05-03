<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import userImg from '../assets/user.jpg'
import chatbotImg from '../assets/chatbot.jpg'
import { useMessage } from '../stores/messageStore';
import { Question } from '../interfaces/message';

const chatbotStore = useMessage();

interface Message {
  text: string;
  img: string;
  class: string;
}

const question = ref("");
const messages = ref<Message[]>([]);
const isChatbotTyping = ref(false);
const deleteDialog = ref(false);

const sendQuestion = async() => {
  try {
    messages.value.push({ text: question.value, img: userImg, class: 'chat outgoing' });
    let questionAsk: Question = {
      question: question.value
    }
    question.value = "";
    isChatbotTyping.value = true;
    messages.value.push({ text: '', img: chatbotImg, class: 'chat typing' });
    const answer = await chatbotStore.apiAskQuestion(questionAsk);
    messages.value.pop();
    messages.value.push({ text: answer, img: chatbotImg, class: 'chat incoming'});
    // Save the entire chat history to localStorage
    localStorage.setItem('chatHistory', JSON.stringify(messages.value));

    await nextTick();
    const container = document.querySelector('.chat-container');
    if (container) {
        container.scrollTop = container.scrollHeight;
    }
    isChatbotTyping.value = false;
  } catch (error) {
      messages.value.pop();
      messages.value.push({ text: 'Oops! Something went wrong while retrieving the response. Please try again. ', img: chatbotImg, class: 'chat error'});
  }
}



const deleteHistory = async() => {
  deleteDialog.value = true;
}

const autoRefresh = async() => {
  const storedChatHistoryItem = localStorage.getItem('chatHistory');
  if (storedChatHistoryItem !== null) {
    const storedChatHistory = JSON.parse(storedChatHistoryItem);
    if (storedChatHistory) {
        messages.value = storedChatHistory;
    }
  }
}

const hideDeleteDialog = async() => {
  deleteDialog.value = false;
}

const doDeleteChatHistory = async() => {
  messages.value = [];
  localStorage.removeItem('chatHistory');
  await chatbotStore.apiClearSession();
  deleteDialog.value = false;
}

onMounted(autoRefresh)

</script>

<template>
  <div class="chat-container">
    <div class="default-text" v-if="messages.length === 0">
        <h1>AI University Chatbot</h1>
        <p>Start a conversation and explore the power of AI.<br> Your chat history will be displayed here.</p>
    </div>
    <div v-for="(message, index) in messages" :key="index">
      <div :class="message.class">
          <div class="chat-content">
              <div class="chat-details">
                  <img :src="message.img" alt="user-img">
                  <p v-if="message.class !== 'chat typing'">{{ message.text }}</p>
                  <div v-else class="typing-animation">
                      <div class="typing-dot" style="--delay: 0.2s"></div>
                      <div class="typing-dot" style="--delay: 0.3s"></div>
                      <div class="typing-dot" style="--delay: 0.4s"></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  </div>
  
  <div class="typing-container">
      <div class="typing-content">
          <div class="typing-textarea">
            <Textarea id="chat-input" spellcheck="false" placeholder="Nhập câu hỏi ở đây" required v-model="question" @keydown.enter="($event.shiftKey ? null : (sendQuestion(), $event.preventDefault()))" :disabled="isChatbotTyping"></Textarea>
            <Button icon="pi pi-send" severity="secondary" type="submit" outlined></Button>
          </div>
          <div class="typing-controls" v-if="messages.length !== 0">
            <Button icon="pi pi-trash" severity="danger" @click="deleteHistory" outlined></Button>
          </div>
      </div>
  </div>

  <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Xác nhận xóa phiên trò chuyện" :modal="true">
            <div class="confirmation-content">
                <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                <span>Bạn chắc chắn muốn xóa lịch sử cuộc trò chuyện này?</span>
            </div>
            <template #footer>
                <Button label="Không" icon="pi pi-times" text @click="hideDeleteDialog"/>
                <Button label="Có" icon="pi pi-check" text @click="doDeleteChatHistory" />
            </template>
        </Dialog>

</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600&display=swap');
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
body {
  background: var(--outgoing-chat-bg);
}

/* Chats container styling */
.chat-container {
  overflow-y: auto;
  max-height: 100vh;
  padding-bottom: 150px;
}
:where(.chat-container, textarea)::-webkit-scrollbar {
  width: 6px;
}
:where(.chat-container, textarea)::-webkit-scrollbar-track {
  background: var(--incoming-chat-bg);
  border-radius: 25px;
}
:where(.chat-container, textarea)::-webkit-scrollbar-thumb {
  background: var(--icon-color);
  border-radius: 25px;
}
.default-text {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 70vh;
  padding: 0 10px;
  text-align: center;
  color: black;
}
.default-text h1 {
  font-size: 3.3rem;
}
.default-text p {
  margin-top: 10px;
  font-size: 1.1rem;
}
.chat-container .chat {
  padding: 25px 10px;
  display: flex;
  justify-content: center;
  color: black;
}
.chat-container .chat.outgoing {
  background: rgb(255, 255, 255);
  border: 1px solid rgb(255, 255, 255);
}
.chat-container .chat.incoming {
  background: rgb(239, 237, 237);
  border: 1px solid rgb(239, 237, 237);
}
.chat-container .chat.error {
  background: rgb(239, 237, 237);
  border: 1px solid rgb(239, 237, 237);
}

.chat-container .chat.error p {
  color: red;
  font-weight: bold;
}
.chat .chat-content {
  display: flex;
  max-width: 1200px;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
}
button.material-symbols-rounded {
  user-select: none;
  cursor: pointer;
}
.chat .chat-content button {
  cursor: pointer;
  font-size: 1.3rem;
  color: var(--icon-color);
  visibility: hidden;
}
.chat:hover .chat-content:not(:has(.typing-animation), :has(.error)) button {
  visibility: visible;
}
.chat .chat-details {
  display: flex;
  align-items: center;
}
.chat .chat-details img {
  width: 35px;
  height: 35px;
  align-self: flex-start;
  object-fit: cover;
  border-radius: 2px;
}
.chat .chat-details p {
  white-space: pre-wrap;
  font-size: 1.05rem;
  padding: 0 50px 0 25px;
  color: black;
  word-break: break-word;
}
.chat .chat-details p.error {
  color: #e55865;
}
.chat .typing-animation {
  padding-left: 25px;
  display: inline-flex;
}
.typing-animation .typing-dot {
  height: 7px;
  width: 7px;
  border-radius: 50%;
  margin: 0 3px;
  opacity: 0.7;
  background: var(--text-color);
  animation: animateDots 1.5s var(--delay) ease-in-out infinite;
}
.typing-animation .typing-dot:first-child {
  margin-left: 0;
}
@keyframes animateDots {
  0%,44% {
    transform: translateY(0px);
  }
  28% {
    opacity: 0.4;
    transform: translateY(-6px);
  }
  44% {
    opacity: 0.2;
  }
}

/* Typing container styling */
.typing-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 20px 10px;
  justify-content: center;
  background: var(--outgoing-chat-bg);
  border-top: 1px solid var(--incoming-chat-border);
}
.typing-container .typing-content {
  display: flex;
  max-width: 950px;
  width: 100%;
  align-items: flex-end;
}
.typing-container .typing-textarea {
  width: 100%;
  display: flex;
  position: relative;
}
.typing-textarea textarea {
  resize: none;
  height: 55px;
  width: 100%;
  border: none;
  padding: 15px 45px 15px 20px;
  color: var(--text-color);
  font-size: 1rem;
  border-radius: 4px;
  max-height: 250px;
  overflow-y: auto;
  background: rgb(220, 226, 227);
  outline: 1px solid var(--incoming-chat-border);
}
.typing-textarea textarea::placeholder {
  color: var(--placeholder-color);
}
.typing-content button {
  width: 55px;
  height: 55px;
  display: flex;
  border-radius: 4px;
  font-size: 1.35rem;
  align-items: center;
  justify-content: center;
  color: var(--icon-color);
}
.typing-textarea button {
  position: absolute;
  right: 0;
  bottom: 0;
  visibility: hidden;
}
.typing-textarea textarea:valid ~ button {
  visibility: visible;
}
.typing-controls {
  display: flex;
}
.typing-controls button {
  margin-left: 7px;
  font-size: 1.4rem;
  background: var(--incoming-chat-bg);
  outline: 1px solid var(--incoming-chat-border);
}
.typing-controls button:hover {
  background: var(--icon-hover-bg);
}

/* Reponsive Media Query */
@media screen and (max-width: 600px) {
  .default-text h1 {
    font-size: 2.3rem;
  }
  :where(.default-text p, textarea, .chat p) {
    font-size: 0.95rem!important;
  }
  .chat-container .chat {
    padding: 20px 10px;
  }
  .chat-container .chat img {
    height: 32px;
    width: 32px;
  }
  .chat-container .chat p {
    padding: 0 20px;
  }
  .chat .chat-content:not(:has(.typing-animation), :has(.error)) button {
    visibility: visible;
  }
  .typing-container {
    padding: 15px 10px;
  }
  .typing-textarea textarea {
    height: 45px;
    padding: 10px 40px 10px 10px;
  }
  .typing-content button {
    height: 45px;
    width: 45px;
    margin-left: 5px;
  }
  button.material-symbols-rounded {
    font-size: 1.25rem!important;
  }
}
</style>nextTick, onMounted, onUnmounted, 