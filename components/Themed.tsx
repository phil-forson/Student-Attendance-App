/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import { Text as DefaultText, TextInput as DefaultTextInput, View as DefaultView, TouchableOpacity as DefaultTouchableOpacity } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];
export type TextInputProps = ThemeProps & DefaultTextInput['props']
export type TouchableOpacityProps = ThemeProps & DefaultTouchableOpacity['props']

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function TextInput(props: TextInputProps){
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text')
  const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background')
  const borderColor = useThemeColor({light: lightColor, dark: darkColor}, 'customBorderColor')

  return <DefaultTextInput style={[{ color, backgroundColor, borderColor }, style ]} {...otherProps} />

}

export function TouchableOpacity(props: TouchableOpacityProps){
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'inverseBackground')

  return <DefaultTouchableOpacity style={[{ backgroundColor }, style ]} {...otherProps} />

}

export function InvTouchableOpacity(props: TouchableOpacityProps){
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({light: lightColor, dark: darkColor}, 'background')

  return <DefaultTouchableOpacity style={[{ backgroundColor }, style ]} {...otherProps} />

}

