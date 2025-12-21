import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Stack,
    IconButton,
    Drawer,
    TextField,
    Button,
    Divider,
    Chip,
    alpha,
    useTheme,
    ToggleButtonGroup,
    ToggleButton,
    Paper,
    Collapse
} from '@mui/material';
import {
    CalendarMonth,
    FilterList,
    Close,
    Today,
    DateRange,
    CalendarToday,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import { dashboardApi } from '../../api/dashboardApi';
import { format, startOfMonth, endOfMonth, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import RecentTransactions from './RecentTransactions';
import Loading from '../common/Loading';
import MonthlyBarChart from './MonthlyBarChart';
import CategoryPieChart from './CategoryPieChart';
import StatsCards from './StatsCards';

const FILTER_PRESETS = {
    THIS_MONTH: 'this_month',
    LAST_7_DAYS: 'last_7_days',
    LAST_30_DAYS: 'last_30_days',
    THIS_WEEK: 'this_week',
    CUSTOM: 'custom'
};

const Dashboard = () => {
    const theme = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filterDrawer, setFilterDrawer] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(FILTER_PRESETS.THIS_MONTH);
    const [showCustomRange, setShowCustomRange] = useState(false);

    // Filtros aplicados (los que se usan en la API)
    const [appliedFilters, setAppliedFilters] = useState({
        fechaInicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        fechaFin: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    // Filtros temporales (solo para rango personalizado)
    const [tempFilters, setTempFilters] = useState({
        fechaInicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        fechaFin: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    useEffect(() => {
        fetchData();
    }, [appliedFilters]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError('');
            const params = {};
            if (appliedFilters.fechaInicio) params.fechaInicio = appliedFilters.fechaInicio;
            if (appliedFilters.fechaFin) params.fechaFin = appliedFilters.fechaFin;

            const response = await dashboardApi.getResumen(params);
            setData(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cargar datos del dashboard');
        } finally {
            setLoading(false);
        }
    };

    const getPresetDates = (preset) => {
        const now = new Date();

        switch (preset) {
            case FILTER_PRESETS.THIS_MONTH:
                return {
                    fechaInicio: format(startOfMonth(now), 'yyyy-MM-dd'),
                    fechaFin: format(endOfMonth(now), 'yyyy-MM-dd')
                };

            case FILTER_PRESETS.LAST_7_DAYS:
                return {
                    fechaInicio: format(subDays(now, 7), 'yyyy-MM-dd'),
                    fechaFin: format(now, 'yyyy-MM-dd')
                };

            case FILTER_PRESETS.LAST_30_DAYS:
                return {
                    fechaInicio: format(subDays(now, 30), 'yyyy-MM-dd'),
                    fechaFin: format(now, 'yyyy-MM-dd')
                };

            case FILTER_PRESETS.THIS_WEEK:
                return {
                    fechaInicio: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
                    fechaFin: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd')
                };

            default:
                return appliedFilters;
        }
    };

    const handlePresetChange = (preset) => {
        if (!preset) return;

        setSelectedPreset(preset);

        if (preset === FILTER_PRESETS.CUSTOM) {
            setShowCustomRange(true);
            // No aplicar filtros aún, esperar a que el usuario haga clic en "Aplicar"
        } else {
            setShowCustomRange(false);
            const newDates = getPresetDates(preset);
            setAppliedFilters(newDates);
            setTempFilters(newDates);
            setFilterDrawer(false); // Cerrar drawer automáticamente
        }
    };

    const handleCustomDateChange = (field, value) => {
        setTempFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyCustomRange = () => {
        setAppliedFilters(tempFilters);
        setFilterDrawer(false);
    };

    const getFilterLabel = () => {
        switch (selectedPreset) {
            case FILTER_PRESETS.THIS_MONTH:
                return 'Este mes';
            case FILTER_PRESETS.LAST_7_DAYS:
                return 'Últimos 7 días';
            case FILTER_PRESETS.LAST_30_DAYS:
                return 'Últimos 30 días';
            case FILTER_PRESETS.THIS_WEEK:
                return 'Esta semana';
            case FILTER_PRESETS.CUSTOM:
                return `${format(new Date(appliedFilters.fechaInicio), 'dd/MM/yyyy')} - ${format(new Date(appliedFilters.fechaFin), 'dd/MM/yyyy')}`;
            default:
                return 'Filtro';
        }
    };

    if (loading) return <Loading />;

    const currentDate = format(new Date(), "EEEE, d 'de' MMMM yyyy", { locale: es });

    return (
        <Box sx={{ bgcolor: 'background.default' }}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                {/* Header mejorado */}
                <Box sx={{ mb: 4 }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}

                        mb={2}
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
                                Panel de Control
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarMonth sx={{ fontSize: 16 }} />
                                {currentDate}
                            </Typography>
                        </Box>

                        <Button
                            variant="outlined"
                            startIcon={<FilterList />}
                            onClick={() => setFilterDrawer(true)}
                            sx={{
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600,
                                minWidth: 160
                            }}
                        >
                            {getFilterLabel()}
                        </Button>
                    </Stack>

                    {/* Chips de filtros rápidos en desktop */}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            <Chip
                                label="Este mes"
                                onClick={() => handlePresetChange(FILTER_PRESETS.THIS_MONTH)}
                                variant={selectedPreset === FILTER_PRESETS.THIS_MONTH ? 'filled' : 'outlined'}
                                color={selectedPreset === FILTER_PRESETS.THIS_MONTH ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            />
                            <Chip
                                label="Esta semana"
                                onClick={() => handlePresetChange(FILTER_PRESETS.THIS_WEEK)}
                                variant={selectedPreset === FILTER_PRESETS.THIS_WEEK ? 'filled' : 'outlined'}
                                color={selectedPreset === FILTER_PRESETS.THIS_WEEK ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            />
                            <Chip
                                label="Últimos 7 días"
                                onClick={() => handlePresetChange(FILTER_PRESETS.LAST_7_DAYS)}
                                variant={selectedPreset === FILTER_PRESETS.LAST_7_DAYS ? 'filled' : 'outlined'}
                                color={selectedPreset === FILTER_PRESETS.LAST_7_DAYS ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            />
                            <Chip
                                label="Últimos 30 días"
                                onClick={() => handlePresetChange(FILTER_PRESETS.LAST_30_DAYS)}
                                variant={selectedPreset === FILTER_PRESETS.LAST_30_DAYS ? 'filled' : 'outlined'}
                                color={selectedPreset === FILTER_PRESETS.LAST_30_DAYS ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            />
                            <Chip
                                label="Personalizado"
                                icon={<DateRange />}
                                onClick={() => {
                                    setSelectedPreset(FILTER_PRESETS.CUSTOM);
                                    setFilterDrawer(true);
                                }}
                                variant={selectedPreset === FILTER_PRESETS.CUSTOM ? 'filled' : 'outlined'}
                                color={selectedPreset === FILTER_PRESETS.CUSTOM ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            />
                        </Stack>
                    </Box>
                </Box>

                {/* Stats Cards Component */}
                <StatsCards data={data} />

                {/* Charts */}
                <Stack spacing={3} mt={4}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
                        <MonthlyBarChart data={data?.transaccionesPorMes || []} />
                        <CategoryPieChart data={data?.gastosPorCategoria || []} />
                    </Box>


                </Stack>

                {/* Filter Drawer mejorado */}
                <Drawer
                    anchor="right"
                    open={filterDrawer}
                    onClose={() => setFilterDrawer(false)}
                    PaperProps={{
                        sx: {
                            width: { xs: '100%', sm: 400 },
                            borderTopLeftRadius: { xs: 0, sm: 24 },
                            borderBottomLeftRadius: { xs: 0, sm: 24 }
                        }
                    }}
                >
                    <Box sx={{ p: 3 }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h5" fontWeight={700}>
                                Filtrar Período
                            </Typography>
                            <IconButton
                                onClick={() => setFilterDrawer(false)}
                                size="small"
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                }}
                            >
                                <Close />
                            </IconButton>
                        </Stack>

                        <Stack spacing={3}>
                            {/* Opciones predefinidas */}
                            <Box>
                                <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                    PERÍODOS RÁPIDOS
                                </Typography>

                                <Stack spacing={1.5}>
                                    <Button
                                        fullWidth
                                        variant={selectedPreset === FILTER_PRESETS.THIS_MONTH ? 'contained' : 'outlined'}
                                        onClick={() => handlePresetChange(FILTER_PRESETS.THIS_MONTH)}
                                        startIcon={<CalendarToday />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Este mes
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant={selectedPreset === FILTER_PRESETS.THIS_WEEK ? 'contained' : 'outlined'}
                                        onClick={() => handlePresetChange(FILTER_PRESETS.THIS_WEEK)}
                                        startIcon={<Today />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Esta semana
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant={selectedPreset === FILTER_PRESETS.LAST_7_DAYS ? 'contained' : 'outlined'}
                                        onClick={() => handlePresetChange(FILTER_PRESETS.LAST_7_DAYS)}
                                        startIcon={<DateRange />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Últimos 7 días
                                    </Button>

                                    <Button
                                        fullWidth
                                        variant={selectedPreset === FILTER_PRESETS.LAST_30_DAYS ? 'contained' : 'outlined'}
                                        onClick={() => handlePresetChange(FILTER_PRESETS.LAST_30_DAYS)}
                                        startIcon={<DateRange />}
                                        sx={{
                                            justifyContent: 'flex-start',
                                            py: 1.5,
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600
                                        }}
                                    >
                                        Últimos 30 días
                                    </Button>
                                </Stack>
                            </Box>

                            <Divider />

                            {/* Rango personalizado */}
                            <Box>
                                <Button
                                    fullWidth
                                    variant={selectedPreset === FILTER_PRESETS.CUSTOM ? 'contained' : 'outlined'}
                                    onClick={() => {
                                        setSelectedPreset(FILTER_PRESETS.CUSTOM);
                                        setShowCustomRange(!showCustomRange);
                                    }}
                                    endIcon={showCustomRange ? <ExpandLess /> : <ExpandMore />}
                                    sx={{
                                        justifyContent: 'space-between',
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Rango personalizado
                                </Button>

                                <Collapse in={showCustomRange}>
                                    <Stack spacing={2} sx={{ mt: 2 }}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 2
                                            }}
                                        >
                                            <TextField
                                                type="date"
                                                fullWidth
                                                label="Fecha Inicio"
                                                value={tempFilters.fechaInicio}
                                                onChange={(e) => handleCustomDateChange('fechaInicio', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Paper>

                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                border: `1px solid ${theme.palette.divider}`,
                                                borderRadius: 2
                                            }}
                                        >
                                            <TextField
                                                type="date"
                                                fullWidth
                                                label="Fecha Fin"
                                                value={tempFilters.fechaFin}
                                                onChange={(e) => handleCustomDateChange('fechaFin', e.target.value)}
                                                InputLabelProps={{ shrink: true }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2
                                                    }
                                                }}
                                            />
                                        </Paper>

                                        <Button
                                            variant="contained"
                                            fullWidth
                                            onClick={handleApplyCustomRange}
                                            sx={{
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Aplicar Rango
                                        </Button>
                                    </Stack>
                                </Collapse>
                            </Box>

                            {/* Información del período seleccionado */}
                            {selectedPreset !== FILTER_PRESETS.CUSTOM && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2,
                                        borderRadius: 2,
                                        bgcolor: alpha(theme.palette.primary.main, 0.05),
                                        border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`
                                    }}
                                >
                                    <Typography variant="caption" fontWeight={600} color="text.secondary" gutterBottom display="block">
                                        PERÍODO SELECCIONADO
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600} color="primary">
                                        {format(new Date(appliedFilters.fechaInicio), "d 'de' MMMM", { locale: es })} - {format(new Date(appliedFilters.fechaFin), "d 'de' MMMM, yyyy", { locale: es })}
                                    </Typography>
                                </Paper>
                            )}
                        </Stack>

                        {/* Botón de cerrar al final */}
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={() => setFilterDrawer(false)}
                            sx={{
                                mt: 3,
                                py: 1.5,
                                borderRadius: 2,
                                textTransform: 'none',
                                fontWeight: 600
                            }}
                        >
                            Cerrar
                        </Button>
                    </Box>
                </Drawer>
            </Container>
        </Box>
    );
};

export default Dashboard;