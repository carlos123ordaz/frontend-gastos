import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Box,
    Button,
    IconButton,
    Stack,
    Avatar,
    Chip,
    Drawer,
    TextField,
    MenuItem,
    Pagination,
    Paper,
    Divider,
    alpha,
    Fab,
    useTheme,
    useMediaQuery,
    Badge,
    Collapse
} from '@mui/material';
import {
    Add,
    FilterList,
    Close,
    TrendingUp,
    TrendingDown,
    Search,
    AttachFile,
    Fastfood,
    DirectionsCar,
    Home,
    LocalHospital,
    School,
    SportsEsports,
    Receipt,
    MoreHoriz,
    CalendarToday,
    ChevronRight,
    Today,
    DateRange,
    ExpandMore,
    ExpandLess
} from '@mui/icons-material';
import { transactionApi } from '../../api/transactionApi';
import { useAuth } from '../../hooks/useAuth';
import { useSnackbar } from 'notistack';
import TransactionDetail from './TransactionDetail';
import ConfirmDialog from '../common/ConfirmDialog';
import Loading from '../common/Loading';
import { formatCurrency, formatDate, formatDateForInput } from '../../utils/formatters';
import { TIPO_GASTO } from '../../utils/constants';
import { format, startOfMonth, endOfMonth, subDays, startOfWeek, endOfWeek } from 'date-fns';
import TransactionFormPage from './Transactionformpage';

const FILTER_PRESETS = {
    ALL: 'all',
    THIS_MONTH: 'this_month',
    LAST_7_DAYS: 'last_7_days',
    LAST_30_DAYS: 'last_30_days',
    THIS_WEEK: 'this_week',
    CUSTOM: 'custom'
};

const categoryIcons = {
    alimentacion: Fastfood,
    transporte: DirectionsCar,
    vivienda: Home,
    salud: LocalHospital,
    educacion: School,
    entretenimiento: SportsEsports,
    servicios: Receipt,
    otros: MoreHoriz,
};

