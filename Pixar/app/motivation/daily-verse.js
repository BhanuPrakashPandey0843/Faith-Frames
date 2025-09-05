// app/motivation/daily-verse.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Share,
  ImageBackground,
  Platform, // ✅ Added
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";

import TopBar from "../../components/TopBar";

const VERSE_TASK = "DAILY_VERSE_TASK";

const verses = [
  "The Lord is my shepherd; I shall not want. – Psalm 23:1",
  "I can do all things through Christ who strengthens me. – Philippians 4:13",
  "Be still, and know that I am God. – Psalm 46:10",
  "The Lord is my light and my salvation—whom shall I fear? – Psalm 27:1",
  "Cast all your anxiety on him because he cares for you. – 1 Peter 5:7",
];

// ✅ Import local background image (same folder)
const backgroundImage = require("./dailyversebg.jpg");

TaskManager.defineTask(VERSE_TASK, async () => {
  try {
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];
    await AsyncStorage.setItem("dailyVerse", randomVerse);

    // ✅ Only run on iOS/Android
    if (Platform.OS !== "web") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "📖 Daily Verse",
          body: randomVerse,
        },
        trigger: null,
      });
    }

    return BackgroundFetch.Result.NewData;
  } catch (error) {
    return BackgroundFetch.Result.Failed;
  }
});

export default function DailyVerse() {
  const [verse, setVerse] = useState("");

  useEffect(() => {
    (async () => {
      const storedVerse = await AsyncStorage.getItem("dailyVerse");
      if (storedVerse) setVerse(storedVerse);
      else {
        const randomVerse = verses[Math.floor(Math.random() * verses.length)];
        setVerse(randomVerse);
        await AsyncStorage.setItem("dailyVerse", randomVerse);
      }

      // ✅ Only request permissions + schedule notifications on mobile
      if (Platform.OS !== "web") {
        const { status } = await Notifications.requestPermissionsAsync();
        if (status !== "granted") {
          alert("Enable notifications to get daily verses!");
        }

        await Notifications.cancelAllScheduledNotificationsAsync();
        await Notifications.scheduleNotificationAsync({
          content: {
            title: " Daily Verse",
            body: verses[Math.floor(Math.random() * verses.length)],
          },
          trigger: { hour: 0, minute: 0, repeats: true },
        });

        await BackgroundFetch.registerTaskAsync(VERSE_TASK, {
          minimumInterval: 60 * 60 * 24,
          stopOnTerminate: false,
          startOnBoot: true,
        });
      }
    })();
  }, []);

  const handleShare = async () => {
    try {
      await Share.share({
        message: verse,
      });
    } catch (error) {
      alert("Error sharing verse");
    }
  };

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TopBar title="Daily Verse" titleColor="white" />

        <View style={styles.card}>
          <Text style={styles.verseText}>{verse}</Text>

          <View style={styles.actions}>
            <TouchableOpacity>
              <Ionicons name="heart-outline" size={28} color="red" />
            </TouchableOpacity>

            <TouchableOpacity onPress={handleShare}>
              <Ionicons name="share-social-outline" size={28} color="blue" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)", // ✅ dim effect for readability
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 50,
    elevation: 5,
  },
  verseText: {
    fontSize: 18,
    fontStyle: "italic",
    textAlign: "center",
    marginBottom: 20,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "60%",
  },
});
