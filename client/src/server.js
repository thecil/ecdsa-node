import axios from "axios";

const server = axios.create({
  baseURL: "https://ecdsa-node-33nkglaih-thecil.vercel.app/",
});

export default server;
