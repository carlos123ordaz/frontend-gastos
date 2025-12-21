import React from 'react';
import { Card, CardContent, Typography, Box, Stack, List, ListItem, ListItemText } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme, alpha } from '@mui/material/styles';
import { formatCurrency } from '../../utils/formatters';
import { Circle } from '@mui/icons-material';

const CategoryPieChart = ({ data }) => {
    const theme = useTheme();

    const COLORS = [
        theme.palette.primary.main,
        theme.palette.secondary.main,
        theme.palette.success.main,
        theme.palette.warning.main,
        theme.palette.error.main,
        theme.palette.info.main,
        '#FF6384',
        '#36A2EB'
    ];

    const pieData = data.map((item, index) => ({
        name: item.categoria,
        value: item.total,
        color: COLORS[index % COLORS.length]
    }));

    const total = pieData.reduce((sum, item) => sum + item.value, 0);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const percent = ((payload[0].value / total) * 100).toFixed(1);
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
                    <Typography variant="body2" fontWeight={600}>
                        {payload[0].name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {formatCurrency(payload[0].value)} ({percent}%)
                    </Typography>
                </Box>
            );
        }
        return null;
    };

    return (
        <Card elevation={0} sx={{ border: `1px solid ${theme.palette.divider}`, height: '100%' }}>
            <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                    Gastos por Categoría
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                    Distribución de gastos
                </Typography>

                {pieData.length > 0 ? (
                    <>
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        <List dense sx={{ mt: 2 }}>
                            {pieData.slice(0, 5).map((item, index) => {
                                const percent = ((item.value / total) * 100).toFixed(1);
                                return (
                                    <ListItem
                                        key={index}
                                        sx={{
                                            px: 0,
                                            py: 0.5
                                        }}
                                    >
                                        <Circle sx={{ fontSize: 12, mr: 1, color: item.color }} />
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                                        {item.name}
                                                    </Typography>
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {percent}%
                                                    </Typography>
                                                </Stack>
                                            }
                                            secondary={formatCurrency(item.value)}
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            No hay datos de gastos
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default CategoryPieChart;