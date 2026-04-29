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

export const getAllMedicaments = async () => {
    try {
        const response = await api.get('/medicaments/');
        return response.data;
    } catch (error) {
        console.error('Error fetching medicaments:', error);
        throw error;
    }
};

export const getMedicamentByName = async (nom) => {
    try {
        const response = await api.get(`/medicaments/${nom}/`);
        return response.data;
    } catch (error) {
        console.error('Error fetching medicament:', error);
        throw error;
    }
};

export const createMedicament = async (data) => {
    try {
        const response = await api.post('/medicaments/', data);
        return response.data;
    } catch (error) {
        console.error('Error creating medicament:', error);
        throw error;
    }
};

export const updateMedicament = async (nom, data) => {
    try {
        const response = await api.put(`/medicaments/${nom}/`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating medicament:', error);
        throw error;
    }
};

export const deleteMedicament = async (nom) => {
    try {
        await api.delete(`/medicaments/${nom}/`);
        return true;
    } catch (error) {
        console.error('Error deleting medicament:', error);
        throw error;
    }
};

export const getAllCategories = async () => {
    try {
        const response = await api.get('/categories/'); 
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
};
