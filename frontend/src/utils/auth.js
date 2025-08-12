import api from "./api"; // Import the configured axios instance

export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    const { token } = response.data;

    localStorage.setItem("token", token);

    const user = await getUserDetails(token);

    localStorage.setItem("user", JSON.stringify(user));
    window.location.reload();

    console.log("Login Successful");
    return user;
  } catch (error) {
    console.error("Failed to login:", error);
    throw new Error("Failed to login");
  }
};

export const signup = async (email, password, name) => {
  try {
    const response = await api.post("/auth/signup", { email, password, name });
    const { token } = response.data;

    localStorage.setItem("token", token);

    const user = await getUserDetails(token);

    localStorage.setItem("user", JSON.stringify(user));
    window.location.reload();

    return user;
  } catch (error) {
    console.error("Failed to sign up:", error);
    throw new Error("Failed to sign up");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  const userData = localStorage.getItem("user");
  try {
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Error parsing user data from localStorage:", error);
    return null;
  }
};

// Function to handle Google OAuth login
export const loginWithGoogle = async (tokenResponse) => {
  try {
    const response = await api.post("/auth/google", {
      token: tokenResponse.access_token,
    });
    const { token } = response.data;

    localStorage.setItem("token", token);

    const user = await getUserDetails(token);

    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    throw new Error("Google login failed");
  }
};

// Function to handle Apple ID login
export const loginWithApple = async (response) => {
  try {
    const {
      authorization: { id_token },
    } = response;
    const serverResponse = await api.post("/auth/apple", { id_token });
    const { token } = serverResponse.data;

    localStorage.setItem("token", token);

    const user = await getUserDetails(token);

    localStorage.setItem("user", JSON.stringify(user));

    return user;
  } catch (error) {
    throw new Error("Apple login failed");
  }
};

// Function to get user details based on token
const getUserDetails = async (token) => {
  try {
    const response = await api.get("/auth/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to get user details:", error);
    throw new Error("Failed to get user details");
  }
};
