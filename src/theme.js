import { createTheme } from '@material-ui/core/styles';

export const createAppTheme = (mode = 'light') => {
const dark = mode === 'dark';
return createTheme({
    palette: {
        type: mode,
        primary: { main: dark ? '#aaa5ff' : '#5b5ce2', dark: '#4243ba', light: '#c4bfff', contrastText: dark ? '#181a31' : '#fff' },
        secondary: { main: dark ? '#72d6c3' : '#0f766e', dark: '#115e59', light: '#5eead4' },
        background: { default: dark ? '#10141f' : '#f5f7fb', paper: dark ? '#191f2e' : '#ffffff' },
        text: { primary: dark ? '#e9edf7' : '#172033', secondary: dark ? '#a3aec4' : '#65708a' },
        divider: dark ? '#303a50' : '#e7eaf1',
    },
    typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        h1: { fontWeight: 800, letterSpacing: '-0.045em' },
        h2: { fontWeight: 750, letterSpacing: '-0.035em' },
        h3: { fontWeight: 750, letterSpacing: '-0.025em' },
        h4: { fontWeight: 700, letterSpacing: '-0.02em' },
        button: { fontWeight: 700, letterSpacing: '0.01em' },
    },
    shape: { borderRadius: 14 },
    props: {
        MuiButton: { disableElevation: true },
        MuiTextField: { variant: 'outlined' },
    },
    overrides: {
        MuiButton: {
            root: { borderRadius: 10, textTransform: 'none', minHeight: 42, padding: '8px 18px' },
            containedPrimary: {
                background: dark ? 'linear-gradient(135deg, #aaa5ff, #c1baff)' : 'linear-gradient(135deg, #5b5ce2 0%, #696cf5 100%)',
                boxShadow: dark ? 'none' : '0 8px 20px rgba(91,92,226,.22)',
            },
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: 10,
                backgroundColor: dark ? '#151c2a' : '#fbfcfe',
                transition: 'box-shadow .2s ease, background-color .2s ease',
                '&$focused': { backgroundColor: dark ? '#1d2536' : '#fff', boxShadow: '0 0 0 4px rgba(91,92,226,.1)' },
            },
        },
        MuiPaper: { rounded: { borderRadius: 16 } },
        MuiDialog: { paper: { borderRadius: 20 } },
        MuiTableCell: { root: { borderBottom: `1px solid ${dark ? '#303a50' : '#edf0f6'}` } },
    },
});
};

export default createAppTheme();
