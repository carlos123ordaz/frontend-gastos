import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Stack,
    Divider,
    InputAdornment,
    alpha,
    useTheme,
    Grid
} from '@mui/material';
import {
    Save,
    AccountBalance,
    Info,
    Description,
    TrendingUp,
    AttachMoney
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { settingsApi } from '../../api/settingsApi';
import { useSnackbar } from 'notistack';
import Loading from '../common/Loading';
import { formatCurrency } from '../../utils/formatters';

const Settings = () => {
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [currentSettings, setCurrentSettings] = useState(null);
    const { register, handleSubmit, reset, watch, formState: { errors, isSubmitting } } = useForm();

    const montoInicial = watch('montoInicial', 0);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const response = await settingsApi.get();
            setCurrentSettings(response.data);
            reset({
                montoInicial: response.data.montoInicial,
                descripcion: response.data.descripcion
            });
        } catch (err) {
            enqueueSnackbar('Error al cargar configuración', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        try {
            await settingsApi.update(data);
            enqueueSnackbar('Configuración actualizada', { variant: 'success' });
            fetchSettings();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || 'Error al actualizar', { variant: 'error' });
        }
    };

    if (loading) return <Loading />;

    const hasChanges = currentSettings && parseFloat(montoInicial) !== currentSettings.montoInicial;

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', pb: 10 }}>
            <Container maxWidth="lg" sx={{ py: 4 }}>


                <Grid container spacing={3}>
                    {/* Columna izquierda - Stats Cards */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Stack spacing={3}>
                            {/* Current Balance Card */}
                            <Paper
                                elevation={0}
                                sx={{
                                    borderRadius: 3,
                                    border: `1px solid ${theme.palette.divider}`,
                                    overflow: 'hidden'
                                }}
                            >
                                <Box
                                    sx={{
                                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                                        p: 3
                                    }}
                                >
                                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: 2,
                                                bgcolor: alpha(theme.palette.primary.main, 0.15),
                                                border: `2px solid ${alpha(theme.palette.primary.main, 0.3)}`,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                        >
                                            <AccountBalance sx={{ fontSize: 28, color: 'primary.main' }} />
                                        </Box>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                MONTO INICIAL ACTUAL
                                            </Typography>
                                            <Typography variant="h4" fontWeight={700} color="primary.main">
                                                {formatCurrency(currentSettings?.montoInicial || 0)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Paper>



                            {/* Preview Card - Solo si hay cambios */}
                            {hasChanges && montoInicial > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        borderRadius: 3,
                                        border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                                        overflow: 'hidden'
                                    }}
                                >
                                    <Box
                                        sx={{
                                            background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                                            p: 3
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
                                                <TrendingUp sx={{ fontSize: 24, color: 'success.main' }} />
                                            </Box>
                                            <Box>
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                    NUEVO MONTO INICIAL
                                                </Typography>
                                                <Typography variant="h5" fontWeight={700} color="success.main">
                                                    {formatCurrency(parseFloat(montoInicial))}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Cambio: {formatCurrency(parseFloat(montoInicial) - currentSettings.montoInicial)}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Paper>
                            )}
                        </Stack>
                    </Grid>

                    {/* Columna derecha - Form */}
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                p: 4
                            }}
                        >
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Stack spacing={4}>
                                    {/* Header del formulario */}
                                    <Box>
                                        <Typography variant="h5" fontWeight={700} gutterBottom>
                                            Configuración Financiera
                                        </Typography>

                                    </Box>

                                    <Divider />

                                    {/* Monto Inicial */}
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
                                                <AttachMoney sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                    MONTO INICIAL
                                                </Typography>
                                            </Stack>
                                            <TextField
                                                fullWidth
                                                type="number"
                                                placeholder="0.00"
                                                inputProps={{ step: '0.01', min: '0' }}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Typography fontWeight={600} color="primary.main">
                                                                S/.
                                                            </Typography>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                {...register('montoInicial', {
                                                    required: 'El monto inicial es requerido',
                                                    min: { value: 0, message: 'El monto no puede ser negativo' }
                                                })}
                                                error={!!errors.montoInicial}
                                                helperText={errors.montoInicial?.message || 'Monto base para calcular el balance total del sistema'}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </Paper>



                                    <Divider />

                                    {/* Botón de guardar */}
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        startIcon={<Save />}
                                        disabled={isSubmitting}
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: '1rem'
                                        }}
                                    >
                                        {isSubmitting ? 'Guardando Cambios...' : 'Guardar Configuración'}
                                    </Button>
                                </Stack>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default Settings;