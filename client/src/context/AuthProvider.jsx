import { useState } from "react";
import { AuthContext } from "./AuthContext";
import api from "../services/api";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const register = async (formData) => {
    const { data } = await api.post("/auth/register", formData);

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };

  const login = async (formData) => {
    const { data } = await api.post("/auth/login", formData);

    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    return data;
  };
const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
};

const updateUser = (updatedUser) => {
  setUser(updatedUser);
  localStorage.setItem("user", JSON.stringify(updatedUser));
};

return (
  <AuthContext.Provider value={{ user, register, login, logout, updateUser }}>
    {children}
  </AuthContext.Provider>
);
}
export default AuthProvider;
