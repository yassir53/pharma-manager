import React from 'react';
import { Card, Typography, Box, Chip } from '@mui/material';

const MedicamentCard = ({ medicament }) => {
    return (
        <Card sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            p: 2, 
            bgcolor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            boxShadow: 'none',
            '&:hover': { bgcolor: '#f1f5f9' }
        }}>
            <Typography sx={{ fontWeight: 600, color: '#334155' }}>
                {medicament.nom }
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>
                    Unités:
                </Typography>
                <Chip 
                    label={medicament.stock_actuel} 
                    color={ (medicament.stock_actuel) < (medicament.stock_minimum) ? "error" : "warning" }
                    size="small"
                    sx={{ fontWeight: 'bold' }}
                />
            </Box>
        </Card>
    );
};

export default MedicamentCard;