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
    Chip,
    useMediaQuery
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
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
        <Box
            sx={{
                bgcolor: 'background.default',
                minHeight: '100vh',
                overflowX: 'hidden',
                width: '100%'
            }}
        >
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
                        sx={{
                            py: { xs: 1.5, sm: 2 },
                            gap: 1
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={{ xs: 1, sm: 2 }}
                            sx={{ flexGrow: 1, minWidth: 0 }}
                        >
                            <IconButton
                                onClick={onBack}
                                disabled={isSubmitting}
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    width: { xs: 36, sm: 40 },
                                    height: { xs: 36, sm: 40 },
                                    flexShrink: 0,
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                }}
                            >
                                <ArrowBack sx={{ fontSize: { xs: 20, sm: 24 } }} />
                            </IconButton>
                            <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    sx={{
                                        fontSize: { xs: '1rem', sm: '1.25rem' },
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap'
                                    }}
                                >
                                    {isEdit ? 'Editar Transacción' : 'Nueva Transacción'}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                        display: { xs: 'none', sm: 'block' }
                                    }}
                                >
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
                                px: { xs: 2, sm: 3 },
                                display: { xs: 'none', sm: 'flex' },
                                flexShrink: 0,
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                            }}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </Button>
                    </Stack>
                </Container>
            </Paper>

            {/* Form Content */}
            <Container
                maxWidth="md"
                sx={{
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 2, sm: 3 }
                }}
            >
                <form onSubmit={handleSubmit}>
                    <Stack spacing={{ xs: 2, sm: 3 }}>
                        {/* Tipo de transacción */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: { xs: 2, sm: 3 },
                                border: `1px solid ${theme.palette.divider}`,
                                p: { xs: 2, sm: 2.5, md: 3 }
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={{ xs: 1.5, sm: 2 }}
                            >
                                <Category sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                <Typography
                                    variant="caption"
                                    fontWeight={600}
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                >
                                    TIPO DE TRANSACCIÓN
                                </Typography>
                            </Stack>

                            <Stack
                                direction={{ xs: 'column', sm: 'row' }}
                                spacing={{ xs: 1.5, sm: 2 }}
                            >
                                <Button
                                    fullWidth
                                    variant={formData.tipo === 'ingreso' ? 'contained' : 'outlined'}
                                    onClick={() => handleChange('tipo', 'ingreso')}
                                    sx={{
                                        py: { xs: 1.5, sm: 2 },
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
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
                                        py: { xs: 1.5, sm: 2 },
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
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
                                borderRadius: { xs: 2, sm: 3 },
                                border: `1px solid ${theme.palette.divider}`,
                                p: { xs: 2, sm: 2.5, md: 3 }
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={{ xs: 2, sm: 3 }}
                            >
                                <Description sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                <Typography
                                    variant="caption"
                                    fontWeight={600}
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                >
                                    INFORMACIÓN BÁSICA
                                </Typography>
                            </Stack>

                            <Stack spacing={{ xs: 2, sm: 3 }}>
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
                                                <AccountBalance sx={{
                                                    color: 'text.secondary',
                                                    fontSize: { xs: 20, sm: 24 }
                                                }} />
                                            </InputAdornment>
                                        ),
                                        inputProps: { min: 0, step: '0.01' }
                                    }}
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
                                                <Description sx={{
                                                    color: 'text.secondary',
                                                    fontSize: { xs: 20, sm: 24 }
                                                }} />
                                            </InputAdornment>
                                        )
                                    }}
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
                                                <CalendarToday sx={{
                                                    color: 'text.secondary',
                                                    fontSize: { xs: 20, sm: 24 }
                                                }} />
                                            </InputAdornment>
                                        )
                                    }}
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
                                                    <Category sx={{
                                                        color: 'text.secondary',
                                                        fontSize: { xs: 20, sm: 24 }
                                                    }} />
                                                </InputAdornment>
                                            )
                                        }}
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
                                        {TIPO_GASTO.map((option) => (
                                            <MenuItem
                                                key={option.value}
                                                value={option.value}
                                                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                            >
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
                                borderRadius: { xs: 2, sm: 3 },
                                border: `1px solid ${theme.palette.divider}`,
                                p: { xs: 2, sm: 2.5, md: 3 }
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={{ xs: 2, sm: 3 }}
                            >
                                <Notes sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                <Typography
                                    variant="caption"
                                    fontWeight={600}
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                >
                                    OBSERVACIONES (OPCIONAL)
                                </Typography>
                            </Stack>

                            <TextField
                                fullWidth
                                multiline
                                rows={isMobile ? 3 : 4}
                                label="Observaciones"
                                value={formData.observaciones}
                                onChange={(e) => handleChange('observaciones', e.target.value)}
                                placeholder="Agrega notas adicionales sobre esta transacción..."
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2
                                    },
                                    '& .MuiInputBase-input': {
                                        fontSize: { xs: '0.875rem', sm: '1rem' }
                                    }
                                }}
                            />
                        </Paper>

                        {/* Documento adjunto */}
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: { xs: 2, sm: 3 },
                                border: `1px solid ${theme.palette.divider}`,
                                p: { xs: 2, sm: 2.5, md: 3 }
                            }}
                        >
                            <Stack
                                direction="row"
                                spacing={1}
                                alignItems="center"
                                mb={{ xs: 2, sm: 3 }}
                            >
                                <AttachFile sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                <Typography
                                    variant="caption"
                                    fontWeight={600}
                                    color="text.secondary"
                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                >
                                    DOCUMENTO ADJUNTO (OPCIONAL)
                                </Typography>
                            </Stack>

                            {fileName ? (
                                <Stack
                                    direction="row"
                                    alignItems="center"
                                    spacing={{ xs: 1.5, sm: 2 }}
                                    sx={{
                                        p: { xs: 1.5, sm: 2 },
                                        borderRadius: 2,
                                        border: `1px solid ${theme.palette.divider}`,
                                        bgcolor: alpha(theme.palette.primary.main, 0.05)
                                    }}
                                >
                                    <AttachFile sx={{
                                        color: 'primary.main',
                                        fontSize: { xs: 20, sm: 24 },
                                        flexShrink: 0
                                    }} />
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            flexGrow: 1,
                                            fontSize: { xs: '0.8rem', sm: '0.875rem' },
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {fileName}
                                    </Typography>
                                    <IconButton
                                        size="small"
                                        onClick={removeFile}
                                        sx={{
                                            color: 'error.main',
                                            flexShrink: 0
                                        }}
                                    >
                                        <Close sx={{ fontSize: { xs: 18, sm: 20 } }} />
                                    </IconButton>
                                </Stack>
                            ) : (
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    component="label"
                                    startIcon={<CloudUpload />}
                                    sx={{
                                        py: { xs: 1.5, sm: 2 },
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        borderStyle: 'dashed',
                                        fontSize: { xs: '0.875rem', sm: '0.9375rem' }
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

                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{
                                    mt: 1,
                                    display: 'block',
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                }}
                            >
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
                                py: { xs: 1.5, sm: 2 },
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                display: { xs: 'flex', sm: 'none' },
                                fontSize: { xs: '0.875rem', sm: '0.9375rem' }
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