import React, { useEffect, useState } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  Keyboard,
  Platform,
  StyleSheet,
  Text, // <-- add this
} from 'react-native';
import { fontSize, HP } from '../app/theme/scale';
import Icon from './Icon';
import { colors } from '../app/theme/colors';

const CustomBottomsheet = ({
  visible,
  onClose,
  children,
  title,
  showCloseBtn = true,
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS === 'ios') {
      const keyboardWillShowListener = Keyboard.addListener(
        'keyboardWillShow',
        e => {
          setKeyboardVisible(true);
          setKeyboardHeight(e.endCoordinates.height);
        },
      );
      const keyboardWillHideListener = Keyboard.addListener(
        'keyboardWillHide',
        () => {
          setKeyboardVisible(false);
          setKeyboardHeight(0);
        },
      );

      return () => {
        keyboardWillShowListener.remove();
        keyboardWillHideListener.remove();
      };
    }
  }, []);

  // Close icon component for the modal
  const CloseIcon = () => (
    <View style={styles.closeIconContainer}>
      <Icon name="XMarkIcon" color={colors.white} />
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        style={styles.modalOverlay}
        onStartShouldSetResponder={() => true}
        onResponderRelease={onClose}
      >
        <View
          style={[
            styles.bottomSheetContainer,
            Platform.OS === 'ios' &&
              keyboardVisible && {
                marginBottom: keyboardHeight + HP(2),
              },
          ]}
          onStartShouldSetResponder={e => true}
          onResponderRelease={e => e.stopPropagation()}
        >
          {showCloseBtn && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <CloseIcon />
            </TouchableOpacity>
          )}
          {title && <Text style={styles.title}>{title}</Text>}
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default CustomBottomsheet;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    backgroundColor: colors.transparentBlack,
  },
  // Container for modal content
  bottomSheetContainer: {
    backgroundColor: colors.white,
    borderRadius: HP(2),
    padding: HP(2),
    margin: HP(2.5),
  },
  // Positioning for close button
  closeButton: {
    position: 'absolute',
    right: 0,
    top: -50,
    zIndex: 1,
  },
  // Styling for close icon container
  closeIconContainer: {
    width: HP(4),
    height: HP(4),
    borderRadius: HP(2),
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Styling for modal title
  title: {
    color: colors.black,
    fontSize: fontSize(16),
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: HP(2),
  },
});
