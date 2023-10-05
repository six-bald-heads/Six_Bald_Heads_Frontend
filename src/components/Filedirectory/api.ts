//api

import axios from "axios";

const BASE_URL =
  "http://ec2-3-34-131-210.ap-northeast-2.compute.amazonaws.com:8080";

axios.defaults.baseURL = BASE_URL;

export const fetchFileTree = () => {
  return axios.get("/api/v1/file-tree?path=/src");
};
