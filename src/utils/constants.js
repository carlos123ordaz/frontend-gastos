export const TIPO_TRANSACCION = {
    INGRESO: 'ingreso',
    GASTO: 'gasto'
};

export const TIPO_GASTO = [
    { value: 'alimentacion', label: 'Alimentación', icon: 'fastfood' },
    { value: 'transporte', label: 'Transporte', icon: 'directions_car' },
    { value: 'servicios', label: 'Servicios', icon: 'receipt' },
    { value: 'salud', label: 'Salud', icon: 'local_hospital' },
    { value: 'educacion', label: 'Educación', icon: 'school' },
    { value: 'entretenimiento', label: 'Entretenimiento', icon: 'sports_esports' },
    { value: 'vivienda', label: 'Vivienda', icon: 'home' },
    { value: 'otros', label: 'Otros', icon: 'more_horiz' }
];

export const ROLES = {
    ADMIN: 'admin',
    USER: 'user'
};

export const COLORS = {
    ingreso: '#4caf50',
    gasto: '#f44336'
};