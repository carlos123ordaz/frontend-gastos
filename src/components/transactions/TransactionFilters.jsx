import React from 'react';
import {
    Box,
    TextField,
    MenuItem,
    Grid,
    Button
} from '@mui/material';
import { FilterList, Clear } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { TIPO_GASTO } from '../../utils/constants';
import { formatDateForInput } from '../../utils/formatters';

const TransactionFilters = ({ onFilter, onClear }) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            tipo: '',
            tipoGasto: '',
            fechaInicio: '',
            fechaFin: ''
        }
    });

    const onSubmit = (data) => {
        const filters = {};
        if (data.tipo) filters.tipo = data.tipo;
        if (data.tipoGasto) filters.tipoGasto = data.tipoGasto;
        if (data.fechaInicio) filters.fechaInicio = data.fechaInicio;
        if (data.fechaFin) filters.fechaFin = data.fechaFin;
        onFilter(filters);
    };

    const handleClear = () => {
        reset();
        onClear();
    };

    return (
        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                        name="tipo"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                fullWidth
                                label="Tipo"
                                size="small"
                            >
                                <MenuItem value="">Todos</MenuItem>
                                <MenuItem value="ingreso">Ingreso</MenuItem>
                                <MenuItem value="gasto">Gasto</MenuItem>
                            </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Controller
                        name="tipoGasto"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                select
                                fullWidth
                                label="Categoría"
                                size="small"
                            >
                                <MenuItem value="">Todas</MenuItem>
                                {TIPO_GASTO.map((option) => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }} sm={6} md={2}>
                    <Controller
                        name="fechaInicio"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="date"
                                fullWidth
                                label="Desde"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }} sm={6} md={2}>
                    <Controller
                        name="fechaFin"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                type="date"
                                fullWidth
                                label="Hasta"
                                size="small"
                                InputLabelProps={{ shrink: true }}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }} md={2}>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={<FilterList />}
                            fullWidth
                        >
                            Filtrar
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleClear}
                            sx={{ minWidth: 'auto', px: 1 }}
                        >
                            <Clear />
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default TransactionFilters;