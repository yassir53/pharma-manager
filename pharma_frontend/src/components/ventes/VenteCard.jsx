import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { Receipt, AttachMoney } from '@mui/icons-material';

const VenteCard = ({ vente }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'en cours':
                return 'warning';
            case 'terminée':
                return 'success';
            case 'annulée':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Card sx={{ 
            mb: 2, 
            borderRadius: 2, 
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)'
            }
        }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Receipt sx={{ color: '#6366f1' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                            {vente.reference}
                        </Typography>
                    </Box>
                    <Chip 
                        label={vente.status || 'en cours'} 
                        color={getStatusColor(vente.status)} 
                        size="small"
                        sx={{ fontWeight: 500 }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" sx={{ color: '#64748b' }}>
                        {formatDate(vente.date_vente)}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AttachMoney sx={{ color: '#10b981', fontSize: 20 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#10b981' }}>
                            {parseFloat(vente.total_ttc || 0).toFixed(2)} €
                        </Typography>
                    </Box>
                </Box>

                {vente.note && (
                    <Typography variant="body2" sx={{ color: '#94a3b8', mt: 1, fontStyle: 'italic' }}>
                        {vente.note}
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
};

export default VenteCard;