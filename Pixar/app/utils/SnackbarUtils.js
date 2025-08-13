// utils/SnackbarUtils.js
import { Platform } from "react-native";
import { colors } from "../theme/colors";

class SnackbarUtils {
  getSnackbar() {
    // Only require when in native runtime
    if (Platform.OS === "web") return null;
    try {
      return require("react-native-snackbar");
    } catch {
      return null;
    }
  }

  showError(text) {
    const Snackbar = this.getSnackbar();
    if (!Snackbar?.show) return;
    Snackbar.show({
      textColor: colors.white,
      backgroundColor: colors.error,
      text: text || "An error occurred",
      duration: Snackbar.LENGTH_SHORT ?? 1500,
    });
  }

  showInfo(text) {
    const Snackbar = this.getSnackbar();
    if (!Snackbar?.show) return;
    Snackbar.show({
      textColor: colors.white,
      backgroundColor: colors.success,
      text: text || "Info message",
      duration: Snackbar.LENGTH_SHORT ?? 1500,
    });
  }

  showLong(text) {
    const Snackbar = this.getSnackbar();
    if (!Snackbar?.show) return;
    Snackbar.show({
      textColor: colors.white,
      backgroundColor: colors.success,
      text: text || "Long info",
      duration: Snackbar.LENGTH_LONG ?? 3000,
    });
  }
}

export default new SnackbarUtils();
