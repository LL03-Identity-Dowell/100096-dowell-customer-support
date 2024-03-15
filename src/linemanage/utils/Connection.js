
import io from "socket.io-client";
const socket  = io.connect("https://www.dowellchat.uxlivinglab.online/");
export {socket};