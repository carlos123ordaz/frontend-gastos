import React, { useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Box,
    IconButton,
    Typography,
    FormControlLabel,
    Switch,
    Stack,
    Paper,
    alpha,
    useTheme,
    InputAdornment
} from '@mui/material';
import {
    Close,
    Person,
    Email,
    AdminPanelSettings,
    Save,
    ToggleOn
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';

const UserForm = ({ open, onClose, onSubmit, user, isSubmitting }) => {
    const theme = useTheme();
    const { control, handleSubmit, reset, formState: { errors } } = useForm({
        defaultValues: {
            nombre: '',
            email: '',
            role: 'user',
            activo: true
        }
    });

    useEffect(() => {
        if (user) {
            reset({
                nombre: user.nombre,
                email: user.email,
                role: user.role,
                activo: user.activo
            });
        } else {
            reset({
                nombre: '',
                email: '',
                role: 'user',
                activo: true
            });
        }
    }, [user, reset, open]);

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h5" fontWeight={700}>
                            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {user ? 'Modifica la información del usuario' : 'Completa los datos del nuevo usuario'}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={onClose}
                        disabled={isSubmitting}
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                        }}
                    >
                        <Close />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent sx={{ pt: 3 }}>
                    <Stack spacing={3}>
                        {/* Nombre */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2
                            }}
                        >
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                        NOMBRE COMPLETO
                                    </Typography>
                                </Stack>
                                <Controller
                                    name="nombre"
                                    control={control}
                                    rules={{ required: 'El nombre es requerido' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            placeholder="Ingresa el nombre completo"
                                            error={!!errors.nombre}
                                            helperText={errors.nombre?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Paper>

                        {/* Email */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2
                            }}
                        >
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Email sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                        CORREO ELECTRÓNICO
                                    </Typography>
                                </Stack>
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        required: 'El email es requerido',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email inválido'
                                        }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            type="email"
                                            placeholder="ejemplo@correo.com"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Paper>

                        {/* Rol */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2
                            }}
                        >
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <AdminPanelSettings sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                        ROL DE USUARIO
                                    </Typography>
                                </Stack>
                                <Controller
                                    name="role"
                                    control={control}
                                    rules={{ required: 'El rol es requerido' }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            select
                                            fullWidth
                                            error={!!errors.role}
                                            helperText={errors.role?.message || 'Define los permisos del usuario'}
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    borderRadius: 2
                                                }
                                            }}
                                        >
                                            <MenuItem value="user">
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Person sx={{ fontSize: 20 }} />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            Usuario
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Acceso estándar a la aplicación
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </MenuItem>
                                            <MenuItem value="admin">
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <AdminPanelSettings sx={{ fontSize: 20, color: 'primary.main' }} />
                                                    <Box>
                                                        <Typography variant="body2" fontWeight={600}>
                                                            Administrador
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Acceso completo y gestión de usuarios
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </MenuItem>
                                        </TextField>
                                    )}
                                />
                            </Stack>
                        </Paper>

                        {/* Estado activo */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: 2,
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.success.main, 0.02)
                            }}
                        >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ToggleOn sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Box>
                                        <Typography variant="body2" fontWeight={600}>
                                            Estado del Usuario
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Activar o desactivar acceso
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Controller
                                    name="activo"
                                    control={control}
                                    render={({ field }) => (
                                        <Switch
                                            {...field}
                                            checked={field.value}
                                            color="success"
                                        />
                                    )}
                                />
                            </Stack>
                        </Paper>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, py: 2.5, gap: 1 }}>
                    <Button
                        onClick={onClose}
                        disabled={isSubmitting}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        startIcon={<Save />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3
                        }}
                    >
                        {isSubmitting ? 'Guardando...' : user ? 'Actualizar Usuario' : 'Crear Usuario'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserForm;