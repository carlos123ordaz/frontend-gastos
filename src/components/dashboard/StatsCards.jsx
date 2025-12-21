import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  alpha,
  useTheme
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Savings
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';

const StatsCards = ({ data }) => {
  const theme = useTheme();

  const statsData = [
    {
      title: 'Balance Total',
      value: data?.balance || 0,
      subtitle: `Monto inicial: ${formatCurrency(data?.montoInicial || 0)}`,
      icon: Wallet,
      color: data?.balance >= 0 ? theme.palette.success.main : theme.palette.error.main,
      bgColor: alpha(theme.palette.info.main, 0.1)
    },
    {
      title: 'Total Ingresos',
      value: data?.totalIngresos || 0,
      icon: TrendingUp,
      color: theme.palette.success.main,
      bgColor: alpha(theme.palette.success.main, 0.1),
      isIncome: true
    },
    {
      title: 'Total Gastos',
      value: data?.totalGastos || 0,
      icon: TrendingDown,
      color: theme.palette.error.main,
      bgColor: alpha(theme.palette.error.main, 0.1),
      isExpense: true
    },
    {
      title: 'Ahorro del Mes',
      value: (data?.totalIngresos || 0) - (data?.totalGastos || 0),
      subtitle: `${((((data?.totalIngresos || 0) - (data?.totalGastos || 0)) / (data?.totalIngresos || 1)) * 100).toFixed(1)}% de ingresos`,
      icon: Savings,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1)
    }
  ];

  return (
    <Grid container spacing={3}>
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Grid size={{ xs: 6, sm: 6, lg: 3 }} key={index}>
            <Card
              elevation={0}
              sx={{
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s',
                '&:hover': {
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-4px)'
                }
              }}
            >
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h5"
                      fontWeight={700}
                      color={stat.color}
                      sx={{ mb: 0.5 }}
                    >
                      {formatCurrency(stat.value)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stat.subtitle}
                    </Typography>
                    {(stat.isIncome || stat.isExpense) && (
                      <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
                        <Icon sx={{ fontSize: 16, color: stat.color }} />
                        <Typography variant="caption" color={stat.color}>
                          {stat.isIncome ? 'Ingresos' : 'Gastos'}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon sx={{ color: stat.color, fontSize: 24 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

export default StatsCards;