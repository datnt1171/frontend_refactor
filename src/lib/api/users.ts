import api from './client'

export const getCurrentUser = () => api.get("/users/me")

export const getUsers = () => api.get("/users/")

export const changePassword = (data: {
  current_password: string
  new_password: string
  re_new_password: string
}) => api.post("/users/set_password", data)