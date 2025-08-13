import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { fontSize, HP, WP } from '../app/theme/scale';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../app/theme/colors';
import Animated, { FadeInUp, RollInLeft } from 'react-native-reanimated';

const TopBar = ({ title, rightView }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <Animated.View entering={RollInLeft.delay(100).duration(700).springify()}>
        <TouchableOpacity
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <ChevronLeftIcon
            color={colors.white}
            size={fontSize(20)}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </Animated.View>
      <Animated.Text
        entering={FadeInUp.delay(100).duration(700).springify()}
        style={styles.titleTxt}
      >
        {title}
      </Animated.Text>
      {rightView || <View style={styles.emptyView} />}
    </View>
  );
};

export default TopBar;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: HP(2),
    paddingHorizontal: WP(5),
  },
  backBtn: {
    backgroundColor: colors.dark,
    padding: WP(2),
    borderRadius: 99,
  },
  titleTxt: {
    fontSize: fontSize(20),
    color: colors.black,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  emptyView: {
    width: WP(10),
  },
});
