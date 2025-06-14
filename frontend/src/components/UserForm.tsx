import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from '@mui/material';
import * as api from '../services/api';
import { toast } from 'react-toastify';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  user: api.User | null; 
}

const UserForm: React.FC<UserFormProps> = ({ open, onClose, user }) => {
  const [formData, setFormData] = useState<api.UserPayload>({
    nome: '', sobrenome: '', email: '', senha: ''
  });

  const isEditing = !!user;

  useEffect(() => {
    if (isEditing) {
      setFormData({ nome: user.nome, sobrenome: user.sobrenome, email: user.email, senha: '' });
    } else {
      setFormData({ nome: '', sobrenome: '', email: '', senha: '' });
    }
  }, [user, open]); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditing && user) { 
        const { senha, ...updateData } = formData; 
        await api.updateUser(user.id, updateData);
        toast.success('Usuário atualizado com sucesso!');
      } else { 
        await api.createUser(formData);
        toast.success('Usuário criado com sucesso!');
      }
      onClose();
    } catch (error: any) {
      const detail = error.response?.data?.detail || 'Ocorreu um erro.';
      toast.error(`Falha: ${detail}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} component="form" onSubmit={handleSubmit} fullWidth maxWidth="sm">
      {}
      <DialogTitle>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" name="nome" label="Nome" type="text" fullWidth required value={formData.nome} onChange={handleChange} />
        <TextField margin="dense" name="sobrenome" label="Sobrenome" type="text" fullWidth required value={formData.sobrenome} onChange={handleChange} />
        <TextField margin="dense" name="email" label="E-mail" type="email" fullWidth required value={formData.email} onChange={handleChange} />
        {}
        {!isEditing && (
          <TextField margin="dense" name="senha" label="Senha" type="password" fullWidth required value={formData.senha} onChange={handleChange} />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button type="submit" variant="contained">{isEditing ? 'Salvar Alterações' : 'Criar'}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserForm;