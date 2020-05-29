const socket = io();
const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const usersList = document.getElementById("users");

// Getting username, room fron URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

// Joining new Room
socket.emit("joinRoom", { username, room });

socket.on("roomUsers", ({ room, users }) => {
  roomName.innerText = room;
  usersList.innerHTML = `
  ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
});
// Message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // Scrolling down on new message
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// on message send event / form submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Getting message text
  const chatMessage = e.target.elements.msg.value;

  //   console.log(chatMessage);

  // Emitting chatMessage to server
  socket.emit("chatMessage", chatMessage);

  // Reseting input field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Outputting message from DOM
function outputMessage(message) {
  const div = document.createElement("div");
  if (message.type === "notification") {
    div.classList.add("notification");
    div.innerHTML = `
    <p class="text">
        ${message.text}
    </p>
    <p class="meta"><span>${message.time}</span></p>`;
  } else {
    div.classList.add("message");
    div.innerHTML = `
    <p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
  }

  document.querySelector(".chat-messages").appendChild(div);
}
