const users = [];

// New user joining the room
function userJoin(id, username, room) {
  const user = { id, username, room };
  users.push(user);
  return user;
}

// get current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

// user leaves chat
function leaveChat(id) {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}

// Get users in a room
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

module.exports = { userJoin, getCurrentUser, leaveChat, getRoomUsers };
