import api from "./apiService";
import { jwtDecode } from "jwt-decode";

const ACCOUNT_ENDPOINT = "/account";
const AUTHEN_ENDPOINT = "/authen";


export const decodeToken = (token) => {
  try {
    if (token) {
      const decoded = jwtDecode(token);
      console.log("Decoded Token:", decoded);
      return decoded;
    }
    return null;
  } catch (error) {
    console.error("Invalid Token", error);
    return null;
  }
};

export const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};


export const getAllAccounts = async (page = 1, pageSize = 10) => {
  try {
    const response = await api.get(`${ACCOUNT_ENDPOINT}/getAccountsPaging`, {
      params: {
        Page: page,
        PageSize: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error when fetching paginated accounts:", error);
    return null;
  }
};

export const getAccountById = async (id) => {
  try {
    const response = await api.get(`${ACCOUNT_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error when getting Account with id ${id}:`, error);
    //throw error;
    return null;
  }
};

export const getAccountByPhone = async (phone) => {
  try {
    const response = await api.get(`${ACCOUNT_ENDPOINT}/phone/${phone}`);
    return response.data;
  } catch (error) {
    console.error(`Error when getting Account with phone ${phone}:`, error);
    //throw error;
    return null;
  }
};

export const createAccount = async (account) => {
  try {
    const response = await api.post(ACCOUNT_ENDPOINT, account);
    return response.data;
  } catch (error) {
    console.error("Error when creating an account:", error);
    //throw error;
    return null;
  }
};

export const updateAccount = async (id, account) => {
  try {
    const response = await api.put(
      `${ACCOUNT_ENDPOINT}/updateAccount`,
      {
        password: account.password,
        email: account.email,
        phone: account.phone
      },
      {
        params: {id: id}
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error when updating Account with id ${id}:`, error);
    return null;
  }
};



export const deleteAccount = async (id) => {
  try {
    const response = await api.delete(`${ACCOUNT_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error when deleting Account with id ${id}:`, error);
    //throw error;
    return null;
  }
};

export const login = async (account) => {
  try {
    const response = await api.post(`${AUTHEN_ENDPOINT}/login`, account);

    if (response.status === 200) {
      const token = response.data.token;
      console.log("Token:", token);

      // Decode token trực tiếp
      const userInfo = decodeToken(token);

      if (userInfo) {
        console.log("User Info:", userInfo);
        console.log("Role:", userInfo["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
        localStorage.setItem("authToken", token);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
      }

      return userInfo["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    } else {
      console.error("Login failed:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Error when logging in:", error);
    return null;
  }
};

export const register = async (account) => {
  try {
    const response = await api.post(`${AUTHEN_ENDPOINT}/register`, account);
    return response.data;
  } catch (error) {
    console.error("Error when registering:", error);
    //throw error;
    return null;
  }
}


export const logout = async () => {
  try {
    const response = await api.post(`${ACCOUNT_ENDPOINT}/logout`);
    return response.data;
  } catch (error) {
    console.error("Error when logging out:", error);
    //throw error;
    return null;
  }
};

export const changeStatus = async (id, status) => {
  try {
    const response = await api.put(`${ACCOUNT_ENDPOINT}/change-status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error when changing status for Account with id ${id}:`, error);
    //throw error;
    return null;
  }
};

export const changePassword = async (id, password) => {
  try {
    const response = await api.put(`${ACCOUNT_ENDPOINT}/change-password/${id}`, { password });
    return response.data;
  } catch (error) {
    console.error(`Error when changing password for Account with id ${id}:`, error);
    //throw error;
    return null;
  }
};
