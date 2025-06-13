import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import * as api from '../services/api';
import { toast } from 'react-toastify';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  user: api.User | null; // Placeholder, not used in this simplified version
}

const UserForm: React.FC<UserFormProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({ nome: '', sobrenome: '', email: '', senha: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createUser(formData);
      toast.success('Usuário criado com sucesso!');
      onClose();
    } catch (error: any) {
      toast.error(`Falha: ${error.response?.data?.detail || 'Ocorreu um erro.'}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} component="form" onSubmit={handleSubmit}>
      <DialogTitle>Novo Usuário</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" name="nome" label="Nome" fullWidth required value={formData.nome} onChange={handleChange} />
        <TextField margin="dense" name="sobrenome" label="Sobrenome" fullWidth required value={formData.sobrenome} onChange={handleChange} />
        <TextField margin="dense" name="email" label="E-mail" type="email" fullWidth required value={formData.email} onChange={handleChange} />
        <TextField margin="dense" name="senha" label="Senha" type="password" fullWidth required value={formData.senha} onChange={handleChange} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit">Criar</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;