const TransactionList = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { isAdmin } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('list'); // 'list', 'detail', 'form'
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, transaction: null });
    const [filterDrawer, setFilterDrawer] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPreset, setSelectedPreset] = useState(FILTER_PRESETS.THIS_MONTH);
    const [showCustomRange, setShowCustomRange] = useState(false);
    const [totalCount, setTotalCount] = useState(0);

    // Filtros aplicados (los que se envían al backend)
    const [appliedFilters, setAppliedFilters] = useState({
        tipo: '',
        tipoGasto: '',
        fechaInicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        fechaFin: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    // Filtros temporales (para rango personalizado)
    const [tempFilters, setTempFilters] = useState({
        tipo: '',
        tipoGasto: '',
        fechaInicio: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
        fechaFin: format(endOfMonth(new Date()), 'yyyy-MM-dd')
    });

    const [pagination, setPagination] = useState({
        page: 1,
        totalPages: 1,
        limit: 20
    });

    useEffect(() => {
        if (currentView === 'list') {
            fetchTransactions();
        }
    }, [appliedFilters, pagination.page, currentView]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };

            // Solo agregar filtros si tienen valor
            if (appliedFilters.tipo) params.tipo = appliedFilters.tipo;
            if (appliedFilters.tipoGasto) params.tipoGasto = appliedFilters.tipoGasto;
            if (appliedFilters.fechaInicio) params.fechaInicio = appliedFilters.fechaInicio;
            if (appliedFilters.fechaFin) params.fechaFin = appliedFilters.fechaFin;

            const response = await transactionApi.getAll(params);

            setTransactions(response.data);
            setTotalCount(response.total);
            setPagination(prev => ({
                ...prev,
                totalPages: response.totalPages
            }));
        } catch (err) {
            enqueueSnackbar('Error al cargar transacciones', { variant: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getPresetDates = (preset) => {
        const now = new Date();

        switch (preset) {
            case FILTER_PRESETS.ALL:
                return {
                    fechaInicio: '',
                    fechaFin: ''
                };

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
        } else {
            setShowCustomRange(false);
            const newDates = getPresetDates(preset);
            setAppliedFilters(prev => ({
                ...prev,
                ...newDates
            }));
            setTempFilters(prev => ({
                ...prev,
                ...newDates
            }));
            setPagination(prev => ({ ...prev, page: 1 }));
            setFilterDrawer(false);
        }
    };

    const handleViewDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setCurrentView('detail');
    };

    const handleOpenForm = (transaction = null) => {
        setSelectedTransaction(transaction);
        setCurrentView('form');
    };

    const handleBackToList = () => {
        setCurrentView('list');
        setSelectedTransaction(null);
    };

    const handleSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            if (selectedTransaction) {
                await transactionApi.update(selectedTransaction._id, formData);
                enqueueSnackbar('Transacción actualizada', { variant: 'success' });
            } else {
                await transactionApi.create(formData);
                enqueueSnackbar('Transacción creada', { variant: 'success' });
            }
            handleBackToList();
            fetchTransactions();
        } catch (err) {
            enqueueSnackbar(err.response?.data?.message || 'Error al guardar', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteClick = (transaction) => {
        setConfirmDialog({ open: true, transaction });
    };

    const handleDeleteConfirm = async () => {
        try {
            await transactionApi.delete(confirmDialog.transaction._id);
            enqueueSnackbar('Transacción eliminada', { variant: 'success' });
            setConfirmDialog({ open: false, transaction: null });

            // Si estamos en detalle, volver a la lista
            if (currentView === 'detail') {
                handleBackToList();
            }

            fetchTransactions();
        } catch (err) {
            enqueueSnackbar('Error al eliminar', { variant: 'error' });
        }
    };

    const handleFilterChange = (field, value) => {
        setTempFilters(prev => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = () => {
        setAppliedFilters(tempFilters);
        setSelectedPreset(FILTER_PRESETS.CUSTOM);
        setPagination(prev => ({ ...prev, page: 1 }));
        setFilterDrawer(false);
    };

    const handleClearFilters = () => {
        const cleared = {
            tipo: '',
            tipoGasto: '',
            fechaInicio: '',
            fechaFin: ''
        };
        setAppliedFilters(cleared);
        setTempFilters(cleared);
        setSelectedPreset(FILTER_PRESETS.ALL);
        setSearchTerm('');
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const getCategoryIcon = (category) => {
        const Icon = categoryIcons[category] || Receipt;
        return Icon;
    };

    const getFilterLabel = () => {
        if (selectedPreset === FILTER_PRESETS.ALL) return 'Todas';
        if (selectedPreset === FILTER_PRESETS.THIS_MONTH) return 'Este mes';
        if (selectedPreset === FILTER_PRESETS.LAST_7_DAYS) return 'Últimos 7 días';
        if (selectedPreset === FILTER_PRESETS.LAST_30_DAYS) return 'Últimos 30 días';
        if (selectedPreset === FILTER_PRESETS.THIS_WEEK) return 'Esta semana';
        if (selectedPreset === FILTER_PRESETS.CUSTOM && appliedFilters.fechaInicio && appliedFilters.fechaFin) {
            return isSmallMobile ? 'Personalizado' : `${format(new Date(appliedFilters.fechaInicio), 'dd/MM/yy')} - ${format(new Date(appliedFilters.fechaFin), 'dd/MM/yy')}`;
        }
        return 'Filtros';
    };

    const filteredTransactions = transactions.filter(transaction =>
        transaction.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.observaciones?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeFiltersCount = (appliedFilters.tipo ? 1 : 0) +
        (appliedFilters.tipoGasto ? 1 : 0) +
        ((appliedFilters.fechaInicio || appliedFilters.fechaFin) && selectedPreset === FILTER_PRESETS.CUSTOM ? 1 : 0);

    // Renderizar vista de detalle
    if (currentView === 'detail') {
        return (
            <>
                <TransactionDetail
                    transaction={selectedTransaction}
                    onBack={handleBackToList}
                    onEdit={handleOpenForm}
                    onDelete={handleDeleteClick}
                    isAdmin={isAdmin()}
                />
                {/* Confirm Dialog */}
                <ConfirmDialog
                    open={confirmDialog.open}
                    title="Eliminar Transacción"
                    message={`¿Estás seguro de que deseas eliminar "${confirmDialog.transaction?.descripcion}"?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDialog({ open: false, transaction: null })}
                />
            </>
        );
    }

    // Renderizar vista de formulario
    if (currentView === 'form') {
        return (
            <TransactionFormPage
                transaction={selectedTransaction}
                onBack={handleBackToList}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
            />
        );
    }

    // Vista de lista
    if (loading && transactions.length === 0) return <Loading />;

    return (
        <Box sx={{
            bgcolor: 'background.default',
            minHeight: '100vh',
            pb: 10,
            overflowX: 'hidden',
            width: '100%'
        }}>
            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 2, sm: 3 }
                }}
            >
                {/* Header mejorado */}
                <Box sx={{ mb: { xs: 2, sm: 3, md: 4 } }}>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        justifyContent="space-between"
                        alignItems={{ xs: 'flex-start', sm: 'center' }}
                        spacing={2}
                        mb={2}
                    >
                        <Box sx={{ width: { xs: '100%', sm: 'auto' } }}>
                            <Typography
                                variant={isSmallMobile ? 'h5' : 'h4'}
                                fontWeight={700}
                                sx={{
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                                    backgroundClip: 'text',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    mb: 1
                                }}
                            >
                                Transacciones
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' }
                                }}
                            >
                                {totalCount} totales • {filteredTransactions.length} en página
                            </Typography>
                        </Box>

                        <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                                width: { xs: '100%', sm: 'auto' }
                            }}
                        >
                            <Button
                                variant="outlined"
                                startIcon={!isSmallMobile && <FilterList />}
                                onClick={() => setFilterDrawer(true)}
                                sx={{
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    flex: { xs: 1, sm: 'unset' },
                                    minWidth: { xs: 'auto', sm: 140 },
                                    px: { xs: 2, sm: 3 },
                                    fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                                }}
                            >
                                {getFilterLabel()}
                            </Button>
                            {isAdmin() && !isMobile && (
                                <Button
                                    variant="contained"
                                    startIcon={<Add />}
                                    onClick={() => handleOpenForm()}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: 3
                                    }}
                                >
                                    Nueva Transacción
                                </Button>
                            )}
                        </Stack>
                    </Stack>

                    {/* Chips de filtros rápidos en desktop */}
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                            <Chip
                                label="Todas"
                                onClick={() => handlePresetChange(FILTER_PRESETS.ALL)}
                                variant={selectedPreset === FILTER_PRESETS.ALL ? 'filled' : 'outlined'}
                                color={selectedPreset === FILTER_PRESETS.ALL ? 'primary' : 'default'}
                                sx={{
                                    borderRadius: 2,
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            />
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

                {/* Search Bar mejorado */}
                <Paper
                    elevation={0}
                    sx={{
                        mb: { xs: 2, sm: 3 },
                        borderRadius: { xs: 2, sm: 3 },
                        border: `1px solid ${theme.palette.divider}`,
                        overflow: 'hidden'
                    }}
                >
                    <TextField
                        fullWidth
                        placeholder={isSmallMobile ? "Buscar..." : "Buscar por descripción u observaciones..."}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <Search sx={{
                                    mr: { xs: 1, sm: 1.5 },
                                    ml: 0.5,
                                    color: 'text.secondary',
                                    fontSize: { xs: 20, sm: 22 }
                                }} />
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' },
                            },
                            '& .MuiInputBase-input': {
                                fontSize: { xs: '0.875rem', sm: '1rem' },
                                py: { xs: 1.5, sm: 2 }
                            }
                        }}
                    />
                </Paper>

                {/* Active Filters mejorados */}
                {activeFiltersCount > 0 && (
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 1.5, sm: 2 },
                            mb: { xs: 2, sm: 3 },
                            borderRadius: { xs: 2, sm: 3 },
                            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                            bgcolor: alpha(theme.palette.primary.main, 0.02)
                        }}
                    >
                        <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                            gap={1}
                            sx={{ width: '100%' }}
                        >
                            <Typography
                                variant="caption"
                                fontWeight={600}
                                color="text.secondary"
                                sx={{
                                    mr: { xs: 0, sm: 1 },
                                    width: { xs: '100%', sm: 'auto' },
                                    fontSize: { xs: '0.65rem', sm: '0.75rem' }
                                }}
                            >
                                FILTROS ACTIVOS:
                            </Typography>
                            {appliedFilters.tipo && (
                                <Chip
                                    label={`Tipo: ${appliedFilters.tipo}`}
                                    onDelete={() => {
                                        setAppliedFilters(prev => ({ ...prev, tipo: '' }));
                                        setTempFilters(prev => ({ ...prev, tipo: '' }));
                                    }}
                                    size="small"
                                    sx={{
                                        borderRadius: 1.5,
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                    }}
                                />
                            )}
                            {appliedFilters.tipoGasto && (
                                <Chip
                                    label={isSmallMobile ? appliedFilters.tipoGasto : `Categoría: ${appliedFilters.tipoGasto}`}
                                    onDelete={() => {
                                        setAppliedFilters(prev => ({ ...prev, tipoGasto: '' }));
                                        setTempFilters(prev => ({ ...prev, tipoGasto: '' }));
                                    }}
                                    size="small"
                                    sx={{
                                        borderRadius: 1.5,
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                    }}
                                />
                            )}
                            {selectedPreset === FILTER_PRESETS.CUSTOM && (appliedFilters.fechaInicio || appliedFilters.fechaFin) && (
                                <Chip
                                    icon={<CalendarToday sx={{ fontSize: { xs: 14, sm: 16 } }} />}
                                    label="Rango personalizado"
                                    onDelete={() => {
                                        setAppliedFilters(prev => ({ ...prev, fechaInicio: '', fechaFin: '' }));
                                        setTempFilters(prev => ({ ...prev, fechaInicio: '', fechaFin: '' }));
                                        setSelectedPreset(FILTER_PRESETS.ALL);
                                    }}
                                    size="small"
                                    sx={{
                                        borderRadius: 1.5,
                                        fontSize: { xs: '0.7rem', sm: '0.75rem' }
                                    }}
                                />
                            )}
                            <Button
                                size="small"
                                onClick={handleClearFilters}
                                sx={{
                                    ml: { xs: 0, sm: 'auto' },
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: { xs: '0.7rem', sm: '0.75rem' },
                                    width: { xs: '100%', sm: 'auto' },
                                    mt: { xs: 1, sm: 0 }
                                }}
                            >
                                Limpiar todo
                            </Button>
                        </Stack>
                    </Paper>
                )}

                {/* Transactions List mejorado */}
                <Stack spacing={{ xs: 1.5, sm: 2 }}>
                    {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => {
                            const Icon = transaction.tipo === 'ingreso'
                                ? TrendingUp
                                : getCategoryIcon(transaction.tipoGasto);
                            const isIncome = transaction.tipo === 'ingreso';

                            return (
                                <Paper
                                    key={transaction._id}
                                    elevation={0}
                                    sx={{
                                        borderRadius: { xs: 2, sm: 3 },
                                        border: `1px solid ${theme.palette.divider}`,
                                        overflow: 'hidden',
                                        transition: 'all 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            borderColor: theme.palette.primary.main,
                                            boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.1)}`,
                                            transform: 'translateY(-2px)'
                                        }
                                    }}
                                    onClick={() => handleViewDetail(transaction)}
                                >
                                    <Box sx={{ p: { xs: 1.5, sm: 2, md: 2.5 } }}>
                                        <Stack
                                            direction="row"
                                            spacing={{ xs: 1.5, sm: 2 }}
                                            alignItems="center"
                                        >
                                            {/* Icon mejorado */}
                                            <Avatar
                                                sx={{
                                                    width: { xs: 44, sm: 52 },
                                                    height: { xs: 44, sm: 52 },
                                                    bgcolor: alpha(
                                                        isIncome ? theme.palette.success.main : theme.palette.error.main,
                                                        0.12
                                                    ),
                                                    border: `2px solid ${alpha(
                                                        isIncome ? theme.palette.success.main : theme.palette.error.main,
                                                        0.2
                                                    )}`
                                                }}
                                            >
                                                <Icon
                                                    sx={{
                                                        fontSize: { xs: 22, sm: 26 },
                                                        color: isIncome ? 'success.main' : 'error.main'
                                                    }}
                                                />
                                            </Avatar>

                                            {/* Content */}
                                            <Box sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight={600}
                                                    sx={{
                                                        mb: 0.5,
                                                        fontSize: { xs: '0.95rem', sm: '1.05rem' },
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        whiteSpace: 'nowrap'
                                                    }}
                                                >
                                                    {transaction.descripcion}
                                                </Typography>

                                                <Stack
                                                    direction="row"
                                                    spacing={{ xs: 1, sm: 1.5 }}
                                                    alignItems="center"
                                                    flexWrap="wrap"
                                                    sx={{ gap: 0.5 }}
                                                >
                                                    <Stack direction="row" alignItems="center" spacing={0.5}>
                                                        <CalendarToday sx={{ fontSize: { xs: 12, sm: 14 }, color: 'text.secondary' }} />
                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                            fontWeight={500}
                                                            sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                                        >
                                                            {formatDate(transaction.fecha)}
                                                        </Typography>
                                                    </Stack>

                                                    {!isIncome && transaction.tipoGasto !== 'N/A' && (
                                                        <Chip
                                                            label={transaction.tipoGasto}
                                                            size="small"
                                                            sx={{
                                                                height: { xs: 20, sm: 22 },
                                                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                                textTransform: 'capitalize',
                                                                fontWeight: 600,
                                                                borderRadius: 1.5,
                                                                bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                                color: 'primary.main'
                                                            }}
                                                        />
                                                    )}

                                                    {transaction.documento?.url && (
                                                        <Chip
                                                            icon={<AttachFile sx={{ fontSize: { xs: 12, sm: 14 } }} />}
                                                            label="Adjunto"
                                                            size="small"
                                                            sx={{
                                                                height: { xs: 20, sm: 22 },
                                                                fontSize: { xs: '0.65rem', sm: '0.7rem' },
                                                                fontWeight: 600,
                                                                borderRadius: 1.5,
                                                                bgcolor: alpha(theme.palette.info.main, 0.1),
                                                                color: 'info.main'
                                                            }}
                                                        />
                                                    )}
                                                </Stack>
                                            </Box>

                                            {/* Amount */}
                                            <Stack
                                                direction="row"
                                                spacing={{ xs: 0.5, sm: 1 }}
                                                alignItems="center"
                                                sx={{ flexShrink: 0 }}
                                            >
                                                <Typography
                                                    variant="h5"
                                                    fontWeight={700}
                                                    sx={{
                                                        color: isIncome ? 'success.main' : 'error.main',
                                                        fontVariantNumeric: 'tabular-nums',
                                                        fontSize: { xs: '1rem', sm: '1.25rem' }
                                                    }}
                                                >
                                                    {isIncome ? '+' : '-'} {formatCurrency(transaction.monto)}
                                                </Typography>
                                                <ChevronRight
                                                    sx={{
                                                        color: 'text.secondary',
                                                        display: { xs: 'none', sm: 'block' }
                                                    }}
                                                />
                                            </Stack>
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
                                    <Receipt sx={{ fontSize: { xs: 30, sm: 40 }, color: 'primary.main' }} />
                                </Box>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    gutterBottom
                                    sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
                                >
                                    No hay transacciones
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mb: { xs: 2, sm: 3 },
                                        fontSize: { xs: '0.875rem', sm: '0.875rem' }
                                    }}
                                >
                                    {searchTerm ? 'Intenta con otros términos de búsqueda' : 'Comienza agregando tu primera transacción'}
                                </Typography>
                                {isAdmin() && !searchTerm && (
                                    <Button
                                        variant="contained"
                                        startIcon={<Add />}
                                        onClick={() => handleOpenForm()}
                                        sx={{
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 600,
                                            fontSize: { xs: '0.875rem', sm: '0.9375rem' }
                                        }}
                                    >
                                        Nueva Transacción
                                    </Button>
                                )}
                            </Box>
                        </Paper>
                    )}
                </Stack>

                {/* Pagination mejorado */}
                {pagination.totalPages > 1 && (
                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        mt: { xs: 3, sm: 4, md: 5 }
                    }}>
                        <Pagination
                            count={pagination.totalPages}
                            page={pagination.page}
                            onChange={(e, value) => setPagination(prev => ({ ...prev, page: value }))}
                            color="primary"
                            size={isSmallMobile ? 'small' : isMobile ? 'medium' : 'large'}
                            sx={{
                                '& .MuiPaginationItem-root': {
                                    borderRadius: 2,
                                    fontWeight: 600
                                }
                            }}
                        />
                    </Box>
                )}

                {/* FAB Button mejorado solo para móviles */}
                {isAdmin() && isMobile && (
                    <Fab
                        color="primary"
                        aria-label="add"
                        onClick={() => handleOpenForm()}
                        sx={{
                            position: 'fixed',
                            bottom: { xs: 16, sm: 24 },
                            right: { xs: 16, sm: 24 },
                            boxShadow: theme.shadows[12],
                            width: { xs: 56, sm: 64 },
                            height: { xs: 56, sm: 64 }
                        }}
                    >
                        <Add sx={{ fontSize: { xs: 28, sm: 32 } }} />
                    </Fab>
                )}

                {/* Filter Drawer mejorado */}
                <Drawer
                    anchor="right"
                    open={filterDrawer}

                    onClose={() => setFilterDrawer(false)}
                    PaperProps={{
                        sx: {
                            pt: 7,
                            width: { xs: '100%', sm: 400 },
                            borderTopLeftRadius: { xs: 0, sm: 24 },
                            borderBottomLeftRadius: { xs: 0, sm: 24 }
                        }
                    }}
                >
                    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        {/* Header fijo */}
                        <Box sx={{
                            p: { xs: 2, sm: 3 },
                            borderBottom: `1px solid ${theme.palette.divider}`,
                            flexShrink: 0
                        }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                <Typography
                                    variant="h5"
                                    fontWeight={700}
                                    sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                                >
                                    Filtros
                                </Typography>
                                <IconButton
                                    onClick={() => setFilterDrawer(false)}
                                    size="small"
                                    sx={{
                                        bgcolor: alpha(theme.palette.primary.main, 0.1),
                                        width: { xs: 36, sm: 40 },
                                        height: { xs: 36, sm: 40 },
                                        '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                    }}
                                >
                                    <Close sx={{ fontSize: { xs: 20, sm: 24 } }} />
                                </IconButton>
                            </Stack>
                        </Box>

                        {/* Contenido scrolleable */}
                        <Box sx={{
                            flexGrow: 1,
                            overflow: 'auto',
                            p: { xs: 2, sm: 3 }
                        }}>
                            <Stack spacing={3}>
                                {/* Períodos rápidos */}
                                <Box>
                                    <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ mb: 2, display: 'block' }}>
                                        PERÍODOS RÁPIDOS
                                    </Typography>

                                    <Stack spacing={1.5}>
                                        <Button
                                            fullWidth
                                            variant={selectedPreset === FILTER_PRESETS.ALL ? 'contained' : 'outlined'}
                                            onClick={() => handlePresetChange(FILTER_PRESETS.ALL)}
                                            startIcon={<CalendarToday />}
                                            sx={{
                                                justifyContent: 'flex-start',
                                                py: 1.5,
                                                borderRadius: 2,
                                                textTransform: 'none',
                                                fontWeight: 600
                                            }}
                                        >
                                            Todas las transacciones
                                        </Button>

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
                                                    onChange={(e) => handleFilterChange('fechaInicio', e.target.value)}
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
                                                    onChange={(e) => handleFilterChange('fechaFin', e.target.value)}
                                                    InputLabelProps={{ shrink: true }}
                                                    sx={{
                                                        '& .MuiOutlinedInput-root': {
                                                            borderRadius: 2
                                                        }
                                                    }}
                                                />
                                            </Paper>
                                        </Stack>
                                    </Collapse>
                                </Box>

                                <Divider />

                                {/* Filtros adicionales */}
                                <Typography variant="subtitle2" fontWeight={600} color="text.secondary">
                                    FILTROS ADICIONALES
                                </Typography>

                                <TextField
                                    select
                                    fullWidth
                                    label="Tipo de transacción"
                                    value={tempFilters.tipo}
                                    onChange={(e) => handleFilterChange('tipo', e.target.value)}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                >
                                    <MenuItem value="">Todos</MenuItem>
                                    <MenuItem value="ingreso">Ingreso</MenuItem>
                                    <MenuItem value="gasto">Gasto</MenuItem>
                                </TextField>

                                <TextField
                                    select
                                    fullWidth
                                    label="Categoría"
                                    value={tempFilters.tipoGasto}
                                    onChange={(e) => handleFilterChange('tipoGasto', e.target.value)}
                                    disabled={tempFilters.tipo === 'ingreso'}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: 2
                                        }
                                    }}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {TIPO_GASTO.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Stack>
                        </Box>

                        {/* Botones fijos en la parte inferior */}
                        <Box sx={{
                            p: { xs: 2, sm: 3 },
                            borderTop: `1px solid ${theme.palette.divider}`,
                            flexShrink: 0
                        }}>
                            <Stack spacing={2}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    onClick={handleClearFilters}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Limpiar Filtros
                                </Button>

                                <Button
                                    variant="contained"
                                    fullWidth
                                    onClick={handleApplyFilters}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Aplicar Filtros
                                </Button>
                            </Stack>
                        </Box>
                    </Box>
                </Drawer>

                {/* Confirm Dialog */}
                <ConfirmDialog
                    open={confirmDialog.open}
                    title="Eliminar Transacción"
                    message={`¿Estás seguro de que deseas eliminar "${confirmDialog.transaction?.descripcion}"?`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setConfirmDialog({ open: false, transaction: null })}
                />
            </Container>
        </Box>
    );
};

export default TransactionList;