import React, { useState } from 'react';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    InputAdornment,
    IconButton,
    Stack,
    Card,
    CardContent,
    alpha,
    useTheme
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    AccountBalance
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {
        try {
            setError('');
            const response = await authApi.login(data);
            login(response.user, response.token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `radial-gradient(circle at 20% 50%, ${alpha(theme.palette.primary.main, 0.15)} 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, ${alpha(theme.palette.secondary.main, 0.15)} 0%, transparent 50%)`,
                }
            }}
        >
            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
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
                            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
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
                            <AccountBalance sx={{ fontSize: 32, color: 'white' }} />
                        </Box>
                        <Typography variant="h4" fontWeight={700} color="white" gutterBottom>
                            FinanzApp
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                            Control de Ingresos y Gastos
                        </Typography>
                    </Box>

                    <CardContent sx={{ p: 4 }}>
                        <Typography variant="h5" fontWeight={600} gutterBottom>
                            Iniciar Sesión
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={3}>
                            Ingresa tus credenciales para continuar
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

                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    disabled={isSubmitting}
                                    startIcon={<LoginIcon />}
                                    sx={{
                                        py: 1.5,
                                        fontSize: '1rem',
                                        fontWeight: 600,
                                        mt: 2
                                    }}
                                >
                                    {isSubmitting ? 'Ingresando...' : 'Ingresar'}
                                </Button>
                            </Stack>
                        </form>


                    </CardContent>
                </Card>


            </Container>
        </Box>
    );
};

export default Login;