import React from 'react';
import { Text, TouchableOpacity, StyleProp, ViewStyle, TextStyle } from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import { globalStyles } from '../style/globalStyles';
import { colors } from '../utils/colors';

interface CustomButtonProps {
  title?: string;
  onPress?: () => void;
  isDisabled?: boolean;
  buttonStyle?: StyleProp<ViewStyle>;
  gradientStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  animation?: Animatable.Animation;
  duration?: number;
  gradientColors?: string[];
  useGradient?: boolean; // New prop to toggle gradient
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title = 'Button',
  onPress,
  isDisabled = false,
  buttonStyle,
  gradientStyle,
  textStyle,
  containerStyle,
  animation = 'pulse',
  duration = 100,
  gradientColors,
  useGradient = true, // Default to gradient
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[globalStyles.buttonContainer, containerStyle]}
    >
      <Animatable.View
        animation={isDisabled ? undefined : animation}
        duration={duration}
        iterationCount={1}
        style={[globalStyles.button, buttonStyle]}
      >
        {useGradient ? (
          <LinearGradient
            colors={
              gradientColors
                ? gradientColors
                : isDisabled
                ? [colors.button.disabledStart, colors.button.disabledEnd]
                : [colors.button.start, colors.button.end]
            }
            style={[globalStyles.buttonGradient, gradientStyle]}
          >
            <Text style={[globalStyles.buttonText, textStyle]}>{title}</Text>
          </LinearGradient>
        ) : (
          <Text style={[globalStyles.buttonText, textStyle]}>{title}</Text>
        )}
      </Animatable.View>
    </TouchableOpacity>
  );
};

export default CustomButton;