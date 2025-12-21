import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    Chip,
    IconButton,
    Stack
} from '@mui/material';
import {
    Edit,
    Delete,
    AttachFile,
    TrendingUp,
    TrendingDown
} from '@mui/icons-material';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { COLORS } from '../../utils/constants';

const TransactionCard = ({ transaction, onEdit, onDelete, canEdit }) => {
    const handleViewDocument = () => {
        if (transaction.documento?.url) {
            window.open(transaction.documento.url, '_blank');
        }
    };

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                '&:hover': canEdit ? {
                    boxShadow: 6,
                    transition: 'all 0.3s'
                } : {}
            }}
        >
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {transaction.tipo === 'ingreso' ? (
                            <TrendingUp sx={{ color: 'success.main' }} />
                        ) : (
                            <TrendingDown sx={{ color: 'error.main' }} />
                        )}
                        <Chip
                            label={transaction.tipo === 'ingreso' ? 'Ingreso' : 'Gasto'}
                            size="small"
                            color={transaction.tipo === 'ingreso' ? 'success' : 'error'}
                        />
                    </Box>
                    {canEdit && (
                        <Box>
                            <IconButton size="small" onClick={() => onEdit(transaction)} color="primary">
                                <Edit fontSize="small" />
                            </IconButton>
                            <IconButton size="small" onClick={() => onDelete(transaction)} color="error">
                                <Delete fontSize="small" />
                            </IconButton>
                        </Box>
                    )}
                </Box>

                <Typography variant="h6" gutterBottom>
                    {transaction.descripcion}
                </Typography>

                <Typography
                    variant="h5"
                    sx={{
                        color: COLORS[transaction.tipo],
                        fontWeight: 'bold',
                        mb: 2
                    }}
                >
                    {transaction.tipo === 'gasto' ? '-' : '+'} {formatCurrency(transaction.monto)}
                </Typography>

                <Stack spacing={1}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            Fecha:
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                            {formatDate(transaction.fecha)}
                        </Typography>
                    </Box>

                    {transaction.tipo === 'gasto' && transaction.tipoGasto !== 'N/A' && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">
                                Categoría:
                            </Typography>
                            <Chip label={transaction.tipoGasto} size="small" />
                        </Box>
                    )}

                    {transaction.observaciones && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Observaciones:
                            </Typography>
                            <Typography variant="body2">
                                {transaction.observaciones}
                            </Typography>
                        </Box>
                    )}

                    {transaction.documento?.url && (
                        <Box sx={{ mt: 1 }}>
                            <Chip
                                icon={<AttachFile />}
                                label="Ver documento"
                                onClick={handleViewDocument}
                                clickable
                                size="small"
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                            Creado por:
                        </Typography>
                        <Typography variant="caption" fontWeight="medium">
                            {transaction.creadoPor?.nombre}
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );
};

export default TransactionCard;