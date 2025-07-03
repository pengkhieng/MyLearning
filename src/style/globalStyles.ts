import { StyleSheet, Platform } from 'react-native';

export const globalStyles = StyleSheet.create({

    paddingStatusBar: {
        marginTop: Platform.OS === 'android' ? 40 : 0,
        paddingHorizontal: 16,
        paddingBottom: 0,
        marginBottom: 0
    },
    paddingBody: {
        paddingHorizontal: 16,
        paddingBottom: 0,
        marginBottom: 0
    },
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'white'
    },
    bodyContain: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 50,
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

    // BUTTON
    button: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 20,
        alignSelf: 'center',
    },
    buttonGradient: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'System',
        paddingVertical: 16,
    },

});