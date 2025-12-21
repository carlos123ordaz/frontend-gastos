import axiosInstance from './axiosConfig';

export const settingsApi = {
    get: async () => {
        const response = await axiosInstance.get('/settings');
        return response.data;
    },

    update: async (data) => {
        const response = await axiosInstance.put('/settings', data);
        return response.data;
    }
};