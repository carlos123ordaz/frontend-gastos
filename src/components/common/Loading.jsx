import React from 'react';
import { Box, CircularProgress, Typography, Stack } from '@mui/material';

const Loading = ({ message = 'Cargando...' }) => {
    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="400px"
        >
            <Stack spacing={2} alignItems="center">
                <CircularProgress size={48} thickness={4} />
                <Typography variant="body2" color="text.secondary">
                    {message}
                </Typography>
            </Stack>
        </Box>
    );
};

export default Loading;