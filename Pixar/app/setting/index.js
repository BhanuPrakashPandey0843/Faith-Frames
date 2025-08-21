import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Icon from "../../components/Icon";
import { colors } from "../theme/colors";
import { fontSize, HP, WP } from "../theme/scale";
import TopBar from "../../components/TopBar";
import { auth, db } from "../../config/firebase"; // ✅ import Firebase
import { doc, onSnapshot } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { Alert } from 'react-native';


const SettingScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // ✅ Subscribe to Firestore for live profile updates
  useEffect(() => {
    if (!auth.currentUser) return;
    const unsub = onSnapshot(doc(db, "users", auth.currentUser.uid), (snap) => {
      if (snap.exists()) {
        setUser(snap.data());
      } else {
        // fallback if Firestore doc missing
        setUser({
          name: auth.currentUser.displayName,
          email: auth.currentUser.email,
          photoURL: auth.currentUser.photoURL,
        });
      }
    });
    return unsub;
  }, []);

  const menuItems = [
    {
      section: "main",
      items: [
        {
          id: 1,
          title: "Favourites",
          icon: "HeartIcon",
          onPress: () => router.push("/favourite"),
        },
        {
          id: 2,
          title: "Downloads",
          icon: "ArrowDownTrayIcon",
          onPress: () => console.log("Downloads pressed"),
        },
      ],
    },
    {
      section: "settings",
      items: [
        {
          id: 5,
          title: "Terms & Conditions",
          icon: "PlayIcon",
          onPress: () => router.push("/legal/terms-and-conditions"),
        },
        {
          id: 6,
          title: "Privacy Policy",
          icon: "ComputerDesktopIcon",
          onPress: () => router.push("/legal/privacy-policy"),
        },
      ],
    },
    {
      section: "actions",
      items: [
        {
          id: 7,
          title: "Contact Us",
          icon: "TrashIcon",
          onPress: () => router.push("/contact-us"),
        },
        {
          id: 8,
          title: "Rate & Share App",
          icon: "ClockIcon",
          onPress: () => router.push("/rate-app"),
        },
       {
  id: 9,
  title: "Logout",
  icon: "ArrowRightOnRectangleIcon",
  onPress: async () => {
    try {
      // Clear stored user data (AsyncStorage or SecureStore)
      await AsyncStorage.removeItem("authToken");

      // Redirect to login screen
      router.replace("/auth/login"); 
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
},

      ],
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity
      key={item.id}
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <Icon name={item.icon} size={fontSize(20)} color={colors.dark} />
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Icon
        name="ChevronRightIcon"
        size={fontSize(16)}
        color={colors.placeholder}
      />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <TopBar
        title="My Profile"
        leftView={
          <TouchableOpacity onPress={() => router.push("/home")}>
            <Icon name="ChevronLeftIcon" color={colors.dark} size={fontSize(20)} />
          </TouchableOpacity>
        }
        rightView={
          <TouchableOpacity>
            <Icon name="Cog8ToothIcon" color={colors.dark} />
          </TouchableOpacity>
        }
      />

      <View style={styles.innerContainer}>
        {/* ✅ Profile Section (dynamic) */}
        <View style={styles.profileSection}>
          <View style={styles.profileInfo}>
            <Image
              source={{
                uri: user?.photoURL || "https://placehold.co/200x200?text=Avatar",
              }}
              style={styles.profileImage}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{user?.name || "Guest"}</Text>
              <Text style={styles.profileEmail}>{user?.email || "guest@email.com"}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => router.push("/profile")} // ✅ Navigate to EditProfileScreen
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Sections */}
        {menuItems.map((section, index) => (
          <View key={section.section} style={styles.menuSection}>
            {section.items.map(renderMenuItem)}
            {index < menuItems.length - 1 && <View style={styles.separator} />}
          </View>
        ))}

        {/* App Version */}
        <Text style={styles.appVersion}>App Version 1.0</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  innerContainer: { marginHorizontal: WP(5) },
  profileSection: {
    backgroundColor: colors.surface,
    borderRadius: fontSize(16),
    padding: WP(5),
    marginBottom: HP(2),
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  profileInfo: { flexDirection: "row", alignItems: "center", marginBottom: HP(2) },
  profileImage: {
    width: WP(12),
    height: WP(12),
    borderRadius: WP(6),
    marginRight: WP(4),
  },
  profileText: { flex: 1 },
  profileName: {
    fontSize: fontSize(18),
    fontWeight: "600",
    color: colors.dark,
    marginBottom: HP(0.5),
  },
  profileEmail: { fontSize: fontSize(14), color: colors.placeholder },
  editButton: {
    backgroundColor: colors.dark,
    paddingVertical: HP(1.5),
    paddingHorizontal: WP(6),
    borderRadius: fontSize(20),
    alignSelf: "flex-start",
  },
  editButtonText: { color: colors.white, fontSize: fontSize(14), fontWeight: "500" },
  menuSection: {
    backgroundColor: colors.surface,
    borderRadius: fontSize(16),
    marginBottom: HP(2),
    shadowColor: colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: HP(2),
    paddingHorizontal: WP(5),
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  menuItemText: {
    fontSize: fontSize(16),
    color: colors.dark,
    marginLeft: WP(4),
    fontWeight: "500",
  },
  separator: { height: 1, backgroundColor: colors.disabled, marginHorizontal: WP(5) },
  appVersion: {
    textAlign: "center",
    fontSize: fontSize(12),
    color: colors.placeholder,
    marginVertical: HP(3),
  },
});

export default SettingScreen;
