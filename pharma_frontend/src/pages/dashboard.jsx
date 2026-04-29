import React, { useEffect, useState } from 'react';
import SideBar from '../components/commom/SideBar';
import { Card, Typography, Box, Container, Grid } from '@mui/material';
import { WarningAmber, Dashboard as DashIcon } from '@mui/icons-material';
import { getAlerts } from '../api/medicamentAPI';
import MedicamentCard from '../components/medicament/MedicamentCard';

const Dashboard = () => {
    const [alerts, setAlerts] = useState([]);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const alertData = await getAlerts();
                setAlerts(alertData);
            } catch (error) {
                console.error('Error fetching alerts:', error);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
            {/* 1. Sidebar - Ensure it has a fixed width (e.g., 240px) */}
            <SideBar />

            {/* 2. Main Content Area */}
            <Box component="main" sx={{ flexGrow: 1, p: 4, ml: { sm: '240px' } }}>
                <Container maxWidth="xl">
                    
                    {/* Header Section */}
                    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                        <DashIcon sx={{ color: '#1e293b', fontSize: 32 }} />
                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b' }}>
                            Tableau de Bord
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {/* ALERT SECTION */}
                        <Grid item xs={12} lg={5}>
                            <Card sx={{ 
                                p: 3, 
                                borderRadius: 4, 
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                                border: 'none'
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                                    <WarningAmber sx={{ color: '#f59e0b' }} />
                                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                        ALERTES STOCK COURT
                                    </Typography>
                                </Box>
                                
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    {alerts.length > 0 ? (
                                        alerts.map((item) => (
                                            <Box key={item.id || item.name}>
                                                <MedicamentCard medicament={item} />
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography sx={{ py: 4, textAlign: 'center', color: '#94a3b8', fontStyle: 'italic' }}>
                                            Aucune alerte de stock pour le moment.
                                        </Typography>
                                    )}
                                </Box>
                            </Card>
                        </Grid>

                        {/* Future Section: Ventes du Jour could go here (Grid item xs={12} lg={7}) */}
                    </Grid>
                </Container>
            </Box>
        </Box>
    );
};

export default Dashboard;