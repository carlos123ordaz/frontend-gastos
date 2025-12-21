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
    Badge,
    useMediaQuery
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
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
        <Box
            sx={{
                bgcolor: 'background.default',
                minHeight: '100vh',
                pb: 10,
                overflowX: 'hidden',
                width: '100%'
            }}
        >
            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 2, sm: 3 }
                }}
            >
                {/* Header mejorado */}
                <Box sx={{ mb: { xs: 3, sm: 4 } }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                    >
                        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                            <Typography
                                variant={isMobile ? 'h5' : 'h4'}
                                fontWeight={700}
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                {isMobile ? 'Usuarios' : 'Gestión de Usuarios'}
                            </Typography>
                            <Stack
                                direction="row"
                                spacing={{ xs: 1, sm: 2 }}
                                flexWrap="wrap"
                                gap={{ xs: 0.5, sm: 0 }}
                                alignItems="center"
                            >
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    {users.length} {isMobile ? '' : 'usuarios'}
                                </Typography>
                                <Box
                                    sx={{
                                        width: 3,
                                        height: 3,
                                        borderRadius: '50%',
                                        bgcolor: 'text.secondary',
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    color="success.main"
                                    fontWeight={600}
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    {activeUsers} activos
                                </Typography>
                                <Box
                                    sx={{
                                        width: 3,
                                        height: 3,
                                        borderRadius: '50%',
                                        bgcolor: 'text.secondary',
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                />
                                <Typography
                                    variant="body2"
                                    color="primary.main"
                                    fontWeight={600}
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                                >
                                    {adminUsers} admin{isMobile ? '' : 'istradores'}
                                </Typography>
                            </Stack>
                        </Box>
                    </Stack>
                </Box>

                {/* Users List mejorado */}
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {users.length > 0 ? (
                        users.map((user) => {
                            const isAdmin = user.role === 'admin';
                            const isActive = user.activo;

                            return (
                                <Paper
                                    key={user._id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: { xs: 2, sm: 3 },
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
                                    <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                                        <Stack
                                            direction="row"
                                            spacing={{ xs: 1.5, sm: 2 }}
                                            alignItems="flex-start"
                                        >
                                            {/* Content */}
                                            <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                                                <Stack
                                                    direction="row"
                                                    alignItems="center"
                                                    spacing={1}
                                                    mb={0.5}
                                                    flexWrap="wrap"
                                                    gap={0.5}
                                                >
                                                    <Typography
                                                        variant="h6"
                                                        fontWeight={600}
                                                        sx={{
                                                            fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap',
                                                            maxWidth: { xs: '150px', sm: '100%' }
                                                        }}
                                                    >
                                                        {user.nombre}
                                                    </Typography>
                                                    <Chip
                                                        icon={isAdmin ? <AdminPanelSettings sx={{ fontSize: { xs: 14, sm: 16 } }} /> : <Person sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                                                        label={isAdmin ? (isMobile ? 'Admin' : 'Administrador') : 'Usuario'}
                                                        size="small"
                                                        sx={{
                                                            height: { xs: 22, sm: 24 },
                                                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                            fontWeight: 600,
                                                            borderRadius: 1.5,
                                                            bgcolor: isAdmin
                                                                ? alpha(theme.palette.primary.main, 0.1)
                                                                : alpha(theme.palette.grey[500], 0.1),
                                                            color: isAdmin ? 'primary.main' : 'grey.700'
                                                        }}
                                                    />
                                                </Stack>

                                                <Stack
                                                    direction={{ xs: 'column', sm: 'row' }}
                                                    spacing={{ xs: 0.5, sm: 2 }}
                                                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                                                    mb={2}
                                                    flexWrap="wrap"
                                                >
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <Email sx={{ fontSize: { xs: 14, sm: 16 }, color: 'text.secondary' }} />
                                                        <Typography
                                                            variant="body2"
                                                            color="text.secondary"
                                                            sx={{
                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                                whiteSpace: 'nowrap',
                                                                maxWidth: { xs: '200px', sm: '100%' }
                                                            }}
                                                        >
                                                            {user.email}
                                                        </Typography>
                                                    </Stack>
                                                    {!isMobile && (
                                                        <>
                                                            <Box
                                                                sx={{
                                                                    width: 3,
                                                                    height: 3,
                                                                    borderRadius: '50%',
                                                                    bgcolor: 'text.secondary',
                                                                    display: { xs: 'none', sm: 'block' }
                                                                }}
                                                            />
                                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    Registrado: {formatDateTime(user.createdAt)}
                                                                </Typography>
                                                            </Stack>
                                                        </>
                                                    )}
                                                </Stack>

                                                {/* Status y Actions */}
                                                <Stack
                                                    direction="row"
                                                    spacing={1}
                                                    alignItems="center"
                                                    flexWrap="wrap"
                                                    gap={1}
                                                >
                                                    <Chip
                                                        icon={isActive ? <VerifiedUser sx={{ fontSize: { xs: 14, sm: 16 } }} /> : <Block sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                                                        label={isActive ? 'Activo' : 'Inactivo'}
                                                        size="small"
                                                        sx={{
                                                            height: { xs: 26, sm: 28 },
                                                            fontWeight: 600,
                                                            borderRadius: 1.5,
                                                            fontSize: { xs: '0.7rem', sm: '0.75rem' },
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
                                                                    width: { xs: 32, sm: 36 },
                                                                    height: { xs: 32, sm: 36 },
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.primary.main, 0.2),
                                                                    }
                                                                }}
                                                            >
                                                                <Edit sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Eliminar usuario">
                                                            <IconButton
                                                                size="small"
                                                                onClick={() => handleDeleteClick(user)}
                                                                sx={{
                                                                    bgcolor: alpha(theme.palette.error.main, 0.1),
                                                                    color: 'error.main',
                                                                    width: { xs: 32, sm: 36 },
                                                                    height: { xs: 32, sm: 36 },
                                                                    '&:hover': {
                                                                        bgcolor: alpha(theme.palette.error.main, 0.2),
                                                                    }
                                                                }}
                                                            >
                                                                <Delete sx={{ fontSize: { xs: 18, sm: 20 } }} />
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
                                borderRadius: { xs: 2, sm: 3 },
                                border: `1px solid ${theme.palette.divider}`,
                                py: { xs: 6, sm: 8, md: 10 }
                            }}
                        >
                            <Box sx={{ textAlign: 'center', px: 2 }}>
                                <Box
                                    sx={{
                                        width: { xs: 60, sm: 80 },
                                        height: { xs: 60, sm: 80 },
                                        borderRadius: '50%',
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        mx: 'auto',
                                        mb: { xs: 2, sm: 3 }
                                    }}
                                >
                                    <Person sx={{ fontSize: { xs: 30, sm: 40 }, color: 'primary.main' }} />
                                </Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                                >
                                    No hay usuarios registrados
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                                >
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