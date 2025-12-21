import React from 'react';
import {
    Box,
    Container,
    Typography,
    Stack,
    IconButton,
    Paper,
    Divider,
    Chip,
    Avatar,
    Button,
    useTheme,
    alpha,
    Grid
} from '@mui/material';
import {
    ArrowBack,
    Edit,
    Delete as DeleteIcon,
    TrendingUp,
    TrendingDown,
    CalendarToday,
    AttachFile,
    Person,
    Description,
    Category,
    Fastfood,
    DirectionsCar,
    Home,
    LocalHospital,
    School,
    SportsEsports,
    Receipt,
    MoreHoriz,
    AccessTime
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';

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

const TransactionDetail = ({ transaction, onBack, onEdit, onDelete, isAdmin }) => {
    const theme = useTheme();

    if (!transaction) return null;

    const isIncome = transaction.tipo === 'ingreso';
    const Icon = isIncome ? TrendingUp : (categoryIcons[transaction.tipoGasto] || Receipt);

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
                                sx={{
                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                    '&:hover': { bgcolor: alpha(theme.palette.primary.main, 0.2) }
                                }}
                            >
                                <ArrowBack />
                            </IconButton>
                            <Typography variant="h6" fontWeight={600}>
                                Detalle de Transacción
                            </Typography>
                        </Stack>

                        {isAdmin && (
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="outlined"
                                    startIcon={<Edit />}
                                    onClick={() => onEdit(transaction)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600
                                    }}
                                >
                                    Editar
                                </Button>
                                <IconButton
                                    onClick={() => onDelete(transaction)}
                                    sx={{
                                        color: 'error.main',
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Stack>
                        )}
                    </Stack>
                </Container>
            </Paper>

            {/* Content */}
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Stack spacing={3}>
                    {/* Main Info Card */}
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
                                background: `linear-gradient(135deg, ${isIncome
                                        ? alpha(theme.palette.success.main, 0.1)
                                        : alpha(theme.palette.error.main, 0.1)
                                    } 0%, ${isIncome
                                        ? alpha(theme.palette.success.light, 0.05)
                                        : alpha(theme.palette.error.light, 0.05)
                                    } 100%)`,
                                p: 4,
                                textAlign: 'center'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: alpha(
                                        isIncome ? theme.palette.success.main : theme.palette.error.main,
                                        0.15
                                    ),
                                    border: `3px solid ${alpha(
                                        isIncome ? theme.palette.success.main : theme.palette.error.main,
                                        0.3
                                    )}`
                                }}
                            >
                                <Icon sx={{ fontSize: 40, color: isIncome ? 'success.main' : 'error.main' }} />
                            </Avatar>

                            <Typography variant="h3" fontWeight={700} gutterBottom sx={{
                                color: isIncome ? 'success.main' : 'error.main',
                                fontVariantNumeric: 'tabular-nums'
                            }}>
                                {isIncome ? '+' : '-'} {formatCurrency(transaction.monto)}
                            </Typography>

                            <Chip
                                label={isIncome ? 'Ingreso' : 'Gasto'}
                                sx={{
                                    mt: 1,
                                    fontWeight: 600,
                                    bgcolor: isIncome
                                        ? alpha(theme.palette.success.main, 0.2)
                                        : alpha(theme.palette.error.main, 0.2),
                                    color: isIncome ? 'success.main' : 'error.main',
                                    borderRadius: 2
                                }}
                            />
                        </Box>

                        <Divider />

                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Descripción */}
                                <Grid item xs={12}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Description sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                DESCRIPCIÓN
                                            </Typography>
                                        </Stack>
                                        <Typography variant="h6" fontWeight={600}>
                                            {transaction.descripcion}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                {/* Fecha */}
                                <Grid item xs={12} sm={6}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CalendarToday sx={{ fontSize: 20, color: 'text.secondary' }} />
                                            <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                FECHA
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body1" fontWeight={500}>
                                            {formatDate(transaction.fecha)}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                {/* Categoría */}
                                {!isIncome && transaction.tipoGasto !== 'N/A' && (
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Category sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                    CATEGORÍA
                                                </Typography>
                                            </Stack>
                                            <Chip
                                                label={transaction.tipoGasto}
                                                size="small"
                                                sx={{
                                                    width: 'fit-content',
                                                    textTransform: 'capitalize',
                                                    fontWeight: 600,
                                                    borderRadius: 1.5,
                                                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                                                    color: 'primary.main'
                                                }}
                                            />
                                        </Stack>
                                    </Grid>
                                )}

                                {/* Observaciones */}
                                {transaction.observaciones && (
                                    <Grid item xs={12}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Description sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                    OBSERVACIONES
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body1" color="text.secondary">
                                                {transaction.observaciones}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                )}

                                {/* Creado por */}
                                {transaction.creadoPor && (
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Person sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                    CREADO POR
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body1" fontWeight={500}>
                                                {transaction.creadoPor.nombre}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                )}

                                {/* Fecha de creación */}
                                {transaction.createdAt && (
                                    <Grid item xs={12} sm={6}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <AccessTime sx={{ fontSize: 20, color: 'text.secondary' }} />
                                                <Typography variant="caption" fontWeight={600} color="text.secondary">
                                                    FECHA DE REGISTRO
                                                </Typography>
                                            </Stack>
                                            <Typography variant="body1" fontWeight={500}>
                                                {formatDate(transaction.createdAt)}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    </Paper>

                    {/* Documento adjunto */}
                    {transaction.documento?.url && (
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 3,
                                border: `1px solid ${theme.palette.divider}`,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ p: 3 }}>
                                <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                                    <AttachFile sx={{ fontSize: 20, color: 'text.secondary' }} />
                                    <Typography variant="caption" fontWeight={600} color="text.secondary">
                                        DOCUMENTO ADJUNTO
                                    </Typography>
                                </Stack>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    href={transaction.documento.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startIcon={<AttachFile />}
                                    sx={{
                                        py: 2,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        justifyContent: 'flex-start'
                                    }}
                                >
                                    Ver documento adjunto
                                </Button>
                            </Box>
                        </Paper>
                    )}
                </Stack>
            </Container>
        </Box>
    );
};

export default TransactionDetail;