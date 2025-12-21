import axiosInstance from './axiosConfig';

export const userApi = {
    getAll: async () => {
        const response = await axiosInstance.get('/users');
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    },

    update: async (id, data) => {
        const response = await axiosInstance.put(`/users/${id}`, data);
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/users/${id}`);
        return response.data;
    }
};