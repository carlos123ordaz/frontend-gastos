import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Box,
    useTheme
} from '@mui/material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const ChartIncome = ({ data, type = 'line' }) => {
    const theme = useTheme();

    const formatData = (rawData) => {
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

        const grouped = {};
        rawData.forEach(item => {
            const key = `${months[item._id.mes - 1]} ${item._id.año}`;
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
                        borderRadius: 1
                    }}
                >
                    <Typography variant="body2" fontWeight="bold">
                        {payload[0].payload.mes}
                    </Typography>
                    {payload.map((entry, index) => (
                        <Typography key={index} variant="body2" sx={{ color: entry.color }}>
                            {entry.name}: S/. {entry.value.toLocaleString()}
                        </Typography>
                    ))}
                </Box>
            );
        }
        return null;
    };

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Historial de Ingresos y Gastos
                </Typography>
                <ResponsiveContainer width="100%" height={300}>
                    {type === 'line' ? (
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="mes"
                                stroke={theme.palette.text.secondary}
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke={theme.palette.text.secondary}
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="ingresos"
                                stroke={theme.palette.success.main}
                                strokeWidth={2}
                                name="Ingresos"
                            />
                            <Line
                                type="monotone"
                                dataKey="gastos"
                                stroke={theme.palette.error.main}
                                strokeWidth={2}
                                name="Gastos"
                            />
                        </LineChart>
                    ) : (
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                            <XAxis
                                dataKey="mes"
                                stroke={theme.palette.text.secondary}
                                style={{ fontSize: '12px' }}
                            />
                            <YAxis
                                stroke={theme.palette.text.secondary}
                                style={{ fontSize: '12px' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Bar dataKey="ingresos" fill={theme.palette.success.main} name="Ingresos" />
                            <Bar dataKey="gastos" fill={theme.palette.error.main} name="Gastos" />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export default ChartIncome;