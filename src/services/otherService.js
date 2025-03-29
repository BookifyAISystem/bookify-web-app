import api from "./apiService";

const OPEN_AI_ENDPOINT = "/open-ai";

export const generateImage = async (prompt) => {
    try {
        const response = await api.get(`/open-ai/generateImage`, {
            params: { input: prompt }
        });
        return response.data;
    } catch (error) {
        console.error("Error when generating image:", error);
        return null;
    }
};
