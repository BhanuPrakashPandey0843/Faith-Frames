import { Dimensions } from 'react-native';

//Screen Constants
const SCREEN_WIDTH = 375;

const { width, height } = Dimensions.get('window');

/**
 * Function to scale a value based on the size of the screen size and the original
 * size used on the design.
 **/

export default function (units = 1) {
  return (width / SCREEN_WIDTH) * units;
}

const fontSize = (units = 1) => (width / SCREEN_WIDTH) * units;

const HP = (percent = 0) => {
  return Math.round(height * (percent / 100));
};

const WP = (percent = 0) => {
  return Math.round(width * (percent / 100));
};

export const WINDOW = { width, height };
export const ScreenWidth = width;
export const ScreenHeight = height;

export { fontSize, HP, WP };
