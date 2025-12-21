import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            <Navbar onMenuClick={handleDrawerToggle} />
            <Sidebar mobileOpen={mobileOpen} onDrawerToggle={handleDrawerToggle} />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - 260px)` },
                    bgcolor: 'background.default',
                    minHeight: '100vh'
                }}
            >
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;