import React from 'react';
import { Typography } from '@mui/material';

const MedicamentFullInfo = ({ medicament }) => {
    return (
        <div className="p-6 rounded-xl shadow-sm border-none">
            <Typography variant="h4" className="font-bold mb-4">{medicament.name}</Typography>
            <Typography variant="body1" className="mb-2"><strong>Forme:</strong>{medicament.form}</Typography>
            <Typography variant="body1" className="mb-2"><strong>Dosage:</strong>{medicament.dosage}</Typography>
            <Typography variant="body1" className="mb-2"><strong>Prix d'achat:</strong>{medicament.prix_achat}</Typography>
            <Typography variant="body1" className="mb-2"><strong>Prix de vente:</strong>{medicament.prix_vente}</Typography>
            <Typography variant="body1" className="mb-2"><strong>Stock actuel:</strong>{medicament.stock_actuel}</Typography>
            <Typography variant="body1" className="mb-2"><strong>Stock minimum:</strong>{medicament.stock_minimum}</Typography>
            <Typography variant="body1" className="mb-2"><strong>Date d'expiration:</strong>{medicament.date_expiration}</Typography>
            <Typography variant="body1" className="mb-2"><strong>Ordonnance requise:</strong>{medicament.ordonnance_requise ? 'Oui' : 'Non'}</Typography>

        </div>
    );
};

export default MedicamentFullInfo;