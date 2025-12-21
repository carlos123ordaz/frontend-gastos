import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';
import {
    Dashboard,
    AttachMoney,
    People,
    Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const drawerWidth = 240;

const Sidebar = ({ mobileOpen, onDrawerToggle }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const navigate = useNavigate();
    const location = useLocation();
    const { isAdmin } = useAuth();

    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Transacciones', icon: <AttachMoney />, path: '/transactions' },
        ...(isAdmin() ? [
            { text: 'Usuarios', icon: <People />, path: '/users' },
            { text: 'Configuración', icon: <SettingsIcon />, path: '/settings' }
        ] : [])
    ];

    const handleNavigation = (path) => {
        navigate(path);
        if (isMobile) {
            onDrawerToggle();
        }
    };

    const drawer = (
        <Box>
            <Toolbar />
            <List>
                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton
                            selected={location.pathname === item.path}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
            {isMobile ? (
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={onDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
                    }}
                >
                    {drawer}
                </Drawer>
            ) : (
                <Drawer
                    variant="permanent"
                    sx={{
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth
                        }
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            )}
        </Box>
    );
};

export default Sidebar;