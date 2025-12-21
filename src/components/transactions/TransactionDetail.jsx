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
    Grid,
    useMediaQuery
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
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    if (!transaction) return null;

    const isIncome = transaction.tipo === 'ingreso';
    const Icon = isIncome ? TrendingUp : (categoryIcons[transaction.tipoGasto] || Receipt);

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
                                Detalle de Transacción
                            </Typography>
                        </Stack>

                        {isAdmin && (
                            <Stack
                                direction="row"
                                spacing={{ xs: 0.5, sm: 1 }}
                                sx={{ flexShrink: 0 }}
                            >
                                <Button
                                    variant="outlined"
                                    startIcon={!isMobile && <Edit />}
                                    onClick={() => onEdit(transaction)}
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        px: { xs: 1.5, sm: 2 },
                                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                                        minWidth: { xs: 'auto', sm: 'auto' }
                                    }}
                                >
                                    {isMobile ? <Edit sx={{ fontSize: 20 }} /> : 'Editar'}
                                </Button>
                                <IconButton
                                    onClick={() => onDelete(transaction)}
                                    sx={{
                                        color: 'error.main',
                                        bgcolor: alpha(theme.palette.error.main, 0.1),
                                        width: { xs: 36, sm: 40 },
                                        height: { xs: 36, sm: 40 },
                                        '&:hover': { bgcolor: alpha(theme.palette.error.main, 0.2) }
                                    }}
                                >
                                    <DeleteIcon sx={{ fontSize: { xs: 20, sm: 24 } }} />
                                </IconButton>
                            </Stack>
                        )}
                    </Stack>
                </Container>
            </Paper>

            {/* Content */}
            <Container
                maxWidth="lg"
                sx={{
                    py: { xs: 2, sm: 3, md: 4 },
                    px: { xs: 2, sm: 3 }
                }}
            >
                <Stack spacing={{ xs: 2, sm: 3 }}>
                    {/* Main Info Card */}
                    <Paper
                        elevation={0}
                        sx={{
                            borderRadius: { xs: 2, sm: 3 },
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
                                p: { xs: 3, sm: 4 },
                                textAlign: 'center'
                            }}
                        >
                            <Avatar
                                sx={{
                                    width: { xs: 64, sm: 80 },
                                    height: { xs: 64, sm: 80 },
                                    mx: 'auto',
                                    mb: 2,
                                    bgcolor: alpha(
                                        isIncome ? theme.palette.success.main : theme.palette.error.main,
                                        0.15
                                    ),
                                    border: `${isMobile ? 2 : 3}px solid ${alpha(
                                        isIncome ? theme.palette.success.main : theme.palette.error.main,
                                        0.3
                                    )}`
                                }}
                            >
                                <Icon sx={{
                                    fontSize: { xs: 32, sm: 40 },
                                    color: isIncome ? 'success.main' : 'error.main'
                                }} />
                            </Avatar>

                            <Typography
                                variant="h3"
                                fontWeight={700}
                                gutterBottom
                                sx={{
                                    color: isIncome ? 'success.main' : 'error.main',
                                    fontVariantNumeric: 'tabular-nums',
                                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' },
                                    wordBreak: 'break-all'
                                }}
                            >
                                {isIncome ? '+' : '-'} {formatCurrency(transaction.monto)}
                            </Typography>

                            <Chip
                                label={isIncome ? 'Ingreso' : 'Gasto'}
                                sx={{
                                    mt: 1,
                                    fontWeight: 600,
                                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                    height: { xs: 28, sm: 32 },
                                    bgcolor: isIncome
                                        ? alpha(theme.palette.success.main, 0.2)
                                        : alpha(theme.palette.error.main, 0.2),
                                    color: isIncome ? 'success.main' : 'error.main',
                                    borderRadius: 2
                                }}
                            />
                        </Box>

                        <Divider />

                        <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                            <Grid container spacing={{ xs: 2, sm: 3 }}>
                                {/* Descripción */}
                                <Grid size={{ xs: 12 }}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Description sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                            <Typography
                                                variant="caption"
                                                fontWeight={600}
                                                color="text.secondary"
                                                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                            >
                                                DESCRIPCIÓN
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            variant="h6"
                                            fontWeight={600}
                                            sx={{
                                                fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                                                wordBreak: 'break-word'
                                            }}
                                        >
                                            {transaction.descripcion}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                {/* Fecha */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack spacing={1}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CalendarToday sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                            <Typography
                                                variant="caption"
                                                fontWeight={600}
                                                color="text.secondary"
                                                sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                            >
                                                FECHA
                                            </Typography>
                                        </Stack>
                                        <Typography
                                            variant="body1"
                                            fontWeight={500}
                                            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                        >
                                            {formatDate(transaction.fecha)}
                                        </Typography>
                                    </Stack>
                                </Grid>

                                {/* Categoría */}
                                {!isIncome && transaction.tipoGasto !== 'N/A' && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Category sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={600}
                                                    color="text.secondary"
                                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                                >
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
                                                    fontSize: { xs: '0.75rem', sm: '0.8125rem' },
                                                    height: { xs: 26, sm: 28 },
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
                                    <Grid size={{ xs: 12 }}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Description sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={600}
                                                    color="text.secondary"
                                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                                >
                                                    OBSERVACIONES
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                variant="body1"
                                                color="text.secondary"
                                                sx={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {transaction.observaciones}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                )}

                                {/* Creado por */}
                                {transaction.creadoPor && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Person sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={600}
                                                    color="text.secondary"
                                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                                >
                                                    CREADO POR
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                variant="body1"
                                                fontWeight={500}
                                                sx={{
                                                    fontSize: { xs: '0.875rem', sm: '1rem' },
                                                    wordBreak: 'break-word'
                                                }}
                                            >
                                                {transaction.creadoPor.nombre}
                                            </Typography>
                                        </Stack>
                                    </Grid>
                                )}

                                {/* Fecha de creación */}
                                {transaction.createdAt && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Stack spacing={1}>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <AccessTime sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                                <Typography
                                                    variant="caption"
                                                    fontWeight={600}
                                                    color="text.secondary"
                                                    sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                                >
                                                    FECHA DE REGISTRO
                                                </Typography>
                                            </Stack>
                                            <Typography
                                                variant="body1"
                                                fontWeight={500}
                                                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                                            >
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
                                borderRadius: { xs: 2, sm: 3 },
                                border: `1px solid ${theme.palette.divider}`,
                                overflow: 'hidden'
                            }}
                        >
                            <Box sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
                                <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    mb={2}
                                >
                                    <AttachFile sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                                    <Typography
                                        variant="caption"
                                        fontWeight={600}
                                        color="text.secondary"
                                        sx={{ fontSize: { xs: '0.7rem', sm: '0.75rem' } }}
                                    >
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
                                        py: { xs: 1.5, sm: 2 },
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        fontWeight: 600,
                                        justifyContent: 'flex-start',
                                        fontSize: { xs: '0.875rem', sm: '0.9375rem' }
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