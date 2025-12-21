import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 2
    }).format(amount);
};

export const formatDate = (date) => {
    return format(new Date(date), 'dd/MM/yyyy', { locale: es });
};

export const formatDateTime = (date) => {
    return format(new Date(date), 'dd/MM/yyyy HH:mm', { locale: es });
};

export const formatDateForInput = (date) => {
    return format(new Date(date), 'yyyy-MM-dd');
};