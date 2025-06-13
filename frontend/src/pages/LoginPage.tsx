import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { Container, TextField, Button, Box, Typography } from '@mui/material';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const formData = new URLSearchParams();
      formData.append('username', email); 
      formData.append('password', password);
      await login(formData);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      toast.error('Falha no login. Verifique suas credenciais.');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Login</Typography>
        <TextField margin="normal" required fullWidth id="email" label="Endereço de E-mail" name="email" autoComplete="email" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField margin="normal" required fullWidth name="password" label="Senha" type="password" id="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Entrar</Button>
      </Box>
    </Container>
  );
};

export default LoginPage;