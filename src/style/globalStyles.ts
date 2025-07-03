import { StyleSheet, Platform } from 'react-native';

export const globalStyles = StyleSheet.create({

    paddingStatusBar: {
        marginTop: Platform.OS === 'android' ? 40 : 0,
        paddingHorizontal: 16
    },
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        width: '100%',
    },
    inputContainer: {
        marginBottom: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 0,
        borderWidth: 2,
        borderColor: 'rgba(145, 99, 99, 0.25)', 
        paddingHorizontal: 16
    },
    input: {
        height: 60,
        fontSize: 17,
        color: '#000',
        fontWeight: "600",
        borderRadius: 12,
        fontFamily: 'System',
        letterSpacing: 1,
    },
    inputFocused: {
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 0,
        borderWidth: 2,
        borderColor: '#F97316',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingBottom: 20,
    },
});