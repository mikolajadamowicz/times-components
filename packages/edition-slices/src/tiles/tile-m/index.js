import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import {
  getTileStrapline,
  TileLink,
  TileSummary,
  withTileTracking
} from "../shared";
import styles from "./styles";

const TileM = ({ onPress, tile }) => {
  const {
    article: { id, shortHeadline, url }
  } = tile;
  const tileWithoutLabelAndFlags = { article: { id, shortHeadline, url } };

  return (
    <TileLink onPress={onPress} tile={tileWithoutLabelAndFlags}>
      <View style={styles.container}>
        <TileSummary
          headlineStyle={styles.headline}
          starStyle={styles.star}
          strapline={getTileStrapline(tile)}
          straplineStyle={styles.strapline}
          tile={tileWithoutLabelAndFlags}
        />
      </View>
    </TileLink>
  );
};

TileM.propTypes = {
  onPress: PropTypes.func.isRequired,
  tile: PropTypes.shape({}).isRequired
};

export default withTileTracking(TileM);
