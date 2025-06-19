// 🔊 Speak the selected text aloud
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }
  
  // 🧩 Store selected text to send later if sidebar not ready
  let pendingText = "";
  let iframeReady = false;
  
  // ✅ Listen for sidebar ready signal
  window.addEventListener("message", (event) => {
    if (event.data?.sidebarReady) {
      iframeReady = true;
  
      // If we had text waiting, send it now
      const iframe = document.getElementById("chaded-panel");
      if (iframe && pendingText) {
        iframe.contentWindow.postMessage({ context: pendingText }, "*");
        pendingText = "";
      }
    }
  });
  
  // 🧠 Inject the sidebar if needed and prepare to send selected text
  function injectSidebar(selectedText) {
    const iframeId = "chaded-panel";
    let iframe = document.getElementById(iframeId);
  
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = iframeId;
      iframe.src = chrome.runtime.getURL("sidebar.html");
  
      Object.assign(iframe.style, {
        position: "fixed",
        bottom: "10px",
        right: "10px",
        width: "320px",
        height: "300px",
        zIndex: "999999",
        border: "1px solid #ccc",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.3)",
        backgroundColor: "#fff"
      });
  
      document.body.appendChild(iframe);
  
      // Store for post-handshake delivery
      pendingText = selectedText;
    } else {
      iframe.contentWindow.postMessage({ context: selectedText }, "*");
    }
  }
  
  // 🖱️ On text selection
  document.addEventListener("mouseup", () => {
    const selectedText = window.getSelection().toString().trim();
  
    if (selectedText.length > 0) {
      speak(selectedText);         // 🎤 Speak the selection
      injectSidebar(selectedText); // 📥 Inject sidebar + pass text
    }
  });
  