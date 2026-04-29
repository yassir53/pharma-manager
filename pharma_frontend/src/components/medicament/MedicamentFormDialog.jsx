import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Grid, MenuItem, Box, Typography, IconButton,
    FormControlLabel, Checkbox
} from '@mui/material';
import { Close, Save, LocalPharmacy } from '@mui/icons-material';
import { createMedicament, updateMedicament } from '../../api/medicamentAPI';

const MedicamentFormDialog = ({ open, onClose, onSuccess, medicament, categories }) => {
    const isEdit = Boolean(medicament);
    
    // Default state to ensure components remain 'controlled' from the start
    const initialState = {
        nom: '', 
        dci: '', 
        categorie: '', // Ensure this is '' and not undefined
        form: '', 
        dosage: '',
        prix_achat: 0, 
        prix_vente: 0, 
        stock_actuel: 0,
        stock_minimum: 0, 
        date_expiration: new Date().toISOString().split('T')[0], 
        ordonnance_requise: false
    };

    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setErrors({});
            if (medicament) {
                // Merge medicament data with initialState to ensure no undefined fields
                setFormData({ ...initialState, ...medicament });
            } else {
                setFormData(initialState);
            }
        }
    }, [open, medicament]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'checkbox' ? checked : value 
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setErrors({});
        
        try {
            // Sanitize data: Django Decimal/Integer fields hate empty strings
            const sanitizedData = {
                ...formData,
                prix_achat: parseFloat(formData.prix_achat) || 0,
                prix_vente: parseFloat(formData.prix_vente) || 0,
                stock_actuel: parseInt(formData.stock_actuel) || 0,
                stock_minimum: parseInt(formData.stock_minimum) || 0,
                // Ensure categorie is a valid PK
                categorie: formData.categorie 
            };

            if (isEdit) {
                await updateMedicament(medicament.nom, sanitizedData);
            } else {
                await createMedicament(sanitizedData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error("Save Error:", err.response?.data);
            // Set error state to display field-specific errors in the UI
            setErrors(err.response?.data || { detail: "Erreur lors de l'enregistrement" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocalPharmacy color="primary" />
                <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                    {isEdit ? 'Modifier le Médicament' : 'Ajouter un Médicament'}
                </Typography>
                <IconButton onClick={onClose} sx={{ ml: 'auto' }} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="Nom Commercial" name="nom" 
                            value={formData.nom} onChange={handleChange} 
                            disabled={isEdit} size="small"
                            error={!!errors.nom} helperText={errors.nom?.join(' ')} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="DCI" name="dci" 
                            value={formData.dci} onChange={handleChange} size="small"
                            error={!!errors.dci} helperText={errors.dci?.join(' ')} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="Catégorie" name="categorie" 
                            value={formData.categorie} onChange={handleChange} size="small"
                            error={!!errors.categorie} helperText={errors.categorie?.join(' ')} 
                        />
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TextField fullWidth label="Forme" name="form" value={formData.form} onChange={handleChange} size="small" error={!!errors.form} />
                    </Grid>
                    <Grid item xs={6} md={4}>
                        <TextField fullWidth label="Dosage" name="dosage" value={formData.dosage} onChange={handleChange} size="small" error={!!errors.dosage} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField fullWidth label="Prix Achat" name="prix_achat" type="number" value={formData.prix_achat} onChange={handleChange} size="small" error={!!errors.prix_achat} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField fullWidth label="Prix Vente" name="prix_vente" type="number" value={formData.prix_vente} onChange={handleChange} size="small" error={!!errors.prix_vente} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField fullWidth label="Stock Actuel" name="stock_actuel" type="number" value={formData.stock_actuel} onChange={handleChange} size="small" error={!!errors.stock_actuel} />
                    </Grid>
                    <Grid item xs={6} md={3}>
                        <TextField fullWidth label="Stock Minimum" name="stock_minimum" type="number" value={formData.stock_minimum} onChange={handleChange} size="small" error={!!errors.stock_minimum} />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField 
                            fullWidth label="Expiration" name="date_expiration" 
                            type="date" value={formData.date_expiration} onChange={handleChange} 
                            InputLabelProps={{ shrink: true }} size="small" error={!!errors.date_expiration} 
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <FormControlLabel
                            control={<Checkbox name="ordonnance_requise" checked={formData.ordonnance_requise} onChange={handleChange} />}
                            label="Ordonnance Requise"
                        />
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Annuler</Button>
                <Button onClick={handleSave} variant="contained" startIcon={<Save />} disabled={loading} sx={{ bgcolor: '#6366f1' }}>
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default MedicamentFormDialog;