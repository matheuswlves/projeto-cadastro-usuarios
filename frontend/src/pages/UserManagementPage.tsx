import React from 'react';
import { useState, useEffect } from 'react';
import * as api from '../services/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, CircularProgress, Box, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import UserForm from '../components/UserForm';

const UserManagementPage = () => {
  const [users, setUsers] = useState<api.User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.getUsers();
      setUsers(response.data);
    } catch (error) {
      toast.error('Falha ao carregar usuários. Faça o login novamente.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    fetchUsers(); 
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Usuários Cadastrados</Typography>
        <Button variant="contained" onClick={() => setIsFormOpen(true)}>Novo Usuário</Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Nome</TableCell><TableCell>Email</TableCell></TableRow></TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.nome} {user.sobrenome}</TableCell>
                <TableCell>{user.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isFormOpen && <UserForm open={isFormOpen} onClose={handleCloseForm} user={null} />}
    </Box>
  );
};

export default UserManagementPage;