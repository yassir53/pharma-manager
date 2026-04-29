import api from './axiosConfig';

export const getVentesByDate = async (date) => {
    try {
        const response = await api.get(`/ventes/list/${date}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ventes by date:', error);
        throw error;
    }
};

export const getAllVentes = async () => {
    try {
        const response = await api.get('/ventes/');
        return response.data;
    } catch (error) {
        console.error('Error fetching all ventes:', error);
        throw error;
    }
};

export const addVente = async (venteData) => {
    try {
        const response = await api.post('/ventes/', venteData);
        return response.data;
    } catch (error) {
        console.error('Error adding vente:', error);
        throw error;
    }
};

export const updateVente = async (id, venteData) => {
    try {
        const response = await api.put(`/ventes/${id}/`, venteData);
        return response.data;
    } catch (error) {
        console.error('Error updating vente:', error);
        throw error;
    }
};