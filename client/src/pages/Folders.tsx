import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import {
  Folder as FolderIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import axios from 'axios';

interface Folder {
  id: number;
  name: string;
  parentId: number | null;
}

const Folders: React.FC = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [folderName, setFolderName] = useState('');

  useEffect(() => {
    loadFolders();
  }, []);

  const loadFolders = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/folders');
      setFolders(response.data);
    } catch (error) {
      console.error('Erro ao carregar pastas:', error);
    }
  };

  const handleOpenDialog = (folder?: Folder) => {
    if (folder) {
      setEditingFolder(folder);
      setFolderName(folder.name);
    } else {
      setEditingFolder(null);
      setFolderName('');
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingFolder(null);
    setFolderName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFolder) {
        await axios.put(`http://localhost:3002/api/folders/${editingFolder.id}`, {
          name: folderName
        });
      } else {
        await axios.post('http://localhost:3002/api/folders', {
          name: folderName
        });
      }
      setFolderName('');
      setEditingFolder(null);
      loadFolders();
    } catch (error) {
      console.error('Erro ao salvar pasta:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3002/api/folders/${id}`);
      loadFolders();
    } catch (error) {
      console.error('Erro ao excluir pasta:', error);
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Pastas
      </Typography>
      <Paper sx={{ mt: 2, p: 2 }}>
        <List>
          {folders.map((folder) => (
            <ListItem
              key={folder.id}
              secondaryAction={
                <Box>
                  <IconButton onClick={() => handleOpenDialog(folder)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(folder.id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              }
            >
              <ListItemIcon>
                <FolderIcon />
              </ListItemIcon>
              <ListItemText primary={folder.name} />
            </ListItem>
          ))}
        </List>
      </Paper>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => handleOpenDialog()}
      >
        <AddIcon />
      </Fab>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{editingFolder ? 'Editar Pasta' : 'Nova Pasta'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nome da Pasta"
            fullWidth
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Folders; 