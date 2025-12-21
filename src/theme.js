import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) => createTheme({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // Modo claro - Estilo Duralux
                primary: {
                    main: '#6366f1', // Indigo vibrante
                    light: '#818cf8',
                    dark: '#4f46e5',
                },
                secondary: {
                    main: '#ec4899', // Rosa/magenta
                    light: '#f472b6',
                    dark: '#db2777',
                },
                success: {
                    main: '#10b981', // Verde esmeralda
                    light: '#34d399',
                    dark: '#059669',
                },
                error: {
                    main: '#ef4444',
                    light: '#f87171',
                    dark: '#dc2626',
                },
                warning: {
                    main: '#f59e0b',
                    light: '#fbbf24',
                    dark: '#d97706',
                },
                info: {
                    main: '#3b82f6',
                    light: '#60a5fa',
                    dark: '#2563eb',
                },
                background: {
                    default: '#f8fafc',
                    paper: '#ffffff',
                },
                text: {
                    primary: '#1e293b',
                    secondary: '#64748b',
                },
            }
            : {
                // Modo oscuro - Estilo Duralux
                primary: {
                    main: '#818cf8',
                    light: '#a5b4fc',
                    dark: '#6366f1',
                },
                secondary: {
                    main: '#f472b6',
                    light: '#f9a8d4',
                    dark: '#ec4899',
                },
                success: {
                    main: '#34d399',
                    light: '#6ee7b7',
                    dark: '#10b981',
                },
                error: {
                    main: '#f87171',
                    light: '#fca5a5',
                    dark: '#ef4444',
                },
                warning: {
                    main: '#fbbf24',
                    light: '#fcd34d',
                    dark: '#f59e0b',
                },
                info: {
                    main: '#60a5fa',
                    light: '#93c5fd',
                    dark: '#3b82f6',
                },
                background: {
                    default: '#0f172a', // Azul oscuro profundo
                    paper: '#1e293b',
                },
                text: {
                    primary: '#f1f5f9',
                    secondary: '#cbd5e1',
                },
            }),
    },
    typography: {
        h1: {
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h4: {
            fontWeight: 600,
        },
        h5: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 600,
        },
        button: {
            fontWeight: 500,
            letterSpacing: '0.02em',
        },
    },
    shape: {
        borderRadius: 12, // Bordes más redondeados
    },
    shadows: [
        'none',
        '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    ],
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    fontWeight: 500,
                    borderRadius: '8px',
                    padding: '8px 16px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: mode === 'light'
                        ? '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)'
                        : '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.2)',
                    borderRadius: '12px',
                    border: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    boxShadow: mode === 'light'
                        ? '0 1px 3px 0 rgb(0 0 0 / 0.1)'
                        : '0 1px 3px 0 rgb(0 0 0 / 0.3)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 'none',
                    boxShadow: mode === 'light'
                        ? '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        : '0 4px 6px -1px rgb(0 0 0 / 0.3)',
                },
            },
        },
    },
});