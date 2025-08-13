import { StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { HP, WP, fontSize } from '../theme/scale';

export const commonStyles = StyleSheet.create({
  // *************BUTTON STYLES*************
  primaryBtn: {
    backgroundColor: colors.dark,
    paddingVertical: HP(2),
    alignItems: 'center',
    borderRadius: WP(4),
    borderWidth: 1,
    borderColor: colors.dark,
  },
  primaryBtnSmall: {
    backgroundColor: colors.dark,
    width: WP(35),
    paddingVertical: HP(2),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 999,
  },
  secondaryBtn: {
    paddingVertical: HP(2),
    alignItems: 'center',
    borderRadius: WP(4),
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.dark,
  },
  secondaryBtnSmall: {
    width: WP(35),
    paddingVertical: HP(1.5),
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 999,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.dark,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  btnTxt: {
    color: colors.white,
    fontSize: fontSize(16),
    fontWeight: '700',
  },
});
