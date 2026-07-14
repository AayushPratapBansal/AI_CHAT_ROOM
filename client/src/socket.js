import { io } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
console.log("Socket server url =", SERVER_URL);

const socket = io(SERVER_URL, {
  autoConnect: false, 
});

export default socket;
