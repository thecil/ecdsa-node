import axios from "axios";
const server = axios.create({
  baseURL: "https://ecdsa-server-orpin.vercel.app",
});

export default server;
