import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    List,
    ListItem,
    ListItemButton,
    Stack,
    Chip,
    IconButton,
    Avatar,
    alpha,
    useTheme
} from '@mui/material';
import {
    TrendingUp,
    TrendingDown,
    ChevronRight,
    Receipt,
    Fastfood,
    DirectionsCar,
    Home,
    LocalHospital,
    School,
    SportsEsports,
    MoreHoriz
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

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

const RecentTransactions = ({ transactions }) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const getCategoryIcon = (category) => {
        const Icon = categoryIcons[category] || Receipt;
        return Icon;
    };

    return (
        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}` }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Transacciones Recientes
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Últimas 10 transacciones
                        </Typography>
                    </Box>
                    <Chip
                        label="Ver todas"
                        size="small"
                        clickable
                        onClick={() => navigate('/transactions')}
                        sx={{ fontWeight: 500 }}
                    />
                </Stack>

                <List sx={{ px: 0 }}>
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => {
                            const Icon = transaction.tipo === 'ingreso'
                                ? TrendingUp
                                : getCategoryIcon(transaction.tipoGasto);

                            const isIncome = transaction.tipo === 'ingreso';

                            return (
                                <ListItem
                                    key={transaction._id}
                                    disablePadding
                                    sx={{
                                        borderBottom: index !== transactions.length - 1 ? `1px solid ${theme.palette.divider}` : 'none',
                                    }}
                                >
                                    <ListItemButton
                                        sx={{
                                            py: 2,
                                            px: 0,
                                            '&:hover': {
                                                bgcolor: alpha(theme.palette.primary.main, 0.04)
                                            }
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={2} width="100%">
                                            {/* Icon */}
                                            <Avatar
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    bgcolor: alpha(
                                                        isIncome ? theme.palette.success.main : theme.palette.error.main,
                                                        0.1
                                                    )
                                                }}
                                            >
                                                <Icon
                                                    sx={{
                                                        fontSize: 22,
                                                        color: isIncome ? 'success.main' : 'error.main'
                                                    }}
                                                />
                                            </Avatar>

                                            {/* Content */}
                                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight={500}
                                                    noWrap
                                                    sx={{ mb: 0.5 }}
                                                >
                                                    {transaction.descripcion}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <Typography variant="caption" color="text.secondary">
                                                        {formatDate(transaction.fecha)}
                                                    </Typography>
                                                    {!isIncome && transaction.tipoGasto !== 'N/A' && (
                                                        <>
                                                            <Box
                                                                sx={{
                                                                    width: 3,
                                                                    height: 3,
                                                                    borderRadius: '50%',
                                                                    bgcolor: 'text.secondary'
                                                                }}
                                                            />
                                                            <Chip
                                                                label={transaction.tipoGasto}
                                                                size="small"
                                                                sx={{
                                                                    height: 18,
                                                                    fontSize: '0.65rem',
                                                                    textTransform: 'capitalize',
                                                                    '& .MuiChip-label': { px: 1 }
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                </Stack>
                                            </Box>

                                            {/* Amount */}
                                            <Stack direction="row" alignItems="center" spacing={1}>
                                                <Typography
                                                    variant="body1"
                                                    fontWeight={700}
                                                    color={isIncome ? 'success.main' : 'error.main'}
                                                    sx={{ minWidth: 100, textAlign: 'right' }}
                                                >
                                                    {isIncome ? '+' : '-'} {formatCurrency(transaction.monto)}
                                                </Typography>
                                                <ChevronRight sx={{ color: 'text.secondary', fontSize: 20 }} />
                                            </Stack>
                                        </Stack>
                                    </ListItemButton>
                                </ListItem>
                            );
                        })
                    ) : (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Receipt sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="body2" color="text.secondary">
                                No hay transacciones recientes
                            </Typography>
                        </Box>
                    )}
                </List>
            </CardContent>
        </Card>
    );
};

export default RecentTransactions;