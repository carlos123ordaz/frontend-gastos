import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Menu,
    MenuItem,
    Avatar,
    Stack,
    Divider,
    ListItemIcon,
    ListItemText,
    alpha,
    useTheme
} from '@mui/material';
import {
    Menu as MenuIcon,
    Brightness4,
    Brightness7,
    AccountCircle,
    Logout,
    Settings as SettingsIcon,
    Person
} from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { useTheme as useCustomTheme } from '../../hooks/useTheme';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMenuClick }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { user, logout, isAdmin } = useAuth();
    const { mode, toggleTheme } = useCustomTheme();
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        logout();
    };

    const handleSettings = () => {
        handleClose();
        navigate('/settings');
    };

    return (
        <AppBar
            position="fixed"
            elevation={0}
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                bgcolor: 'background.paper',
                borderBottom: `1px solid ${theme.palette.divider}`,
                backdropFilter: 'blur(8px)',
                backgroundColor: alpha(theme.palette.background.paper, 0.8)
            }}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={onMenuClick}
                    sx={{
                        mr: 2,
                        display: { md: 'none' },
                        color: 'text.primary'
                    }}
                >
                    <MenuIcon />
                </IconButton>

                <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
                    <Box
                        sx={{
                            width: 36,
                            height: 36,
                            borderRadius: 2,
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <Typography variant="h6" fontWeight={700} color="primary.main">
                            $
                        </Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: { xs: 'none', sm: 'block' } }}>
                            FinanzApp
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: { xs: 'none', md: 'block' }, lineHeight: 1 }}>
                            Control de Finanzas
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center">
                    <IconButton
                        onClick={toggleTheme}
                        sx={{
                            color: 'text.primary',
                            bgcolor: alpha(theme.palette.primary.main, 0.1),
                            '&:hover': {
                                bgcolor: alpha(theme.palette.primary.main, 0.2)
                            }
                        }}
                    >
                        {mode === 'dark' ? <Brightness7 fontSize="small" /> : <Brightness4 fontSize="small" />}
                    </IconButton>

                    <IconButton
                        onClick={handleMenu}
                        sx={{ p: 0.5 }}
                    >
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: 'primary.main',
                                fontSize: '0.9rem',
                                fontWeight: 600
                            }}
                        >
                            {user?.nombre?.charAt(0).toUpperCase()}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        PaperProps={{
                            sx: {
                                mt: 1.5,
                                minWidth: 220,
                                borderRadius: 2,
                                boxShadow: theme.shadows[8]
                            }
                        }}
                    >
                        <Box sx={{ px: 2, py: 1.5 }}>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {user?.nombre}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                            <Box sx={{ mt: 0.5 }}>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        px: 1,
                                        py: 0.5,
                                        borderRadius: 1,
                                        bgcolor: user?.role === 'admin' ? alpha(theme.palette.primary.main, 0.1) : alpha(theme.palette.grey[500], 0.1),
                                        color: user?.role === 'admin' ? 'primary.main' : 'text.secondary',
                                        fontWeight: 600,
                                        fontSize: '0.65rem'
                                    }}
                                >
                                    {user?.role === 'admin' ? 'ADMINISTRADOR' : 'USUARIO'}
                                </Typography>
                            </Box>
                        </Box>

                        <Divider />

                        {isAdmin() && (
                            <MenuItem onClick={handleSettings}>
                                <ListItemIcon>
                                    <SettingsIcon fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Configuración</ListItemText>
                            </MenuItem>
                        )}

                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon>
                                <Logout fontSize="small" />
                            </ListItemIcon>
                            <ListItemText>Cerrar Sesión</ListItemText>
                        </MenuItem>
                    </Menu>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;