import axiosInstance from './axiosConfig';

export const transactionApi = {
    getAll: async (params) => {
        const response = await axiosInstance.get('/transactions', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await axiosInstance.get(`/transactions/${id}`);
        return response.data;
    },

    create: async (formData) => {
        const response = await axiosInstance.post('/transactions', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    update: async (id, formData) => {
        const response = await axiosInstance.put(`/transactions/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    },

    delete: async (id) => {
        const response = await axiosInstance.delete(`/transactions/${id}`);
        return response.data;
    }
};