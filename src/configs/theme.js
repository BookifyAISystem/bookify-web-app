import { createTheme } from '@ant-design/react';

const theme = createTheme({
    token: {
        colorPrimary: '#9c7034',
        colorPrimaryHover: '#b08c5a',
        colorPrimaryActive: '#7d5a2a',
        colorPrimaryText: '#ffffff',
        colorPrimaryTextHover: '#fefbf4',
        colorPrimaryTextActive: '#ede0cc',
    },
    fontFamily: {
        heading: "'Merriweather', serif",
        body: "'Merriweather', serif",
    },
    size: {
        navbarHeight: '180px',
    },
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
});

export default theme;