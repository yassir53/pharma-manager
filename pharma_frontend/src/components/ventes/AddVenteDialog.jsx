import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, TextField, Box, Typography, IconButton,
    Autocomplete, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Alert, CircularProgress
} from '@mui/material';
import { Close, Add, Delete, ShoppingCart, Refresh } from '@mui/icons-material';
import { getAllMedicaments } from '../../api/medicamentAPI';
import { addVente, updateVente } from '../../api/venteAPI';

const AddVenteDialog = ({ open, onClose, onSuccess, vente }) => {
    const isEdit = Boolean(vente);
    const [medicaments, setMedicaments] = useState([]);
    const [note, setNote] = useState('');
    const [lignes, setLignes] = useState([]);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            loadMedicaments();
            if (isEdit && vente) {
                setNote(vente.note || '');
                const existingLignes = (vente.lignes_vente || []).map(l => ({
                    medicament: { nom: l.medicament_name || l.medicament }, 
                    quantite: l.quantite,
                    prix_unitaire: l.prix_unitaire
                }));
                setLignes(existingLignes);
            } else {
                setNote('');
                setLignes([]);
            }
        }
    }, [open, vente, isEdit]);

    const loadMedicaments = async () => {
        try {
            const data = await getAllMedicaments();
            setMedicaments(data || []);
        } catch (err) { console.error(err); }
    };

    const handleLigneChange = (index, field, value) => {
        const newLignes = [...lignes];
        newLignes[index][field] = value;
        if (field === 'medicament' && value) {
            newLignes[index].prix_unitaire = parseFloat(value.prix_vente) || 0;
        }
        setLignes(newLignes);
    };

    const handleSave = async () => {
        if (lignes.length === 0) return setError('Ajoutez au moins un médicament');
        setSaving(true);
        setError('');

        try {
            const items = lignes.map(l => ({
                medicament: l.medicament.nom, 
                quantite: parseInt(l.quantite),
                prix_unitaire: parseFloat(l.prix_unitaire)
            }));

            if (isEdit) {
                const payload = { 
                    note, 
                    status: vente.status, 
                    articles: items, 
                    lignes_vente: items 
                };
                await updateVente(vente.reference, payload);
                 window.location.href = '/vente';
            } else {
                const payload = { note, status: 'terminée', lignes_vente: items };
                await addVente(payload);
                 window.location.href = '/vente';
            }
            onSuccess();
            onClose();
        } catch (err) {
            setError(JSON.stringify(err.response?.data || "Erreur d'enregistrement"));
        } finally { setSaving(false); }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingCart color="primary" />
                <Typography variant="h6" component="span" sx={{ fontWeight: 700 }}>
                    {isEdit ? `Modifier Vente: ${vente?.reference}` : 'Nouvelle Vente'}
                </Typography>
            </DialogTitle>

            <DialogContent dividers>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField label="Note" fullWidth multiline rows={2} value={note} onChange={(e) => setNote(e.target.value)} sx={{ mb: 3 }} />
                <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                        <TableHead>
                            <TableRow sx={{ bgcolor: '#f8fafc' }}>
                                <TableCell>Médicament</TableCell>
                                <TableCell width={100}>Qté</TableCell>
                                <TableCell width={120}>Prix</TableCell>
                                <TableCell width={50}></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lignes.map((ligne, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        <Autocomplete
                                            options={medicaments}
                                            getOptionLabel={(option) => option.nom || ""}
                                            value={medicaments.find(m => m.nom === ligne.medicament?.nom) || null}
                                            onChange={(e, v) => handleLigneChange(index, 'medicament', v)}
                                            renderInput={(params) => <TextField {...params} size="small" />}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <TextField type="number" size="small" value={ligne.quantite} onChange={(e) => handleLigneChange(index, 'quantite', e.target.value)} />
                                    </TableCell>
                                    <TableCell>{ligne.prix_unitaire} DA</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => setLignes(lignes.filter((_, i) => i !== index))} color="error"><Delete /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button startIcon={<Add />} onClick={() => setLignes([...lignes, { medicament: null, quantite: 1, prix_unitaire: 0 }])} sx={{ mt: 2 }}>
                    Ajouter Article
                </Button>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">Annuler</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving} sx={{ bgcolor: '#6366f1' }}>
                    {saving ? <CircularProgress size={24} /> : (isEdit ? 'Mettre à jour' : 'Enregistrer')}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddVenteDialog;