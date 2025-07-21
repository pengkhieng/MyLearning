export const colors = {
    gradientBackground: { 
        start:  'rgba(253, 186, 116, 0.3)', 
        mid:    'rgba(249, 115, 22, 0.3)', 
        end:    'rgba(234, 88, 12, 0.3)' 
    },
    button: {
        start:          '#F97316',
        end:            '#EA580C',
        disabledStart:  'rgba(156, 163, 175, 0.4)',
        disabledEnd:    'rgba(107, 114, 128, 0.4)',
    },
    buttonRed: {
        start:         '#FB5012',
        end:           '#DC2626',
        disabledStart: 'rgba(156, 163, 175, 0.4)',
        disabledEnd:   'rgba(107, 114, 128, 0.4)',
    },
    dashboard: { 
        0:    'rgba(255, 181, 164, 0.29)',  
        1:    'rgba(164, 197, 255, 0.29)', 
        2:    'rgba(164, 255, 237, 0.29)', 
        3:    'rgba(255, 164, 191, 0.29)', 
        4:    'rgba(164, 244, 255, 0.29)', 
        5:    'rgba(165, 255, 164, 0.29)', 
        6:    'rgba(164, 181, 255, 0.29)', 
        7:    'rgba(255, 181, 164, 0.29)', 
        8:    'rgba(255, 244, 164, 0.29)', 
    },
    primary:    '#FB5012',
    secondary:  '#6B7280',
    title:      '#FFFFFF',
    text:       '#FFFFFF',

    placeholderTxt:     'gray', 
    orangeWithOpacity:  'rgba(249, 116, 22, 0.79)',
    customBlue:         '#13B0E5',
    customGreen:        '#21C997',
    customDarkBlue:     '#006BA5',

} as const;

export type Colors = typeof colors;

