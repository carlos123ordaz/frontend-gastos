import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    InputAdornment,
    IconButton,
    MenuItem,
    Stack,
    Card,
    CardContent,
    alpha,
    useTheme
} from '@mui/material';
import { Visibility, VisibilityOff, PersonAdd, AccountBalance } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

const Register = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();

    const password = watch('password');

    const onSubmit = async (data) => {
        try {
            setError('');
            const response = await authApi.register(data);
            login(response.user, response.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al registrar usuario');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                py: 4
            }}
        >
            <Container maxWidth="sm">
                <Card
                    elevation={0}
                    sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 3,
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
                            p: 4,
                            textAlign: 'center'
                        }}
                    >
                        <Box
                            sx={{
                                width: 64,
                                height: 64,
                                borderRadius: 3,
                                bgcolor: 'rgba(255, 255, 255, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <PersonAdd sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
                            Crear Cuenta
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            Únete a FinanzApp
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Regístrate
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Completa el formulario para crear tu cuenta
                        </Typography>

                        {error && (
                            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                                {error}
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Stack spacing={2.5}>
                                <TextField
                                    fullWidth
                                    label="Nombre Completo"
                                    {...register('nombre', {
                                        required: 'El nombre es requerido'
                                    })}
                                    error={!!errors.nombre}
                                    helperText={errors.nombre?.message}
                                />

                                <TextField
                                    fullWidth
                                    label="Correo Electrónico"
                                    type="email"
                                    {...register('email', {
                                        required: 'El email es requerido',
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message: 'Email inválido'
                                        }
                                    })}
                                    error={!!errors.email}
                                    helperText={errors.email?.message}
                                />

                                <TextField
                                    fullWidth
                                    label="Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('password', {
                                        required: 'La contraseña es requerida',
                                        minLength: {
                                            value: 6,
                                            message: 'Mínimo 6 caracteres'
                                        }
                                    })}
                                    error={!!errors.password}
                                    helperText={errors.password?.message}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    onClick={() => setShowPassword(!showPassword)}
                                                    edge="end"
                                                >
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                />

                                <TextField
                                    fullWidth
                                    label="Confirmar Contraseña"
                                    type={showPassword ? 'text' : 'password'}
                                    {...register('confirmPassword', {
                                        required: 'Confirma tu contraseña',
                                        validate: value => value === password || 'Las contraseñas no coinciden'
                                    })}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword?.message}
                                />

                                <TextField
                                    fullWidth
                                    select
                                    label="Rol"
                                    defaultValue="user"
                                    {...register('role')}
                                >
                                    <MenuItem value="user">Usuario</MenuItem>
                                    <MenuItem value="admin">Administrador</MenuItem>
                                </TextField>

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isSubmitting}
                                    startIcon={<PersonAdd />}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        mt: 2
                                    }}
                                >
                                    {isSubmitting ? 'Registrando...' : 'Crear Cuenta'}
                                </Button>
                            </Stack>
                        </form>

                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                            <Typography variant="body2" color="text.secondary">
                                ¿Ya tienes cuenta?{' '}
                                <Button
                                    variant="text"
                                    onClick={() => navigate('/login')}
                                    sx={{ fontWeight: 600 }}
                                >
                                    Inicia sesión aquí
                                </Button>
                            </Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Container>
        </Box>
    );
};

export default Register;