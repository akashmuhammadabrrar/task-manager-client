import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://localhost:5001",
});

const useAxios = () => {
  return axiosPublic;
};

export default useAxios;
