document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const chatSection = document.getElementById("chat-section");
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const messagesContainer = document.getElementById("messages");

  let username = "";

  // Login Form Submit
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const enteredUsername = document.getElementById("username").value.trim();
    const enteredPassword = document.getElementById("password").value.trim();

    if (enteredPassword === "AyushRanjan@123" && enteredUsername !== "") {
      username = enteredUsername;
      document.getElementById("login-section").style.display = "none";
      chatSection.style.display = "block";
    } else {
      alert("Invalid username or password!");
    }
  });

  // Send Message
  messageForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = messageInput.value.trim();
    if (!msg) return;

    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", "right");
    messageDiv.innerHTML = `<span class="username">${username}:</span> ${msg}`;
    messagesContainer.appendChild(messageDiv);

    messageInput.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  });
});
