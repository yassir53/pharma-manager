import React, { useEffect, useState } from 'react';
import SideBar from '../components/commom/SideBar';
import MedicamentCard from '../components/medicament/MedicamentCard';
import MedicamentFullInfo from '../components/medicament/MedicamentFullInfo';
import MedicamentFormDialog from '../components/medicament/MedicamentFormDialog';
import { getAllMedicaments, deleteMedicament } from '../api/medicamentAPI';
import api from '../api/axiosConfig'; // Used for category fetching
import { 
    Box, Typography, Grid, Button, TextField, 
    InputAdornment, CircularProgress, Card, Snackbar, Alert 
} from '@mui/material';
import { Search, Add, LocalPharmacy, Edit, Delete } from '@mui/icons-material';

const Medicaments = () => {
    const [medicaments, setMedicaments] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedMed, setSelectedMed] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingMed, setEditingMed] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const drawerWidth = 256; //[cite: 11]

    useEffect(() => {
        loadData();
        fetchCategories();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getAllMedicaments(); //[cite: 13]
            setMedicaments(data || []);
            if (data?.length > 0 && !selectedMed) setSelectedMed(data[0]);
        } catch (err) {
            showNotification('Erreur de chargement', 'error');
        } finally { setLoading(false); }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories/');
            setCategories(response.data || []);
        } catch (err) { console.error("Category fetch error", err); }
    };

    const handleOpenEdit = () => {
        setEditingMed(selectedMed);
        setOpenDialog(true);
    };

    const handleDelete = async () => {
        if (!selectedMed) return;
        if (window.confirm(`Supprimer ${selectedMed.nom} ?`)) {
            try {
                await deleteMedicament(selectedMed.nom); //[cite: 13, 15]
                showNotification('Médicament supprimé');
                setSelectedMed(null);
                loadData();
            } catch (err) { showNotification('Erreur suppression', 'error'); }
        }
    };

    const showNotification = (message, severity = 'success') => {
        setNotification({ open: true, message, severity });
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', width: '100vw', bgcolor: '#f8fafc' }}>
            <SideBar />
            <Box component="main" sx={{ flexGrow: 1, ml: { xs: 0, sm: `${drawerWidth}px` }, p: { xs: 2, md: 5 }, width: { sm: `calc(100% - ${drawerWidth}px)` }, boxSizing: 'border-box' }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <LocalPharmacy sx={{ color: '#1d4ed8', fontSize: 32 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>Médicaments</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingMed(null); setOpenDialog(true); }} sx={{ bgcolor: '#1d4ed8' }}>
                        Nouveau
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <TextField fullWidth size="small" placeholder="Rechercher..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} sx={{ mb: 3, bgcolor: 'white' }} InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }} />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
                            {loading ? <CircularProgress sx={{ m: 'auto' }} /> : 
                             medicaments.filter(m => m.nom.toLowerCase().includes(searchTerm.toLowerCase())).map((med) => (
                                <Box key={med.nom} onClick={() => setSelectedMed(med)} sx={{ cursor: 'pointer', border: selectedMed?.nom === med.nom ? '2px solid #6366f1' : '2px solid transparent', borderRadius: 2 }}>
                                    <MedicamentCard medicament={med} />
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Card sx={{ p: 1, borderRadius: 4, minHeight: '600px', bgcolor: 'white' }}>
                            {selectedMed ? (
                                <Box>
                                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 2, gap: 1 }}>
                                        <Button variant="outlined" startIcon={<Edit />} onClick={handleOpenEdit}>Modifier</Button>
                                        <Button variant="outlined" color="error" startIcon={<Delete />} onClick={handleDelete}>Supprimer</Button>
                                    </Box>
                                    <MedicamentFullInfo medicament={selectedMed} />
                                </Box>
                            ) : <Typography sx={{ m: 'auto', textAlign: 'center', mt: 20 }}>Sélectionnez un médicament</Typography>}
                        </Card>
                    </Grid>
                </Grid>

                <MedicamentFormDialog open={openDialog} onClose={() => setOpenDialog(false)} onSuccess={loadData} medicament={editingMed} categories={categories} />
                <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.severity}>{notification.message}</Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default Medicaments;