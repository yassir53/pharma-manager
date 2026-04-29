import React, { useEffect, useState } from 'react';
import SideBar from '../components/commom/SideBar';
import VenteCard from '../components/ventes/VenteCard';
import VenteFullInfo from '../components/ventes/VenteFullInfo';
import AddVenteDialog from '../components/ventes/AddVenteDialog';
import { getVentesByDate } from '../api/venteAPI'; 
import { 
    Box, Typography, Grid, Button, TextField, 
    CircularProgress, Card, Snackbar, Alert 
} from '@mui/material';
import { Add, Receipt, History, Edit } from '@mui/icons-material';

const Vente = () => {
    const [ventes, setVentes] = useState([]);
    const [selectedVente, setSelectedVente] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editingVente, setEditingVente] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    const drawerWidth = 256; 

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getVentesByDate(searchDate);
            setVentes(data || []);
            if (data?.length > 0 && !selectedVente) setSelectedVente(data[0]);
        } catch (err) {
            showNotification('Erreur de chargement', 'error');
        } finally { setLoading(false); }
    };

    const handleSuccess = () => {
        loadData();
        setOpenDialog(false);
        showNotification('Opération réussie');
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
                        <Receipt sx={{ color: '#6366f1', fontSize: 32 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800 }}>Ventes</Typography>
                    </Box>
                    <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingVente(null); setOpenDialog(true); }} sx={{ bgcolor: '#6366f1' }}>
                        Nouvelle Vente
                    </Button>
                </Box>

                <Grid container spacing={4}>
                    <Grid item xs={12} md={5}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                            <TextField type="date" fullWidth size="small" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} sx={{ bgcolor: 'white' }} />
                            <Button variant="outlined" onClick={loadData} startIcon={<History />}>Filtrer</Button>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, maxHeight: 'calc(100vh - 250px)', overflowY: 'auto' }}>
                            {loading ? <CircularProgress sx={{ m: 'auto', py: 5 }} /> : 
                             ventes.map((v) => (
                                <Box key={v.reference} onClick={() => setSelectedVente(v)} sx={{ cursor: 'pointer', border: selectedVente?.reference === v.reference ? '2px solid #6366f1' : '2px solid transparent', borderRadius: 2 }}>
                                    <VenteCard vente={v} />
                                </Box>
                            ))}
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        {selectedVente ? (
                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                    <Button variant="contained" startIcon={<Edit />} onClick={() => { setEditingVente(selectedVente); setOpenDialog(true); }} color="warning">
                                        Modifier
                                    </Button>
                                </Box>
                                <VenteFullInfo vente={selectedVente} />
                            </Box>
                        ) : <Card sx={{ p: 10, textAlign: 'center', color: '#94a3b8' }}>Sélectionnez une vente</Card>}
                    </Grid>
                </Grid>

                <AddVenteDialog open={openDialog} onClose={() => setOpenDialog(false)} onSuccess={handleSuccess} vente={editingVente} />
                <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.severity}>{notification.message}</Alert>
                </Snackbar>
            </Box>
        </Box>
    );
};

export default Vente;