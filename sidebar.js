// Load WebLLM directly from the MLC CDN
import * as webllm from "https://mlc.ai/web-llm/dist/webllm.min.js";

let chatModule = null;
let contextText = "";

const askBtn = document.getElementById("ask-btn");
const contextDiv = document.getElementById("context-text");
const questionInput = document.getElementById("user-question");
const answerBox = document.getElementById("answer-box");

// Notify parent that the sidebar is ready
window.parent.postMessage({ sidebarReady: true }, "*");

// 🧠 Initialize WebLLM (TinyLlama)
async function initWebLLM() {
  answerBox.innerText = "⏳ Loading AI model...";
  try {
    chatModule = await webllm.ChatModule.createChatModule();
    await chatModule.reload("TinyLlama-1.1B-Chat-v0.3-q4f32_1-MLC");
    askBtn.disabled = false;
    answerBox.innerText = "";
    console.log("✅ WebLLM loaded successfully");
  } catch (error) {
    console.error("Failed to load WebLLM:", error);
    answerBox.innerText = "❌ Failed to load AI model.";
  }
}

// 🔊 Speak text aloud
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.cancel(); // stop previous speech
  speechSynthesis.speak(utterance);
}

// 💬 Handle ask button
async function handleAsk() {
  const question = questionInput.value.trim();
  if (!question || !contextText || !chatModule) return;

  askBtn.disabled = true;
  answerBox.innerText = "🤖 Thinking...";

  const prompt = `Answer based on the following context:\n\nContext:\n${contextText}\n\nQ: ${question}`;
  try {
    const response = await chatModule.generate(prompt);
    answerBox.innerText = response;
    speak(response);
  } catch (err) {
    answerBox.innerText = "❌ Error generating response.";
    console.error(err);
  }
  askBtn.disabled = false;
}

// 📨 Receive selected text from content script
window.addEventListener("message", (event) => {
  if (event.data?.context) {
    contextText = event.data.context;
    contextDiv.innerText = contextText;
  }
});

// 🚀 Run everything
askBtn.addEventListener("click", handleAsk);
initWebLLM();
