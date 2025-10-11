// app/profile/index.js (EditProfileScreen)
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Platform,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import Svg, { Path } from 'react-native-svg'; // ✅ Added import

import TopBar from '../../components/TopBar';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { fontSize, HP, WP } from '../theme/scale';
import CustomInputField from '../../components/CustomInputField';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { commonStyles } from '../utils/commonStyles';
import SnackbarUtils from '../utils/SnackbarUtils';
import ProgressOpacity from '../quiz/ProgressOpacity';
import { colors } from '../theme/colors';
import Icon from '../../components/Icon';

// ✅ Firebase
import { auth, db } from '../../config/firebase';
import {
  updateProfile,
  updateEmail,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export default function EditProfileScreen({ navigation }) {
  const router = useRouter();
  const currentUser = auth.currentUser;

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || '',
    email: currentUser?.email || '',
    image: currentUser?.photoURL || '',
    address: '',
    currentPassword: '',
    newPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

const FALLBACK_ROUTE = "/setting";

const safeBack = () => {
  try {
    if (router.canGoBack()) {
      router.back();
      return;
    }
  } catch (err) {
    console.warn("expo-router back failed:", err);
  }

  router.replace(FALLBACK_ROUTE);
};

  const handleOnChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: null }));
  };

  const validateForm = () => {
    let e = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name?.trim()) e.name = 'Name is required';
    if (!formData.email) e.email = 'Email is required';
    else if (!emailRegex.test(formData.email)) e.email = 'Enter a valid email';

    if (formData.newPassword && !formData.currentPassword) {
      e.currentPassword = 'Enter current password to set a new one';
    }
    if (formData.newPassword && formData.newPassword.length < 6) {
      e.newPassword = 'New password must be at least 6 characters';
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      SnackbarUtils.showError('Permission to access gallery is required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.length) return;

    const localUri = result.assets[0].uri;
    await uploadAvatar(localUri);
  };

  const uploadAvatar = async (localUri) => {
    if (!auth.currentUser) {
      SnackbarUtils.showError('You must be logged in to update your photo');
      return;
    }

    try {
      setIsUploadingImage(true);

      // Fix for web vs native
      let fileToUpload;
      if (Platform.OS === "web") {
        const response = await fetch(localUri);
        const blob = await response.blob();
        fileToUpload = blob;
      } else {
        fileToUpload = {
          uri: localUri,
          type: "image/jpeg",
          name: "profile.jpg",
        };
      }

      const formData = new FormData();
      formData.append("file", fileToUpload);
      formData.append("upload_preset", "FaithFrames"); // must match your Cloudinary preset
      formData.append("folder", "avatars"); // optional folder

      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dhliwva4d/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      if (!data.secure_url) {
        throw new Error(data.error?.message || "Cloudinary upload failed");
      }

      const downloadURL = data.secure_url;

      // ✅ Update Firebase Auth profile photoURL
      await updateProfile(auth.currentUser, { photoURL: downloadURL });

      // ✅ Save in Firestore
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        { photoURL: downloadURL, updatedAt: Date.now() },
        { merge: true }
      );

      setFormData((prev) => ({ ...prev, image: downloadURL }));
      SnackbarUtils.showInfo("Profile photo updated");
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      SnackbarUtils.showError(err?.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const maybeReauthenticate = async () => {
    if (!auth.currentUser) return;
    if (!formData.currentPassword) return;

    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      formData.currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      SnackbarUtils.showError('You must be logged in');
      return;
    }
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      try {
        if (formData.newPassword || formData.email !== auth.currentUser.email) {
          await maybeReauthenticate();
        }
      } catch {
        SnackbarUtils.showError(
          'Re-authentication failed. Please log out and log back in.'
        );
        setIsSubmitting(false);
        return;
      }

      if (formData.name !== auth.currentUser.displayName) {
        await updateProfile(auth.currentUser, { displayName: formData.name });
      }

      if (formData.email !== auth.currentUser.email) {
        await updateEmail(auth.currentUser, formData.email);
      }

      if (formData.newPassword) {
        await updatePassword(auth.currentUser, formData.newPassword);
      }

      await setDoc(
        doc(db, 'users', auth.currentUser.uid),
        {
          name: formData.name,
          email: formData.email,
          address: formData.address || '',
          photoURL: formData.image || '',
          updatedAt: Date.now(),
        },
        { merge: true }
      );

      SnackbarUtils.showInfo('Profile updated successfully');
      safeBack();
    } catch (err) {
      console.error('Profile update error:', err);
      const msg =
        err?.code === 'auth/requires-recent-login'
          ? 'Please log out and log in again, then retry this update.'
          : err?.message || 'Failed to update profile';
      SnackbarUtils.showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: colors.white }}
      extraScrollHeight={20}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground
        source={{
          uri: 'https://www.pixelstalk.net/wp-content/uploads/2016/05/Best-Black-Wallpapers.png',
        }}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
<TopBar title="Edit Profile" onBack={safeBack} />

        {/* Slanted White Background */}
        <Svg
          height={HP(9)}
          width="100%"
          viewBox={`0 0 100 ${HP(15)}`}
          preserveAspectRatio="none"
          style={{ position: "absolute", top: HP(60), left: 0 }}
        >
          <Path
            d={`M0,${HP(15)} L100,0 L100,${HP(15)} Z`}
            fill={colors.white}
          />
        </Svg>

        <View style={styles.container}>
          <View style={styles.innerContainer}>
            {/* Avatar */}
            <Animated.View
              entering={FadeInDown.delay(100).duration(700).springify()}
              style={styles.imageContainer}
            >
              <TouchableOpacity
                style={styles.imageWrapper}
                onPress={pickImage}
                activeOpacity={0.8}
                disabled={isUploadingImage}
              >
                <Image
                  source={
                    formData.image
                      ? { uri: formData.image }
                      : { uri: 'https://placehold.co/200x200?text=Avatar' }
                  }
                  style={styles.userImage}
                />
                {isUploadingImage && (
                  <View style={StyleSheet.absoluteFillObject}>
                    <ActivityIndicator size="large" color={colors.primary} />
                  </View>
                )}
                <View style={styles.editIconContainer}>
                  {isUploadingImage ? (
                    <Icon name="ArrowPathIcon" size={fontSize(16)} color={colors.white} />
                  ) : (
                    <Icon name="PencilIcon" size={fontSize(16)} color={colors.white} />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>

            {/* Inputs */}
            <Animated.View entering={FadeInDown.delay(200).duration(700).springify()}>
              <CustomInputField
                label="Name"
                placeholder="Enter your name"
                value={formData.name}
                error={errors.name}
                onChangeText={text => handleOnChange('name', text)}
                isMandatory
                editable={!isSubmitting}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(300).duration(700).springify()}>
              <CustomInputField
                label="Email"
                placeholder="Enter your email"
                value={formData.email}
                error={errors.email}
                onChangeText={text => handleOnChange('email', text)}
                keyboardType="email-address"
                isMandatory
                editable={!isSubmitting}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500).duration(700).springify()}>
              <CustomInputField
                label="Address"
                placeholder="Enter your address"
                value={formData.address}
                error={errors.address}
                onChangeText={text => handleOnChange('address', text)}
                multiline
                editable={!isSubmitting}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600).duration(700).springify()}>
              <CustomInputField
                label="Current Password"
                placeholder="Enter current password (required to change password)"
                value={formData.currentPassword}
                error={errors.currentPassword}
                onChangeText={text => handleOnChange('currentPassword', text)}
                secureTextEntry
                editable={!isSubmitting}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(650).duration(700).springify()}>
              <CustomInputField
                label="New Password"
                placeholder="Enter new password"
                value={formData.newPassword}
                error={errors.newPassword}
                onChangeText={text => handleOnChange('newPassword', text)}
                secureTextEntry
                editable={!isSubmitting}
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(700).duration(700).springify()}>
              <ProgressOpacity
                title={isSubmitting ? 'Saving...' : 'Submit'}
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
    marginTop: HP(60),
 
    paddingTop: HP(4),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  innerContainer: {
    marginHorizontal: WP(5),
    paddingBottom: HP(5),
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: HP(3),
    marginTop: HP(-15),
    zIndex: 10,
  },
  imageWrapper: {
    position: "relative",
  },
  userImage: {
    width: WP(28),
    height: WP(28),
    borderRadius: WP(14),
    backgroundColor: colors.lightGray || "#eee",
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  editIconContainer: {
    position: "absolute",
    bottom: WP(2),
    right: WP(2),
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: WP(5),
    width: WP(9),
    height: WP(9),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.white,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
});




