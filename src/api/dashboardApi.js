import axiosInstance from './axiosConfig';

export const dashboardApi = {
    getResumen: async (params) => {
        const response = await axiosInstance.get('/dashboard/resumen', { params });
        return response.data;
    },

    getEstadisticas: async () => {
        const response = await axiosInstance.get('/dashboard/estadisticas');
        return response.data;
    }
};