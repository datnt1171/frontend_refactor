import axios from "axios"

// Create an axios instance WITHOUT a default Content-Type header
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  withCredentials: true, // Important for cookies
})

export default api