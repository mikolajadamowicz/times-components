/* eslint-disable consistent-return */

import React, { Component } from "react";
import { View, FlatList, ScrollView, Text } from "react-native";
import PropTypes from "prop-types";
import ArticleComments from "@times-components/article-comments";
import { AdComposer } from "@times-components/ad";
import RelatedArticles from "@times-components/related-articles";
import Responsive, { ResponsiveContext } from "@times-components/responsive";
import { withTrackScrollDepth } from "@times-components/tracking";
import { screenWidth } from "@times-components/utils";
import ArticleRow, { ArticleRowFlow } from "./article-body/article-body-row";
import ArticleTopics from "./article-topics";
import {
  articleSkeletonPropTypes,
  articleSkeletonDefaultProps
} from "./article-skeleton-prop-types";
import listViewDataHelper from "./data-helper";
import articleTrackingContext from "./article-tracking-context";
import insertDropcapIntoAST from "./dropcap-util";
import styles from "./styles/shared";
import Gutter, { maxWidth } from "./gutter";
import { Layout, Text as FText } from "@times-components/text-flow";

const listViewPageSize = 1;
const listViewSize = 10;
const listViewScrollRenderAheadDistance = 10;

const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 100,
  waitForInteraction: false
};

const renderRow = (
  rowData,
  onAuthorPress,
  onCommentsPress,
  onCommentGuidelinesPress,
  onImagePress,
  onLinkPress,
  onRelatedArticlePress,
  onTopicPress,
  onTwitterLinkPress,
  onVideoPress,
  analyticsStream,
  interactiveConfig
) => {
  // eslint-disable-next-line default-case
  switch (rowData.type) {
    case "articleBodyRow": {
      return (
        <ArticleRow
          content={rowData}
          interactiveConfig={interactiveConfig}
          onImagePress={onImagePress}
          onLinkPress={onLinkPress}
          onTwitterLinkPress={onTwitterLinkPress}
          onVideoPress={onVideoPress}
        />
      );
    }

    case "relatedArticleSlice": {
      const { relatedArticleSlice } = rowData.data;
      return (
        <ResponsiveContext.Consumer>
          {({ isTablet }) => (
            <View style={isTablet && styles.relatedArticlesTablet}>
              <RelatedArticles
                analyticsStream={analyticsStream}
                onPress={onRelatedArticlePress}
                slice={relatedArticleSlice}
              />
            </View>
          )}
        </ResponsiveContext.Consumer>
      );
    }

    case "topics": {
      return (
        <ArticleTopics onPress={onTopicPress} topics={rowData.data.topics} />
      );
    }

    case "comments": {
      return (
        <ArticleComments
          articleId={rowData.data.articleId}
          onCommentGuidelinesPress={onCommentGuidelinesPress}
          onCommentsPress={onCommentsPress}
          url={rowData.data.url}
        />
      );
    }
  }
};

class ArticleSkeleton extends Component {
  constructor(props) {
    super(props);
    this.onViewableItemsChanged = this.onViewableItemsChanged.bind(this);

    if (props.data) {
      this.state = {
        dataSource: props.data,
        width: screenWidth()
      };
    } else {
      this.state = {
        dataSource: {}
      };
    }
  }

  onViewableItemsChanged(info) {
    if (!info.changed.length) return [];

    const { onViewed } = this.props;
    const { dataSource } = this.state;

    return info.changed
      .filter(viewableItem => viewableItem.isViewable)
      .map(viewableItem => onViewed(viewableItem.item, dataSource));
  }

