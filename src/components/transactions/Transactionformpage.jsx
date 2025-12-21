import React, { useState, useEffect } from 'react';
import {
    Box,
    Container,
    Typography,
    Stack,
    IconButton,
    Paper,
    TextField,
    Button,
    MenuItem,
    InputAdornment,
    useTheme,
    alpha,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    Chip
} from '@mui/material';
import {
    ArrowBack,
    Save,
    AttachFile,
    Close,
    CloudUpload,
    Description,
    CalendarToday,
    Category,
    AccountBalance,
    Notes
} from '@mui/icons-material';
import { TIPO_GASTO } from '../../utils/constants';
import { formatDateForInput } from '../../utils/formatters';

const TransactionFormPage = ({ transaction, onBack, onSubmit, isSubmitting }) => {
    const theme = useTheme();
    const isEdit = !!transaction;

    const [formData, setFormData] = useState({
        tipo: transaction?.tipo || 'gasto',
        monto: transaction?.monto || '',
        descripcion: transaction?.descripcion || '',
        tipoGasto: transaction?.tipoGasto || '',
        fecha: transaction?.fecha ? formatDateForInput(transaction.fecha) : formatDateForInput(new Date()),
        observaciones: transaction?.observaciones || '',
        documento: null
    });

    const [fileName, setFileName] = useState(
        transaction?.documento?.url ? 'Documento actual' : ''
    );

    const [errors, setErrors] = useState({});

    const handleChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value,
            // Si cambia a ingreso, limpiar tipoGasto
            ...(field === 'tipo' && value === 'ingreso' ? { tipoGasto: '' } : {})
        }));
        // Limpiar error del campo
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, documento: file }));
            setFileName(file.name);
        }
    };

    const removeFile = () => {
        setFormData(prev => ({ ...prev, documento: null }));
        setFileName('');
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.monto || formData.monto <= 0) {
            newErrors.monto = 'El monto debe ser mayor a 0';
        }
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es requerida';
        }
        if (formData.tipo === 'gasto' && !formData.tipoGasto) {
            newErrors.tipoGasto = 'Selecciona una categoría para los gastos';
        }
        if (!formData.fecha) {
            newErrors.fecha = 'La fecha es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            const submitData = new FormData();
            submitData.append('tipo', formData.tipo);
            submitData.append('monto', formData.monto);
            submitData.append('descripcion', formData.descripcion);
            submitData.append('fecha', formData.fecha);

            if (formData.tipo === 'gasto' && formData.tipoGasto) {
                submitData.append('tipoGasto', formData.tipoGasto);
            }

            if (formData.observaciones) {
                submitData.append('observaciones', formData.observaciones);
            }

            if (formData.documento) {
                submitData.append('documento', formData.documento);
            }

            onSubmit(submitData);
        }
    };

    return (
        <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            {/* Header */}
            <Paper
                elevation={0}
                sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    position: 'sticky',
                    top: 0,
                    zIndex: 10,
                    bgcolor: 'background.paper'
                }}
            >
                <Container maxWidth="lg">
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="space-between"
                        sx={{ py: 2 }}
                    >
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <IconButton
                                onClick={onBack}
                                disabled={isSubmitting}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Box>
                                <Typography variant="h6" fontWeight={600}>
                                    {isEdit ? 'Editar Transacción' : 'Nueva Transacción'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {isEdit ? 'Modifica los campos que necesites' : 'Completa los datos de la transacción'}
                                </Typography>
                            </Box>
                        </Stack>

                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                px: 3,
                                display: { xs: 'none', sm: 'flex' }
                            }}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </Stack>
                </Container>
            </Paper>

            {/* Form Content */}
            <Container maxWidth="md" sx={{ py: 4 }}>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* Tipo de transacción */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                p: 3
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                <Category sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    TIPO DE TRANSACCIÓN
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={2}>
                                <Button
                                    fullWidth
                                    variant={formData.tipo === 'ingreso' ? 'contained' : 'outlined'}
                                    onClick={() => handleChange('tipo', 'ingreso')}
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        ...(formData.tipo === 'ingreso' && {
                                            bgcolor: 'success.main',
                                            '&:hover': { bgcolor: 'success.dark' }
                                        })
                                    }}
                                >
                                    Ingreso
                                </Button>
                                <Button
                                    fullWidth
                                    variant={formData.tipo === 'gasto' ? 'contained' : 'outlined'}
                                    onClick={() => handleChange('tipo', 'gasto')}
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        ...(formData.tipo === 'gasto' && {
                                            bgcolor: 'error.main',
                                            '&:hover': { bgcolor: 'error.dark' }
                                        })
                                    }}
                                >
                                    Gasto
                                </Button>
                            </Stack>
                        </Paper>

                        {/* Información básica */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                p: 3
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                                <Description sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    INFORMACIÓN BÁSICA
                                </Typography>
                            </Stack>

                            <Stack spacing={3}>
                                {/* Monto */}
                                <TextField
                                    fullWidth
                                    label="Monto"
                                    type="number"
                                    value={formData.monto}
                                    onChange={(e) => handleChange('monto', e.target.value)}
                                    error={!!errors.monto}
                                    helperText={errors.monto}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <AccountBalance sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        ),
                                        inputProps: { min: 0, step: '0.01' }
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />

                                {/* Descripción */}
                                <TextField
                                    fullWidth
                                    label="Descripción"
                                    value={formData.descripcion}
                                    onChange={(e) => handleChange('descripcion', e.target.value)}
                                    error={!!errors.descripcion}
                                    helperText={errors.descripcion}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Description sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />

                                {/* Fecha */}
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Fecha"
                                    value={formData.fecha}
                                    onChange={(e) => handleChange('fecha', e.target.value)}
                                    error={!!errors.fecha}
                                    helperText={errors.fecha}
                                    InputLabelProps={{ shrink: true }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <CalendarToday sx={{ color: 'text.secondary' }} />
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                />

                                {/* Categoría (solo para gastos) */}
                                {formData.tipo === 'gasto' && (
                                    <TextField
                                        select
                                        fullWidth
                                        label="Categoría"
                                        value={formData.tipoGasto}
                                        onChange={(e) => handleChange('tipoGasto', e.target.value)}
                                        error={!!errors.tipoGasto}
                                        helperText={errors.tipoGasto || 'Selecciona la categoría del gasto'}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Category sx={{ color: 'text.secondary' }} />
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 2
                                            }
                                        }}
                                    >
                                        {TIPO_GASTO.map((option) => (
                                            <MenuItem key={option.value} value={option.value}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            </Stack>
                        </Paper>

                        {/* Observaciones */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                p: 3
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                                <Notes sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    OBSERVACIONES (OPCIONAL)
                                </Typography>
                            </Stack>

                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Observaciones"
                                value={formData.observaciones}
                                onChange={(e) => handleChange('observaciones', e.target.value)}
                                placeholder="Agrega notas adicionales sobre esta transacción..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    }
                                }}
                            />
                        </Paper>

                        {/* Documento adjunto */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                p: 3
                            }}
                        >
                            <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                                <AttachFile sx={{ fontSize: 20, color: 'text.secondary' }} />
                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                    DOCUMENTO ADJUNTO (OPCIONAL)
                                </Typography>
                            </Stack>

                            {fileName ? (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                                    }}
                                >
                                    <AttachFile sx={{ color: 'primary.main' }} />
                                    <Typography variant="body2" sx={{ flexGrow: 1 }}>
                                        {fileName}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={removeFile}
                                        sx={{ color: 'error.main' }}
                                    >
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Stack>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUpload />}
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderStyle: 'dashed'
                                    }}
                                >
                                    Seleccionar archivo
                                    <input
                                        type="file"
                                        hidden
                                        onChange={handleFileChange}
                                        accept="image/*,.pdf"
                                    />
                                </Button>
                            )}

                            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                Formatos permitidos: PDF, imágenes (JPG, PNG)
                            </Typography>
                        </Paper>

                        {/* Botón guardar móvil */}
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<Save />}
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            sx={{
                                py: 2,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                display: { xs: 'flex', sm: 'none' }
                            }}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar Transacción'}
                        </Button>
                    </Stack>
                </form>
            </Container>
        </Box>
    );
};

export default TransactionFormPage;