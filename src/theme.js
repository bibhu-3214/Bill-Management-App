import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
    palette: {
        primary: { main: '#5b5ce2', dark: '#4243ba', light: '#818cf8' },
        secondary: { main: '#0f766e', dark: '#115e59', light: '#5eead4' },
        background: { default: '#f5f7fb', paper: '#ffffff' },
        text: { primary: '#172033', secondary: '#65708a' },
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
                background: 'linear-gradient(135deg, #5b5ce2 0%, #696cf5 100%)',
                boxShadow: '0 8px 20px rgba(91,92,226,.22)',
            },
        },
        MuiOutlinedInput: {
            root: {
                borderRadius: 10,
                backgroundColor: '#fbfcfe',
                transition: 'box-shadow .2s ease, background-color .2s ease',
                '&$focused': { backgroundColor: '#fff', boxShadow: '0 0 0 4px rgba(91,92,226,.1)' },
            },
        },
        MuiPaper: { rounded: { borderRadius: 16 } },
        MuiDialog: { paper: { borderRadius: 20 } },
        MuiTableCell: { root: { borderBottom: '1px solid #edf0f6' } },
    },
});

export default theme;
