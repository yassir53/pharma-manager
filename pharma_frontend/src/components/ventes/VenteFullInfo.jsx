import React from 'react';
import { Card, CardContent, Typography, Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip } from '@mui/material';
import { Receipt, CalendarToday, AttachMoney, Note, Inventory } from '@mui/icons-material';

const VenteFullInfo = ({ vente }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-';
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

    const articles = vente.lignes_vente || vente.articles || [];

    return (
        <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            overflow: 'hidden'
        }}>
            <Box sx={{ 
                bgcolor: '#6366f1', 
                p: 2, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Receipt sx={{ color: '#fff' }} />
                    <Typography variant="h6" sx={{ fontWeight: 700, color: '#fff' }}>
                        Vente {vente.reference}
                    </Typography>
                </Box>
                <Chip 
                    label={vente.status || 'en cours'} 
                    color={getStatusColor(vente.status)} 
                    sx={{ fontWeight: 600, bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                />
            </Box>

            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <CalendarToday sx={{ color: '#64748b' }} />
                        <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: 12 }}>
                                Date
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                                {formatDate(vente.date_vente)}
                            </Typography>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <AttachMoney sx={{ color: '#10b981' }} />
                        <Box>
                            <Typography variant="body2" sx={{ color: '#64748b', fontSize: 12 }}>
                                Total TTC
                            </Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700, color: '#10b981', fontSize: 18 }}>
                                {parseFloat(vente.total_ttc || 0).toFixed(2)} €
                            </Typography>
                        </Box>
                    </Box>

                    {vente.note && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                            <Note sx={{ color: '#64748b', mt: 0.5 }} />
                            <Box>
                                <Typography variant="body2" sx={{ color: '#64748b', fontSize: 12 }}>
                                    Note
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#1e293b' }}>
                                    {vente.note}
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Inventory sx={{ color: '#6366f1' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#1e293b' }}>
                            Articles ({articles.length})
                        </Typography>
                    </Box>

                    {articles.length > 0 ? (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                        <TableCell sx={{ fontWeight: 600, color: '#64748b' }}>Médicament</TableCell>
                                        <TableCell align="center" sx={{ fontWeight: 600, color: '#64748b' }}>Qté</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>Prix Unit.</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 600, color: '#64748b' }}>Sous-total</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {articles.map((article, index) => (
                                        <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f8fafc' } }}>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                    {article.medicament?.nom || article.nom || `ID: ${article.medicament}`}
                                                </Typography>
                                                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                                                    {article.medicament?.dci || article.dci || ''}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={article.quantite} 
                                                    size="small" 
                                                    sx={{ bgcolor: '#e0e7ff', color: '#4338ca', fontWeight: 600 }}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                {parseFloat(article.prix_unitaire || 0).toFixed(2)} €
                                            </TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 600, color: '#10b981' }}>
                                                {parseFloat(article.sous_total || article.quantite * article.prix_unitaire || 0).toFixed(2)} €
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow sx={{ bgcolor: '#f0fdf4' }}>
                                        <TableCell colSpan={3} align="right" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                            Total:
                                        </TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 700, color: '#10b981', fontSize: 16 }}>
                                            {parseFloat(vente.total_ttc || 0).toFixed(2)} €
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    ) : (
                        <Typography sx={{ textAlign: 'center', color: '#94a3b8', py: 3, fontStyle: 'italic' }}>
                            Aucun article pour cette vente
                        </Typography>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default VenteFullInfo;