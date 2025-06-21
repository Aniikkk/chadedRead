let contextText = "";
const askBtn = document.getElementById("ask-btn");
const contextDiv = document.getElementById("context-text");
const questionInput = document.getElementById("user-question");
const answerBox = document.getElementById("answer-box");

// 🧠 Send ready handshake to content.js
window.parent.postMessage({ sidebarReady: true }, "*");

let speechRate = 1.0;

const rateSlider = document.getElementById("rate-slider");
const rateLabel = document.getElementById("rate-value");

rateSlider.addEventListener("input", () => {
  speechRate = parseFloat(rateSlider.value);
  rateLabel.innerText = speechRate.toFixed(1);
});


// 🎤 Utility to speak a message
function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

// 💬 Dummy AI Answer (stubbed since model isn't loaded)
function handleAsk() {
  const question = questionInput.value.trim();
  if (!question || !contextText) return;

  askBtn.disabled = true;
  answerBox.innerText = "🤖 Thinking...";

  // Simulate delay and fake answer
  setTimeout(() => {
    const fakeAnswer = `Here's an answer based on "${contextText}"`;
    answerBox.innerText = fakeAnswer;
    speak(fakeAnswer);
    askBtn.disabled = false;
  }, 1000);
}

// 📨 Receive selected context from content.js
window.addEventListener("message", (event) => {
  if (event.data?.context) {
    contextText = event.data.context;
    contextDiv.innerText = contextText;
  }
});

// 🧠 Button hooks
askBtn.addEventListener("click", handleAsk);

document.getElementById("read-btn").addEventListener("click", () => {
    if (contextText) {
      window.parent.postMessage({
        action: "readText",
        payload: contextText,
        rate: speechRate
      }, "*");
    }
  });
  
  
// 🔁 Sidebar control buttons
document.getElementById("pause-btn").addEventListener("click", () => {
  window.parent.postMessage({ action: "pause" }, "*");
});

document.getElementById("resume-btn").addEventListener("click", () => {
  window.parent.postMessage({ action: "resume" }, "*");
});

document.getElementById("stop-btn").addEventListener("click", () => {
  window.parent.postMessage({ action: "stop" }, "*");
});

document.getElementById("close-btn").addEventListener("click", () => {
  window.parent.postMessage({ action: "closeSidebar" }, "*");
});
