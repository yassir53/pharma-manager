import api from './axiosConfig';

export const getAlerts = async () => {
    try {
        const response = await api.get('/medicaments/alertes-stock/');
        return response.data;
    } catch (error) {
        console.error('Error fetching stock alerts:', error);
        throw error;
    }
};
