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
    primary:    '#6200EE',
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

