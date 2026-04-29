import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TextField, 
  Button, 
  Card, 
  Typography, 
  InputAdornment, 
  IconButton,
  Box
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff, LocalPharmacy } from '@mui/icons-material';
import api from '../api/axiosConfig';
import { login } from '../api/auth';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    login(credentials.username, credentials.password);

  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl rounded-xl">
        {/* Logo & Header */}
        <Box className="flex flex-col items-center mb-8">
          <div className="bg-blue-600 p-3 rounded-full mb-4">
            <LocalPharmacy className="text-white text-3xl" />
          </div>
          <Typography variant="h5" className="font-bold text-gray-800 tracking-tight">
            PHARMA MANAGER
          </Typography>
          <Typography variant="body2" className="text-gray-500 mt-1">
            Connectez-vous à votre espace
          </Typography>
        </Box>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            name="username"
            variant="outlined"
            value={credentials.username}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="text-gray-400" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <TextField
            fullWidth
            label="Mot de passe"
            name="password"
            type={showPassword ? 'text' : 'password'}
            variant="outlined"
            value={credentials.password}
            onChange={handleChange}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="text-gray-400" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            className="bg-emerald-500 hover:bg-emerald-600 py-3 text-white font-bold rounded-lg shadow-md transition-all"
          >
            SE CONNECTER
          </Button>
        </form>

        
      </Card>
    </div>
  );
};

export default Login;