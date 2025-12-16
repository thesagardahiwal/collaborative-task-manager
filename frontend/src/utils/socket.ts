import { io } from "socket.io-client";


const user = JSON.parse(localStorage.getItem("user") || "{}");
export const socket =  io("http://localhost:8000", { 
    withCredentials: true, 
    auth: {
        userId: user?._id 
    }
    });