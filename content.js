// 🧠 Control state
let pendingText = "";
let iframeReady = false;
let sidebarId = "chaded-panel";

// 🔊 Speech synthesis controls
let currentUtterance = null;

function speak(text, rate = 1.0) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
  


function pauseSpeech() {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
  }
}

function resumeSpeech() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
  }
}

function stopSpeech() {
  speechSynthesis.cancel();
}

// ✅ Message from sidebar (e.g., close or pause)
window.addEventListener("message", (event) => {
    const { action, sidebarReady, payload } = event.data || {};
  
    if (sidebarReady) {
      iframeReady = true;
      const iframe = document.getElementById("chaded-panel");
      if (iframe && pendingText) {
        iframe.contentWindow.postMessage({ context: pendingText }, "*");
        pendingText = "";
      }
    }
  
    if (action === "pause") {
      if (speechSynthesis.speaking && !speechSynthesis.paused) {
        speechSynthesis.pause();
      }
    }
  
    if (action === "resume") {
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      }
    }
  
    if (action === "stop") {
      speechSynthesis.cancel();
    }
  
    if (action === "closeSidebar") {
      speechSynthesis.cancel();
      const iframe = document.getElementById("chaded-panel");
      if (iframe) iframe.remove();
      iframeReady = false;
    }
  
    if (action === "readText" && payload) {
        const rate = event.data.rate || 1.0;
        speak(payload, rate);
      }
      
  });
  
  
// ✅ Inject the sidebar panel
function injectSidebar(selectedText) {
  let iframe = document.getElementById(sidebarId);

  if (!iframe) {
    iframe = document.createElement("iframe");
    iframe.id = sidebarId;
    iframe.src = chrome.runtime.getURL("sidebar.html");

    Object.assign(iframe.style, {
      position: "fixed",
      bottom: "10px",
      right: "10px",
      width: "320px",
      height: "320px",
      zIndex: "999999",
      border: "1px solid #ccc",
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0,0,0,0.3)",
      backgroundColor: "#fff"
    });

    document.body.appendChild(iframe);
    pendingText = selectedText;
  } else {
    iframe.contentWindow.postMessage({ context: selectedText }, "*");
  }
}

// 🖱️ On user selecting text
document.addEventListener("mouseup", () => {
  const selectedText = window.getSelection().toString().trim();
  if (selectedText.length > 0) {
    injectSidebar(selectedText);
  }
});
