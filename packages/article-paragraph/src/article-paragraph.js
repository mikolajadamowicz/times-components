import React from "react";
import { View } from "react-native";
import PropTypes from "prop-types";
import Context from "@times-components/context";
import { ResponsiveContext } from "@times-components/responsive";
import styleFactory from "./styles";

const styles = styleFactory();

const BodyParagraph = props => (
  <ResponsiveContext.Consumer>
    {({ isTablet }) => (
      <View
        style={[
          styles.articleMainContentRow,
          isTablet && styles.articleMainContentRowTablet
        ]}
      >
        <Context.Consumer>
          {({ theme: { dropCapFont, scale } }) => {
            const stylesScaled = styleFactory(dropCapFont, scale);
            return props.children(stylesScaled.articleTextElement);
          }}
        </Context.Consumer>
      </View>
    )}
  </ResponsiveContext.Consumer>
);

BodyParagraph.propTypes = {
  children: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  ).isRequired
};

export default BodyParagraph;
