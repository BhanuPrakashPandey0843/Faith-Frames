import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { colors } from '../theme/colors';
import { commonStyles } from '../utils/commonStyles';
import Icon from '../../components/Icon';
import { fontSize, WP } from '../theme/scale';

const ProgressOpacity = ({
  onPress,
  onLongPress,
  title,
  style,
  disabled,
  loading,
  txtStyle,
  icon,
  iconSize = fontSize(24),
  iconVariant = 'outline',
}) => {
  return (
    <TouchableOpacity
      style={[style, loading ? commonStyles.disabledBtn : null]}
      onPress={onPress}
      onLongPress={onLongPress}
      disabled={disabled}
    >
      {loading ? (
        <ActivityIndicator size="small" color={colors.white} />
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon && (
            <>
              <Icon
                name={icon}
                size={iconSize}
                color={colors.background}
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

export default ProgressOpacity;
