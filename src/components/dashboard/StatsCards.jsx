import React from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  alpha,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Savings
} from '@mui/icons-material';
import { formatCurrency } from '../../utils/formatters';
import { useNavigate } from 'react-router-dom';

const StatsCards = ({ data }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const statsData = [
    {
      title: 'Balance Total',
      value: data?.balance || 0,
      subtitle: `Monto inicial: ${formatCurrency(data?.montoInicial || 0)}`,
      icon: Wallet,
      color: data?.balance >= 0 ? theme.palette.success.main : theme.palette.error.main,
      bgColor: alpha(data?.balance >= 0 ? theme.palette.success.main : theme.palette.error.main, 0.1)
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
      icon: Savings,
      color: theme.palette.primary.main,
      bgColor: alpha(theme.palette.primary.main, 0.1)
    }
  ];

  return (
    <Grid container spacing={{ xs: 2, sm: 2.5, md: 3 }}>
      {statsData.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Grid
            onClick={() => {
              if (stat.title === 'Total Gastos') {
                navigate('/transactions')
              }
            }}
            size={{ xs: 6, sm: 6, md: 6, lg: 3 }} key={index}>
            <Card

              elevation={0}
              sx={{
                bgcolor: 'background.paper',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: { xs: 2, sm: 2.5, md: 3 },
                transition: 'all 0.3s',
                height: '100%',
              }}
            >
              <CardContent
                sx={{
                  p: { xs: 1.5, sm: 2, md: 2.5 },
                  '&:last-child': {
                    pb: { xs: 1.5, sm: 2, md: 2.5 }
                  }
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                  spacing={{ xs: 1, sm: 1.5 }}
                >
                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                      sx={{
                        fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.875rem' },
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color={stat.color}
                      sx={{
                        mb: 0.5,
                        fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' },
                        fontVariantNumeric: 'tabular-nums',
                        wordBreak: 'break-all'
                      }}
                    >
                      {formatCurrency(stat.value)}
                    </Typography>
                    {stat.subtitle && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                          display: { xs: 'none', sm: 'block' }
                        }}
                      >
                        {stat.subtitle}
                      </Typography>
                    )}
                    {(stat.isIncome || stat.isExpense) && (
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={0.5}
                        mt={{ xs: 0.5, sm: 1 }}
                        sx={{ display: { xs: 'none', sm: 'flex' } }}
                      >
                        <Icon sx={{ fontSize: { xs: 14, sm: 16 }, color: stat.color }} />
                        <Typography
                          variant="caption"
                          color={stat.color}
                          sx={{
                            fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                            fontWeight: 600
                          }}
                        >
                          {stat.isIncome ? 'Ingresos' : 'Gastos'}
                        </Typography>
                      </Stack>
                    )}
                  </Box>
                  <Box
                    sx={{
                      width: { xs: 36, sm: 44, md: 48 },
                      height: { xs: 36, sm: 44, md: 48 },
                      borderRadius: { xs: 1.5, sm: 2 },
                      bgcolor: stat.bgColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <Icon sx={{
                      color: stat.color,
                      fontSize: { xs: 20, sm: 22, md: 24 }
                    }} />
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