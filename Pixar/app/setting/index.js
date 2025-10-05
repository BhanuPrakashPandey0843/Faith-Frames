import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import Icon from "../../components/Icon";
import { fontSize, HP, WP } from "../theme/scale";
import { auth, db } from "../../config/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { onAuthStateChanged } from "firebase/auth";

const theme = {
  colors: {
    white: "#fff",
    black: "#000",
    primary: "#FFD700", // gold
    accent: "#00FF87", // subtle neon accent
    glass: "rgba(255,255,255,0.06)",
    placeholder: "rgba(255,255,255,0.6)",
  },
};

const SettingScreen = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // ✅ Listen for auth state
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const unsubDoc = onSnapshot(doc(db, "users", firebaseUser.uid), (snap) => {
          if (snap.exists()) {
            setUser(snap.data());
          } else {
            setUser({
              name: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
            });
          }
        });
        return () => unsubDoc();
      } else {
        setUser(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const menuItems = [
    {
      section: "main",
      items: [
        { id: 1, title: "Favourites", icon: "HeartIcon", onPress: () => router.push("/favourite") },
        { id: 2, title: "Downloads", icon: "ArrowDownTrayIcon", onPress: () => console.log("Downloads pressed") },
      ],
    },
    {
      section: "settings",
      items: [
        { id: 5, title: "Terms & Conditions", icon: "DocumentTextIcon", onPress: () => router.push("/legal/terms-and-conditions") },
        { id: 6, title: "Privacy Policy", icon: "ShieldCheckIcon", onPress: () => router.push("/legal/privacy-policy") },
      ],
    },
    {
      section: "actions",
      items: [
        { id: 7, title: "Contact Us", icon: "ChatBubbleBottomCenterTextIcon", onPress: () => router.push("/contact-us") },
        { id: 8, title: "Rate & Share App", icon: "StarIcon", onPress: () => router.push("/rate-app") },
        {
          id: 9,
          title: "Logout",
          icon: "ArrowRightOnRectangleIcon",
          onPress: async () => {
            await AsyncStorage.removeItem("authToken");
            router.replace("/auth/login");
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
      activeOpacity={0.7}
    >
      <View style={styles.menuItemLeft}>
        <LinearGradient
          colors={[theme.colors.primary, "#FFA500"]}
          style={styles.iconWrapper}
        >
          <Icon name={item.icon} size={fontSize(18)} color={theme.colors.black} />
        </LinearGradient>
        <Text style={styles.menuItemText}>{item.title}</Text>
      </View>
      <Icon name="ChevronRightIcon" size={fontSize(16)} color={theme.colors.placeholder} />
    </TouchableOpacity>
  );

  return (
    <LinearGradient colors={["#101010", "#000"]} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* ✅ Page Title */}
          <Text style={styles.pageTitle}>My Profile</Text>

          <View style={styles.innerContainer}>
            {/* ✅ Profile Section */}
            <LinearGradient
              colors={["rgba(255,215,0,0.15)", "rgba(255,255,255,0.02)"]}
              style={styles.profileSection}
            >
              <View style={styles.profileInfo}>
                <Image
                  source={{ uri: user?.photoURL || "https://placehold.co/200x200?text=Avatar" }}
                  style={styles.profileImage}
                />
                <View style={styles.profileText}>
                  <Text style={styles.profileName}>{user?.name || "Guest"}</Text>
                  <Text style={styles.profileEmail}>{user?.email || "guest@email.com"}</Text>
                </View>
              </View>
              <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/profile")}>
                <LinearGradient
                  colors={[theme.colors.primary, theme.colors.accent]}
                  style={styles.editButton}
                >
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>

            {/* ✅ Menu Sections */}
            {menuItems.map((section, index) => (
              <View key={section.section} style={styles.menuSection}>
                {section.items.map(renderMenuItem)}
                {index < menuItems.length - 1 && <View style={styles.separator} />}
              </View>
            ))}

            {/* ✅ App Version */}
            <Text style={styles.appVersion}>App Version 1.0</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  innerContainer: { marginHorizontal: WP(5), marginTop: HP(1) },

  pageTitle: {
    fontSize: fontSize(24),
    fontWeight: "800",
    color: theme.colors.white,
    textAlign: "center",
    marginTop: HP(2),
    marginBottom: HP(3),
    letterSpacing: 0.5,
  },

  profileSection: {
    borderRadius: fontSize(18),
    padding: WP(5),
    marginBottom: HP(3),
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
    shadowColor: "#FFD700",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  profileInfo: { flexDirection: "row", alignItems: "center", marginBottom: HP(2) },
  profileImage: {
    width: WP(18),
    height: WP(18),
    borderRadius: WP(9),
    marginRight: WP(5),
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  profileText: { flex: 1 },
  profileName: { fontSize: fontSize(20), fontWeight: "700", color: theme.colors.white },
  profileEmail: { fontSize: fontSize(14), color: theme.colors.placeholder },

  editButton: {
    borderRadius: 30,
    paddingVertical: HP(1.2),
    paddingHorizontal: WP(8),
    alignSelf: "flex-start",
  },
  editButtonText: { color: theme.colors.black, fontSize: fontSize(14), fontWeight: "700" },

  menuSection: {
    backgroundColor: theme.colors.glass,
    borderRadius: fontSize(16),
    marginBottom: HP(2),
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: HP(2),
    paddingHorizontal: WP(5),
  },
  menuItemLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  iconWrapper: {
    width: WP(10),
    height: WP(10),
    borderRadius: WP(5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: WP(4),
  },
  menuItemText: { fontSize: fontSize(16), color: theme.colors.white, fontWeight: "500" },
  separator: { height: 1, backgroundColor: "rgba(255,255,255,0.2)", marginHorizontal: WP(5) },

  appVersion: {
    textAlign: "center",
    fontSize: fontSize(12),
    color: theme.colors.placeholder,
    marginVertical: HP(3),
  },
});

export default SettingScreen;
