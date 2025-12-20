import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Pressable,
  Keyboard,
  Text, // Added import
} from 'react-native';
import Icon from './Icon';
import { fontSize, HP, WP } from '../app/theme/scale';
import { colors } from '../app/theme/colors';

const CustomInputField = ({
  label,
  placeholder,
  maxLength,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  error,
  radius,
  bgColor,
  multiline = false,
  style,
  indicatorText,
  isMandatory = false,
  onBlur,
  isEditable = true,
  onEditPress,
  enableEdit = false,
  showLength = false,
  borderColor,
  leftIcon,
  rightIcon,
  autoCapitalize = 'none',
}) => {
  const styles = createStyles({
    error,
    isEditable,
    radius,
    bgColor,
    borderColor,
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleEditPress = () => {
    onEditPress && onEditPress();
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <View style={[styles.container, style]}>
      {label && (
        <View style={styles.flex}>
          <Text style={styles.label}>
            {label}
            {isMandatory && <Text style={styles.mandatory}> *</Text>}
          </Text>
          {showLength && (
            <Text style={styles.counterTxt}>
              {value?.length ?? 0}/{maxLength}
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.inputContainer,
          multiline && { height: 'auto' },
          isFocused && { borderColor: colors.secondary },
        ]}
      >
        {leftIcon && (
          <Icon name={leftIcon.name} color={colors.secondary} style={{ marginRight: WP(2) }} />
        )}
        <TextInput
          ref={inputRef}
          style={[styles.input, multiline && { height: HP(12) }]}
          placeholder={placeholder}
          maxLength={maxLength}
          editable={isEditable}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          placeholderTextColor={bgColor === '#1a1a1a' ? '#666' : (colors.textMuted || '#999')}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            setIsFocused(false);
            onBlur && onBlur();
          }}
        />
        {rightIcon && rightIcon}
        {secureTextEntry && !rightIcon && (
          <Pressable onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              color={colors.secondary}
            />
          </Pressable>
        )}
        {enableEdit && (
          <Pressable onPress={handleEditPress}>
            <Icon name="edit" type="Feather" size={20} color={colors.secondary} />
          </Pressable>
        )}
        {indicatorText && <Text style={styles.indicatorText}>{indicatorText}</Text>}
      </View>
    </View>
  );
};

export default CustomInputField;

const createStyles = ({ error, isEditable, radius, bgColor, borderColor }) =>
  StyleSheet.create({
    container: {
      marginBottom: HP(2),
    },
    flex: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: HP(1),
    },
    label: {
      color: colors.dark,
    },
    counterTxt: {
      color: colors.success,
    },
    inputContainer: {
      backgroundColor: bgColor ? bgColor : colors.white,
      borderColor: error
        ? colors.error
        : borderColor
          ? borderColor
          : colors.placeholder,
      borderWidth: 1,
      borderRadius: radius ? radius : 16,
      height: HP(6),
      paddingHorizontal: WP(4),
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      color: isEditable ? (bgColor === '#1a1a1a' ? '#fff' : colors.text) : colors.placeholder,
      fontSize: 16,
    },
    indicatorText: {
      color: colors.dark,
      marginLeft: WP(2),
    },
    mandatory: {
      color: colors.error,
    },
    menuContainer: {},
    menu: {
      width: WP(30),
      borderRadius: HP(2),
    },
    optionTxt: {
      marginLeft: WP(3),
      color: colors.success,
    },
    leftIcon: {
      marginRight: WP(2),
      width: WP(5),
      height: WP(5),
    },
  });
