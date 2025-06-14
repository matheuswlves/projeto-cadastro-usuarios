import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Box, Typography, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import UserForm from '../components/UserForm';
import ConfirmationDialog from '../components/ConfirmationDialog';

const UserManagementPage = () => {
  const [users, setUsers] = useState<api.User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState<api.User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<api.User | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) { toast.error('Falha ao carregar usuários.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleOpenForm = (user: api.User | null = null) => {
    setEditingUser(user); 
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingUser(null);
    setIsFormOpen(false);
    fetchUsers();
  };

  const handleDeleteClick = (user: api.User) => { setUserToDelete(user); };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.deleteUser(userToDelete.id);
      toast.success(`Usuário ${userToDelete.nome} removido!`);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) { toast.error('Falha ao remover usuário.'); }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Usuários Cadastrados</Typography>
        {}
        <Button variant="contained" onClick={() => handleOpenForm()}>Novo Usuário</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Nome</TableCell><TableCell>Email</TableCell><TableCell>Ações</TableCell></TableRow></TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nome} {user.sobrenome}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {}
                  <IconButton onClick={() => handleOpenForm(user)}><Edit /></IconButton>
                  <IconButton onClick={() => handleDeleteClick(user)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {}
      {isFormOpen && <UserForm open={isFormOpen} onClose={handleCloseForm} user={editingUser} />}
      
      {userToDelete && (
        <ConfirmationDialog
          open={!!userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Confirmar Exclusão"
          message={`Tem certeza que deseja excluir o usuário ${userToDelete.nome}?`}
        />
      )}
    </Box>
  );
};

export default UserManagementPage;