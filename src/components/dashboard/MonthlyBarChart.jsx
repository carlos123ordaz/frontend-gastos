import React from 'react';
import { Card, CardContent, Typography, Box, Stack, Chip } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTheme } from '@mui/material/styles';
import { formatCurrency } from '../../utils/formatters';

const MonthlyBarChart = ({ data }) => {
    const theme = useTheme();

    const formatData = (rawData) => {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const grouped = {};

        rawData.forEach(item => {
            const key = `${months[item._id.mes - 1]}`;
            if (!grouped[key]) {
                grouped[key] = { mes: key, ingresos: 0, gastos: 0 };
            }
            if (item._id.tipo === 'ingreso') {
                grouped[key].ingresos = item.total;
            } else {
                grouped[key].gastos = item.total;
            }
        });

        return Object.values(grouped);
    };

    const chartData = formatData(data);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <Box
                    sx={{
                        bgcolor: 'background.paper',
                        p: 2,
                        border: 1,
                        borderColor: 'divider',
                        borderRadius: 1,
                        boxShadow: theme.shadows[3]
                    }}
                >
                    <Typography variant="body2" fontWeight={600} gutterBottom>
                        {payload[0].payload.mes}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                            {entry.name}: {formatCurrency(entry.value)}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    return (
        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Box>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Ingresos vs Gastos
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Comparación mensual
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Chip label="Últimos 6 meses" size="small" variant="outlined" />
                    </Stack>
                </Stack>

                <ResponsiveContainer width="100%" height={320}>
                    <BarChart data={chartData} barGap={8}>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                        <XAxis
                            dataKey="mes"
                            stroke={theme.palette.text.secondary}
                            style={{ fontSize: '12px' }}
                        />
                        <YAxis
                            stroke={theme.palette.text.secondary}
                            style={{ fontSize: '12px' }}
                            tickFormatter={(value) => `S/. ${value}`}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Bar
                            dataKey="ingresos"
                            fill={theme.palette.success.main}
                            name="Ingresos"
                            radius={[8, 8, 0, 0]}
                        />
                        <Bar
                            dataKey="gastos"
                            fill={theme.palette.error.main}
                            name="Gastos"
                            radius={[8, 8, 0, 0]}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default MonthlyBarChart;