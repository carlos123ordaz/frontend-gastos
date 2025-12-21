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
    InputAdornment,
    useMediaQuery
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
            fullScreen={isMobile}
            PaperProps={{
                sx: {
                    borderRadius: { xs: 0, sm: 3 },
                    m: { xs: 0, sm: 2 }
                }
            }}
        >
            <DialogTitle
                sx={{
                    pb: 1,
                    pt: { xs: 2, sm: 3 },
                    px: { xs: 2, sm: 3 }
                }}
            >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                        <Typography
                            variant="h5"
                            fontWeight={700}
                            sx={{
                                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            {user ? 'Editar Usuario' : 'Nuevo Usuario'}
                        </Typography>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                display: { xs: 'none', sm: 'block' }
                            }}
                        >
                            {user ? 'Modifica la información del usuario' : 'Completa los datos del nuevo usuario'}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={onClose}
                        disabled={isSubmitting}
                        sx={{
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            width: { xs: 36, sm: 40 },
                            height: { xs: 36, sm: 40 },
                            ml: 1,
                            flexShrink: 0,
                            '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                        }}
                    >
                        <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent
                    sx={{
                        pt: { xs: 2, sm: 3 },
                        px: { xs: 2, sm: 3 },
                        pb: { xs: 2, sm: 3 }
                    }}
                >
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                        {/* Nombre */}
                        <Paper
                            elevation={0}
                            sx={{
                                p: { xs: 1.5, sm: 2 },
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2
                            }}
                        >
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Person sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                    >
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
                                                },
                                                '& .MuiInputBase-input': {
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    py: { xs: 1.25, sm: 1.5 }
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
                                p: { xs: 1.5, sm: 2 },
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2
                            }}
                        >
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Email sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                    >
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
                                                },
                                                '& .MuiInputBase-input': {
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    py: { xs: 1.25, sm: 1.5 }
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
                                p: { xs: 1.5, sm: 2 },
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2
                            }}
                        >
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <AdminPanelSettings sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                    >
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
                                                },
                                                '& .MuiInputBase-input': {
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    py: { xs: 1.25, sm: 1.5 }
                                                }
                                            }}
                                        >
                                            <MenuItem value="user">
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Person sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                            sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                                                        >
                                                            Usuario
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </MenuItem>
                                            <MenuItem value="admin">
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <AdminPanelSettings sx={{ fontSize: { xs: 18, sm: 20 }, color: 'primary.main' }} />
                                                    <Box>
                                                        <Typography
                                                            variant="body2"
                                                            fontWeight={600}
                                                            sx={{ fontSize: { xs: '0.875rem', sm: '0.875rem' } }}
                                                        >
                                                            Administrador
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
                                p: { xs: 1.5, sm: 2 },
                                border: `1px solid ${theme.palette.divider}`,
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.success.main, 0.02)
                            }}
                        >
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                spacing={1}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ flexGrow: 1, minWidth: 0 }}
                                >
                                    <ToggleOn
                                        sx={{
                                            fontSize: { xs: 18, sm: 20 },
                                            color: 'text.secondary',
                                            flexShrink: 0
                                        }}
                                    />
                                    <Box sx={{ minWidth: 0 }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight={600}
                                            sx={{
                                                fontSize: { xs: '0.875rem', sm: '0.875rem' },
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap'
                                            }}
                                        >
                                            Estado del Usuario
                                        </Typography>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{
                                                fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                                display: { xs: 'none', sm: 'block' }
                                            }}
                                        >
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
                                            sx={{
                                                flexShrink: 0
                                            }}
                                        />
                                    )}
                                />
                            </Stack>
                        </Paper>
                    </Stack>
                </DialogContent>

                <DialogActions
                    sx={{
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2, sm: 2.5 },
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' }
                    }}
                >
                    <Button
                        onClick={onClose}
                        disabled={isSubmitting}
                        variant="outlined"
                        fullWidth={isMobile}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: { xs: 1.25, sm: 1 },
                            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                            order: { xs: 2, sm: 1 }
                        }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        fullWidth={isMobile}
                        startIcon={!isMobile && <Save />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            px: 3,
                            py: { xs: 1.25, sm: 1 },
                            fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                            order: { xs: 1, sm: 2 }
                        }}
                    >
                        {isSubmitting
                            ? 'Guardando...'
                            : user
                                ? (isMobile ? 'Actualizar' : 'Actualizar Usuario')
                                : (isMobile ? 'Crear' : 'Crear Usuario')
                        }
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserForm;