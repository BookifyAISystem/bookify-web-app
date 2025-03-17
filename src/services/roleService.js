import api from "./apiService";

const ROLE_ENDPOINT = "/v1/roles";

export const getAllRoles = async () => {
  try {
    const response = await api.get(ROLE_ENDPOINT);
    return response.data;
  } catch (error) {
    console.error("Error when fetching all roles:", error);
    //throw error;
    return null;
  }
}

export const getRoleById = async (id) => {
  try {
    const response = await api.get(`${ROLE_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error when getting Role with id ${id}:`, error);
    //throw error;
    return null;
  }
}

export const createRole = async (role) => {
  try {
    const response = await api.post(ROLE_ENDPOINT, role);
    return response.data;
  } catch (error) {
    console.error("Error when creating a role:", error);
    //throw error;
    return null;
  }
}

export const updateRole = async (id, role) => {
  try {
    const response = await api.put(`${ROLE_ENDPOINT}/${id}`, role);
    return response.data;
  } catch (error) {
    console.error(`Error when updating Role with id ${id}:`, error);
    //throw error;
    return null;
  }
}

export const deleteRole = async (id) => {
  try {
    const response = await api.delete(`${ROLE_ENDPOINT}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error when deleting Role with id ${id}:`, error);
    //throw error;
    return null;
  }
}

export const changeStatus = async (id, status) => {
  try {
    const response = await api.put(`${ROLE_ENDPOINT}/change-status/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error when changing status of Role with id ${id}:`, error);
    //throw error;
    return null;
  }
}