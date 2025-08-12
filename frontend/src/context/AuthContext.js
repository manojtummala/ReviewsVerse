import React, { createContext, useState, useEffect } from "react";
import { login, signup, logout, getCurrentUser } from "../utils/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, []);

  const handleLogin = async (email, password) => {
    const loggedInUser = await login(email, password);
    setUser(loggedInUser);
  };

  const handleSignup = async (email, password, name) => {
    const newUser = await signup(email, password, name);
    setUser(newUser);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        login: handleLogin,
        signup: handleSignup,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
