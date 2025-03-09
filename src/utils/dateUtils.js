import { format, parseISO } from 'date-fns';

/**
 * Formats an ISO date string to 'dd/MM/yyyy'.
 * @param {string} isoDate - The ISO date string to format.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (isoDate) => {
    const date = parseISO(isoDate);
    return format(date, 'dd/MM/yyyy HH:mm:ss' );
};
