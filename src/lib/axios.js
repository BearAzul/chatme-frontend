import axios from "axios"

const axiosInstanace = axios.create({
  baseURL: "/api",
  withCredentials: true
})

export default axiosInstanace