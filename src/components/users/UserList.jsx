import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    Stack,
    Avatar,
    Chip,
    IconButton,
    alpha,
    useTheme,
    Paper,
    Tooltip,
    Badge
} from '@mui/material';
import {
    PersonAdd,
    Edit,
    Delete,
    AdminPanelSettings,
    Person,
    Email,
    CalendarToday,
    VerifiedUser,
    Block
} from '@mui/icons-material';
import { userApi } from '../../api/userApi';
import { useSnackbar } from 'notistack';
import UserForm from './UserForm';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';
import { formatDateTime } from '../../utils/formatters';

const UserList = () => {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openForm, setOpenForm] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await userApi.getAll();
            setUsers(response.data);
        } catch (err) {
            enqueueSnackbar('Error al cargar usuarios', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (user = null) => {
        setSelectedUser(user);
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        setOpenForm(false);
        setSelectedUser(null);
    };

    const handleSubmit = async (data) => {
        try {
            setIsSubmitting(true);
            await userApi.update(selectedUser._id, data);
            enqueueSnackbar('Usuario actualizado', { variant: 'success' });
            handleCloseForm();
            fetchUsers();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || 'Error al actualizar', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (user) => {
        setConfirmDialog({ open: true, user });
    };

    const handleDeleteConfirm = async () => {
        try {
            await userApi.delete(confirmDialog.user._id);
            enqueueSnackbar('Usuario eliminado', { variant: 'success' });
            setConfirmDialog({ open: false, user: null });
            fetchUsers();
        } catch (err) {
            enqueueSnackbar('Error al eliminar', { variant: 'error' });
        }
    };

    const activeUsers = users.filter(u => u.activo).length;
    const adminUsers = users.filter(u => u.role === 'admin').length;

    if (loading) return <Loading />;

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                {/* Header mejorado */}
                <Box sx={{ mb: 4 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                    >
                        <Box>
                            <Typography
                                variant="h4"
                                fontWeight={700}
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                Gestión de Usuarios
                            </Typography>
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                <Typography variant="body2" color="text.secondary">
                                    {users.length} usuarios registrados
                                </Typography>
                                <Box
                                    sx={{
                                        width: 3,
                                        height: 3,
                                        borderRadius: '50%',
                                        bgcolor: 'text.secondary',
                                        alignSelf: 'center'
                                    }}
                                />
                                <Typography variant="body2" color="success.main" fontWeight={600}>
                                    {activeUsers} activos
                                </Typography>
                                <Box
                                    sx={{
                                        width: 3,
                                        height: 3,
                                        borderRadius: '50%',
                                        bgcolor: 'text.secondary',
                                        alignSelf: 'center'
                                    }}
                                />
                                <Typography variant="body2" color="primary.main" fontWeight={600}>
                                    {adminUsers} administradores
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                {/* Stats Cards */}
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2, mb: 4 }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.primary.main, 0.15),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <Person sx={{ color: 'primary.main', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="primary.main">
                                    {users.length}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    TOTAL USUARIOS
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)} 0%, ${alpha(theme.palette.success.main, 0.02)} 100%)`
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.success.main, 0.15),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <VerifiedUser sx={{ color: 'success.main', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="success.main">
                                    {activeUsers}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    ACTIVOS
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    <Paper
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 3,
                            border: `1px solid ${theme.palette.divider}`,
                            background: `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.02)} 100%)`
                        }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 2,
                                    bgcolor: alpha(theme.palette.secondary.main, 0.15),
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}
                            >
                                <AdminPanelSettings sx={{ color: 'secondary.main', fontSize: 24 }} />
                            </Box>
                            <Box>
                                <Typography variant="h4" fontWeight={700} color="secondary.main">
                                    {adminUsers}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                    ADMINISTRADORES
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>
                </Box>

                {/* Users List mejorado */}
                <Stack spacing={2}>
                    {users.length > 0 ? (
                        users.map((user) => {
                            const isAdmin = user.role === 'admin';
                            const isActive = user.activo;

                            return (
                                <Paper
                                    key={user._id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        border: `1px solid ${theme.palette.divider}`,
                                        overflow: 'hidden',
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                >
                                    <Box sx={{ p: 3 }}>
                                        <Stack direction="row" spacing={2} alignItems="flex-start">
                                            {/* Avatar mejorado */}
                                            <Badge
                                                overlap="circular"
                                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                                badgeContent={
                                                    isActive ? (
                                                        <Box
                                                            sx={{
                                                                width: 14,
                                                                height: 14,
                                                                borderRadius: '50%',
                                                                bgcolor: 'success.main',
                                                                border: `2px solid ${theme.palette.background.paper}`
                                                            }}
                                                        />
                                                    ) : (
                                                        <Box
                                                            sx={{
                                                                width: 14,
                                                                height: 14,
                                                                borderRadius: '50%',
                                                                bgcolor: 'error.main',
                                                                border: `2px solid ${theme.palette.background.paper}`
                                                            }}
                                                        />
                                                    )
                                                }
                                            >
                                                <Avatar
                                                    sx={{
                                                        width: 64,
                                                        height: 64,
                                                        bgcolor: alpha(
                                                            isAdmin ? theme.palette.primary.main : theme.palette.grey[500],
                                                            0.12
                                                        ),
                                                        border: `2px solid ${alpha(
                                                            isAdmin ? theme.palette.primary.main : theme.palette.grey[500],
                                                            0.2
                                                        )}`,
                                                        fontSize: '1.5rem',
                                                        fontWeight: 700,
                                                        color: isAdmin ? 'primary.main' : 'grey.700'
                                                    }}
                                                >
                                                    {user.nombre?.charAt(0).toUpperCase()}
                                                </Avatar>
                                            </Badge>

                                            {/* Content */}
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Stack direction="row" alignItems="center" spacing={1} mb={0.5} flexWrap="wrap">
                                                    <Typography variant="h6" fontWeight={600}>
                                                        {user.nombre}
                                                    </Typography>
                                                    <Chip
                                                        icon={isAdmin ? <AdminPanelSettings sx={{ fontSize: 16 }} /> : <Person sx={{ fontSize: 16 }} />}
                                                        label={isAdmin ? 'Administrador' : 'Usuario'}
                                                        size="small"
                                                        sx={{
                                                            height: 24,
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            borderRadius: 1.5,
                                                            bgcolor: isAdmin
                                                                ? alpha(theme.palette.primary.main, 0.1)
                                                                : alpha(theme.palette.grey[500], 0.1),
                                                            color: isAdmin ? 'primary.main' : 'grey.700'
                                                        }}
                                                    />
                                                </Stack>

                                                <Stack direction="row" spacing={2} alignItems="center" mb={2} flexWrap="wrap">
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Email sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {user.email}
                                                        </Typography>
                                                    </Stack>
                                                    <Box
                                                        sx={{
                                                            width: 3,
                                                            height: 3,
                                                            borderRadius: '50%',
                                                            bgcolor: 'text.secondary'
                                                        }}
                                                    />
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="caption" color="text.secondary">
                                                            Registrado: {formatDateTime(user.createdAt)}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>

                                                {/* Status y Actions */}
                                                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                                                    <Chip
                                                        icon={isActive ? <VerifiedUser sx={{ fontSize: 16 }} /> : <Block sx={{ fontSize: 16 }} />}
                                                        label={isActive ? 'Activo' : 'Inactivo'}
                                                        size="small"
                                                        sx={{
                                                            height: 28,
                                                            fontWeight: 600,
                                                            borderRadius: 1.5,
                                                            bgcolor: isActive
                                                                ? alpha(theme.palette.success.main, 0.1)
                                                                : alpha(theme.palette.error.main, 0.1),
                                                            color: isActive ? 'success.main' : 'error.main'
                                                        }}
                                                    />

                                                    <Box sx={{ flexGrow: 1 }} />

                                                    {/* Action buttons */}
                                                    <Stack direction="row" spacing={0.5}>
                                                        <Tooltip title="Editar usuario">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleOpenForm(user)}
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                    color: 'primary.main',
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                    }
                                                                }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar usuario">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteClick(user)}
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                    color: 'error.main',
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.error.main, 0.2),
                                                                    }
                                                                }}
                                                            >
                                                                <Delete fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </Stack>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Paper>
                            );
                        })
                    ) : (
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                py: 10
                            }}
                        >
                            <Box sx={{ textAlign: 'center' }}>
                                <Box
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        borderRadius: '50%',
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: 3
                                    }}
                                >
                                    <Person sx={{ fontSize: 40, color: 'primary.main' }} />
                                </Box>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    No hay usuarios registrados
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Agrega el primer usuario para comenzar
                                </Typography>
                            </Box>
                        </Paper>
                    )}
                </Stack>

                {/* Form Dialog */}
                <UserForm
                    open={openForm}
                    onClose={handleCloseForm}
                    onSubmit={handleSubmit}
                    user={selectedUser}
                    isSubmitting={isSubmitting}
                />

                {/* Confirm Dialog */}
                <ConfirmDialog
                    open={confirmDialog.open}
                    title="Eliminar Usuario"
                    message={`¿Estás seguro de que deseas eliminar a "${confirmDialog.user?.nombre}"?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDialog({ open: false, user: null })}
                />
            </Container>
        </Box>
    );
};

export default UserList;