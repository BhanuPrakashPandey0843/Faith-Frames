import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableOpacity,
  Image,
  ImageBackground,
} from 'react-native';
import TopBar from '../../components/TopBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fontSize, HP, WP } from '../theme/scale';
import CustomInputField from '../../components/CustomInputField';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { commonStyles } from '../utils/commonStyles';
import SnackbarUtils from '../utils/SnackbarUtils';
import ProgressOpacity from '../quiz/ProgressOpacity';
import user from '../data/user';
import { colors } from '../theme/colors';
import Icon from '../../components/Icon';

export default function EditProfileScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    image: user?.image || '',
    address: user?.address || '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOnChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value,
    });
    setErrors({
      ...errors,
      [key]: null,
    });
  };

  const validateForm = formData => {
    let errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10,}$/;

    if (!formData.name) {
      errors.name = 'Name is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Enter a valid email';
    }

    return errors;
  };

  const handleSubmit = async () => {
    SnackbarUtils.showInfo('Profile updated successfully');
    navigation.goBack();
  };

  const handleImageEdit = () => {
    // Add image picker logic here
    SnackbarUtils.showInfo('Image picker functionality to be implemented');
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      extraScrollHeight={20}
      enableOnAndroid={true}
      scrollEnabled={true}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={{
          uri: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <TopBar title="Edit Profile" />
        {/* Login Form */}
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Animated.View
              entering={FadeInDown.delay(100).duration(700).springify()}
              style={styles.imageContainer}
            >
              <TouchableOpacity
                style={styles.imageWrapper}
                onPress={handleImageEdit}
                activeOpacity={0.8}
              >
                <Image
                  source={{ uri: formData.image }}
                  style={styles.userImage}
                />
                <View style={styles.editIconContainer}>
                  <Icon
                    name="PencilIcon"
                    size={fontSize(16)}
                    color={colors.white}
                  />
                </View>
              </TouchableOpacity>
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(200).duration(700).springify()}
            >
              <CustomInputField
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                error={errors.name}
                onChangeText={text => handleOnChange('name', text)}
                isMandatory
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(300).duration(700).springify()}
            >
              <CustomInputField
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                error={errors.email}
                onChangeText={text => handleOnChange('email', text)}
                keyboardType="email-address"
                isMandatory
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(500).duration(700).springify()}
            >
              <CustomInputField
                label="Address"
                placeholder="Enter your address"
                value={formData.address}
                error={errors.address}
                onChangeText={text => handleOnChange('address', text)}
                multiline
              />
            </Animated.View>
            <Animated.View
              entering={FadeInDown.delay(700).duration(700).springify()}
            >
              <ProgressOpacity
                title="Submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                onPress={handleSubmit}
                style={commonStyles.primaryBtnSmall}
              />
            </Animated.View>
          </View>
        </View>
      </ImageBackground>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: WP(10),
    borderTopRightRadius: WP(10),
    marginTop: HP(12),
  },
  innerContainer: {
    marginHorizontal: WP(5),
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: HP(3),
    marginTop: HP(-6),
  },
  imageWrapper: {
    position: 'relative',
  },
  userImage: {
    width: WP(25),
    height: WP(25),
    borderRadius: WP(12.5),
    backgroundColor: colors.lightGray,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.dark,
    borderRadius: WP(4),
    width: WP(8),
    height: WP(8),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.white,
  },
});
