import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  View,
  StyleSheet,
  Platform,
} from 'react-native';
import { colors } from '../theme/colors';
import { commonStyles } from '../utils/commonStyles';
import Icon from '../../components/Icon';
import { fontSize, WP } from '../theme/scale';

const ProgressOpacity = ({
  onPress,
  onLongPress,
  title,
  style,
  disabled = false,
  loading = false,
  txtStyle,
  icon,
  iconSize = fontSize(24),
  iconVariant = 'outline',
  loaderColor = colors.white,
  textColor = colors.white,   // ✅ new
  variant = 'medium',         // ✅ size control: small, medium, large
}) => {
  const sizeStyles = {
    small: { paddingVertical: WP(2), paddingHorizontal: WP(4), borderRadius: WP(2) },
    medium: { paddingVertical: WP(3), paddingHorizontal: WP(5), borderRadius: WP(3) },
    large: { paddingVertical: WP(4), paddingHorizontal: WP(6), borderRadius: WP(4) },
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        sizeStyles[variant],
        style,
        (disabled || loading) && commonStyles.disabledBtn,
      ]}
      onPress={!loading ? onPress : null}
      onLongPress={!loading ? onLongPress : null}
      disabled={disabled || loading}
      activeOpacity={0.7}
      android_ripple={{ color: colors.ripple, borderless: false }} // ✅ better Android feedback
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {loading ? (
        <ActivityIndicator size="small" color={loaderColor} />
      ) : (
        <View style={styles.content}>
          {icon && (
            <>
              <Icon
                name={icon}
                size={iconSize}
                color={textColor} // ✅ match text color
                variant={iconVariant}
              />
              <View style={{ width: WP(2) }} />
            </>
          )}
          <Text style={[commonStyles.btnTxt, { color: textColor }, txtStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ProgressOpacity;