  render() {
    const {
      adConfig,
      analyticsStream,
      Header,
      interactiveConfig,
      onAuthorPress,
      onCommentGuidelinesPress,
      onCommentsPress,
      onImagePress,
      onLinkPress,
      onRelatedArticlePress,
      onTopicPress,
      onTwitterLinkPress,
      onViewed,
      onVideoPress,
      receiveChildList
    } = this.props;
    const { dataSource, width } = this.state;
    const { dropcapsDisabled, template } = dataSource;
    if (!dataSource.content) {
      return null;
    }

    const newContent = [...dataSource.content];
    if (newContent && newContent.length > 0) {
      newContent[0] = insertDropcapIntoAST(
        newContent[0],
        template,
        dropcapsDisabled
      );
    }

    const articleOrganised = listViewDataHelper({
      ...dataSource,
      content: newContent
    });
    const articleData = articleOrganised.map((item, index) => ({
      ...item,
      elementId: `${item.type}.${index}`,
      name: item.type
    }));

    const rows = articleData
      .filter(row => row.type === "articleBodyRow")
      .map(({ data }) => data);

    const textFlow = new Layout.TextFlow({
      width: 660,
      children: rows.map(rowData => {
        return (
          ArticleRowFlow({
            content: rowData,
            interactiveConfig,
            onLinkPress,
            onTwitterLinkPress,
            onVideoPress
          })
        );
      })
    })

    receiveChildList(articleData);

    return (
      <AdComposer adConfig={adConfig}>
        <Responsive>
          <View style={styles.articleContainer}>
            <ScrollView>
              <Gutter>
                <Header width={Math.min(maxWidth, width)} />
              </Gutter>
              {
                textFlow.block.children.map(block => {
                  if (block instanceof Layout.InlineBlock || block instanceof Layout.Block) {
                    return block.getComponent()
                  }
                  if (block instanceof FText.Text) {
                    return <Gutter>{block.getComponent(style => <View style={{ height: block.measuredHeight }}>
                      {
                        block.block.children.map(line =>
                          line.idealSpans.map(span => (
                            <Text
                              style={{
                                ...style,
                                position: 'absolute',
                                top: span.y - block.y,
                                left: span.x
                              }}
                            >
                              {span.text}
                            </Text>))
                        )
                      }
                    </View>
                    )}</Gutter>
                  }
                })
              }
            </ScrollView></View></Responsive></AdComposer>
    )
    /*
    return (
      <AdComposer adConfig={adConfig}>
        <Responsive>
          <View style={styles.articleContainer}>
            <FlatList
              data={articleData}
              initialListSize={listViewSize}
              interactiveConfig={interactiveConfig}
              keyExtractor={item =>
                item.index ? `${item.type}.${item.index}` : item.type
              }
              ListHeaderComponent={
                <Gutter>
                  <Header width={Math.min(maxWidth, width)} />
                </Gutter>
              }
              onViewableItemsChanged={
                onViewed ? this.onViewableItemsChanged : null
              }
              pageSize={listViewPageSize}
              renderItem={({ item }) => (
                <Gutter>
                  {renderRow(
                    item,
                    onAuthorPress,
                    onCommentsPress,
                    onCommentGuidelinesPress,
                    onImagePress,
                    onLinkPress,
                    onRelatedArticlePress,
                    onTopicPress,
                    onTwitterLinkPress,
                    onVideoPress,
                    analyticsStream,
                    interactiveConfig
                  )}
                </Gutter>
              )}
              scrollRenderAheadDistance={listViewScrollRenderAheadDistance}
              testID="flat-list-article"
              viewabilityConfig={viewabilityConfig}
            />
          </View>
        </Responsive>
      </AdComposer>
    );
    */
  }
}

ArticleSkeleton.propTypes = {
  ...articleSkeletonPropTypes,
  interactiveConfig: PropTypes.shape({}),
  onAuthorPress: PropTypes.func.isRequired,
  onCommentGuidelinesPress: PropTypes.func.isRequired,
  onCommentsPress: PropTypes.func.isRequired,
  onLinkPress: PropTypes.func.isRequired,
  onRelatedArticlePress: PropTypes.func.isRequired,
  onTwitterLinkPress: PropTypes.func.isRequired,
  onVideoPress: PropTypes.func.isRequired
};
ArticleSkeleton.defaultProps = {
  ...articleSkeletonDefaultProps,
  interactiveConfig: {}
};

export default articleTrackingContext(withTrackScrollDepth(ArticleSkeleton));
