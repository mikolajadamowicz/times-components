import { StyleSheet } from "react-native";
import { spacing } from "@times-components/styleguide";
import nativeStyles from "./native";

const androidStyles = {
  ...nativeStyles,
  articleHeadline: {
    ...nativeStyles.articleHeadline,
    marginBottom: spacing(3)
  },
  metaTablet: {
    ...nativeStyles.metaTablet,
    paddingTop: "auto"
  },
  standFirst: {
    ...nativeStyles.standFirst,
    marginBottom: spacing(2.5)
  }
};

const styles = StyleSheet.create({
  ...androidStyles
});

export default styles;
