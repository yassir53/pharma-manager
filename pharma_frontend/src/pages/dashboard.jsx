import React, { useEffect, useState } from 'react';
import SideBar from '../components/commom/SideBar';
import { Card, Typography, Box, Grid, TextField, Button } from '@mui/material';
import { WarningAmber, Dashboard as DashIcon, Search, ShoppingCart, Add } from '@mui/icons-material';
import { getAlerts } from '../api/medicamentAPI';
import { getVentesByDate } from '../api/venteAPI';
import MedicamentCard from '../components/medicament/MedicamentCard';
import VenteCard from '../components/ventes/VenteCard';
import VenteFullInfo from '../components/ventes/VenteFullInfo';
import AddVenteDialog from '../components/ventes/AddVenteDialog';

const Dashboard = () => {
    const [alerts, setAlerts] = useState([]);
    const [ventes, setVentes] = useState([]);
    const [selectedVente, setSelectedVente] = useState(null);
    const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
    const [loadingVentes, setLoadingVentes] = useState(false);
    const [openAddVente, setOpenAddVente] = useState(false);

    const drawerWidth = 260; // Matches your blue sidebar width

    const [editingVente, setEditingVente] = useState(null);
    const [openVenteDialog, setOpenVenteDialog] = useState(false);

    const handleEditVente = (vente) => {
        setEditingVente(vente);
        setOpenVenteDialog(true);
    };

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const alertData = await getAlerts();
                setAlerts(alertData || []);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };
        fetchAlerts();
    }, []);

    const handleSearchVentes = async () => {
        setLoadingVentes(true);
        setSelectedVente(null);
        try {
            const data = await getVentesByDate(searchDate);
            setVentes(data || []);
        } catch (error) {
            console.error('Error fetching ventes:', error);
            setVentes([]);
        }
        setLoadingVentes(false);
    };

    useEffect(() => {
        handleSearchVentes();
    }, []);

    const handleAddVenteSuccess = () => {
        handleSearchVentes();
        setOpenAddVente(false);
    };

    return (
        <Box sx={{ 
            display: 'flex', 
            minHeight: '100vh', 
            width: '100vw', 
            bgcolor: '#f8fafc',
            margin: 0,
            padding: 0,
            overflowX: 'hidden' 
        }}>
            <SideBar />

            <Box 
                component="main" 
                sx={{ 
                    flexGrow: 1, 
                    ml: { xs: 0, sm: `${drawerWidth}px` }, 
                    p: { xs: 2, md: 5 },
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minWidth: 0,
                    boxSizing: 'border-box'
                }}
            >
                {/* Dashboard Header */}
                <Box sx={{ mb: 6, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <DashIcon sx={{ color: '#1e293b', fontSize: 32 }} />
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                        Tableau de Bord
                    </Typography>
                    <Button 
                        variant="contained" 
                        startIcon={<Add />}
                        onClick={() => setOpenAddVente(true)}
                        sx={{ 
                            bgcolor: '#6366f1', 
                            '&:hover': { bgcolor: '#4f46e5' },
                            textTransform: 'none',
                            fontWeight: 600,
                            ml: 'auto'
                        }}
                    >
                        Ajouter une vente
                    </Button>
                </Box>

                <Grid container spacing={4} sx={{ width: '100%', margin: 0 }}>
                    {/* ALERT SECTION */}
                    <Grid item xs={12} lg={5} sx={{ pl: '0 !important', pt: '0 !important' }}>
                        <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                <WarningAmber sx={{ color: '#f59e0b' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>ALERTES STOCK COURT</Typography>
                            </Box>
                            
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {alerts?.map((item, index) => (
                                    <Box key={item.nom || index}>
                                        <MedicamentCard medicament={item} />
                                    </Box>
                                ))}
                            </Box>
                        </Card>
                    </Grid>

                    {/* VENTES SECTION */}
                    <Grid item xs={12} lg={7}>
                        <Card sx={{ p: 3, borderRadius: 4, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', height: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                                <ShoppingCart sx={{ color: '#6366f1' }} />
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>VENTES DU JOUR</Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
                                <TextField
                                    type="date"
                                    fullWidth
                                    value={searchDate}
                                    onChange={(e) => setSearchDate(e.target.value)}
                                    size="small"
                                />
                                <Button 
                                    variant="contained" 
                                    onClick={handleSearchVentes}
                                    startIcon={<Search />}
                                    sx={{ bgcolor: '#6366f1', px: 4, textTransform: 'none' }}
                                >
                                    Rechercher
                                </Button>
                            </Box>

                            {selectedVente ? (
                                <Box>
                                    <Button onClick={() => setSelectedVente(null)} sx={{ mb: 2 }}>← Retour</Button>
                                    <VenteFullInfo vente={selectedVente} />
                                </Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {ventes?.map((vente, index) => (
                                        <Box key={vente.reference || index} onClick={() => setSelectedVente(vente)} sx={{ cursor: 'pointer' }}>
                                            <VenteCard vente={vente} />
                                        </Box>
                                    ))}
                                </Box>
                            )}
                        </Card>
                    </Grid>
                </Grid>

                <AddVenteDialog 
                    open={openAddVente} 
                    onClose={() => setOpenAddVente(false)} 
                    onSuccess={handleAddVenteSuccess}
                />

                <AddVenteDialog 
                    open={openVenteDialog} 
                    onClose={() => { setOpenVenteDialog(false); setEditingVente(null); }} 
                    onSuccess={handleSearchVentes} 
                    vente={editingVente} // Passes existing sale for update[cite: 14]
                />
            </Box>
        </Box>
    );
};

export default Dashboard;