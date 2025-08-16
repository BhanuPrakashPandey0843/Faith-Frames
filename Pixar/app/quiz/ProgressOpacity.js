import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View, StyleSheet } from 'react-native';
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
  loaderColor = colors.white, // ✅ allow custom loader color
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        style,
        (disabled || loading) && commonStyles.disabledBtn, // ✅ auto-disable when loading
      ]}
      onPress={!loading ? onPress : null} // ✅ prevent press when loading
      onLongPress={!loading ? onLongPress : null}
      disabled={disabled || loading} // ✅ disable if loading
      activeOpacity={0.7}
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
                color={colors.white} // ✅ better contrast than background
                variant={iconVariant}
              />
              <View style={{ width: WP(2) }} />
            </>
          )}
          <Text style={[commonStyles.btnTxt, txtStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: WP(3),
    paddingHorizontal: WP(5),
    borderRadius: WP(3),
    backgroundColor: colors.primary, // ✅ default button bg
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
