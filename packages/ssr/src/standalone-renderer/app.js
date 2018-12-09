/* eslint-disable no-console */
const express = require("express");
const shrinkRay = require("shrink-ray");

const ssr = require("../server");
const makeArticleUrl = require("../lib/make-url");
const logger = require("../lib/simple-logger");
const { apstagConfig, prebidConfig } = require("../lib/ads/base-ad-config");

const port = 3000;
const server = express();
const graphqlApiUrl = process.env.GRAPHQL_ENDPOINT;
if (!graphqlApiUrl) {
  throw new Error("GRAPHQL_ENDPOINT is not defined");
}

const headers = { "nuk-tpatoken": process.env.GRAPHQL_TOKEN || null };
if (!headers["nuk-tpatoken"]) {
  // throw new Error("GRAPHQL_TOKEN is not defined");
}

server.use(shrinkRay());
server.use(express.static("dist"));
server.use("/static", express.static("static"));

const makeHtml = (
  initialState,
  initialProps,
  { bundleName, markup, responsiveStyles, styles, title, prebid, apstag }
) => `
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${title}</title>
            ${styles}
            ${responsiveStyles}
            <script>
              window.googletag = window.googletag || {};
              window.googletag.cmd = window.googletag.cmd || [];
              window.pbjs = window.pbjs || {};
              window.pbjs.que = window.pbjs.que || [];
              window.apstag = {
                _Q: [],
                addToQueue(action, d) {
                  this._Q.push([action, d]);
                },
                fetchBids() {
                  this.addToQueue("f", arguments);
                },
                init() {
                  this.addToQueue("i", arguments);
                },
              };
            </script>
          </head>
          <body style="margin:0">
            <script>
              window.nuk = {
                graphqlapi: {
                  url: "${graphqlApiUrl}"
                },
                tracking: {enabled: false}
              };
            </script>
            ${initialProps}
            ${initialState}
            <div id="main-container">${markup}</div>
          </body>
          <script src="/common.react.bundle.js"></script>
          <script src="/${bundleName}.init.js"></script>
          <script src="/${bundleName}.react.bundle.js"></script>
        </html>
      `;

const toNumber = input => {
  const parsed = Number.parseInt(input, 10);

  if (Number.isNaN(parsed)) {
    return null;
  }

  return parsed;
};

server.get("/article/:id", (request, response, next) => {
  const {
    originalUrl,
    params: { id: articleId }
  } = request;

  ssr
    .article(articleId, headers, { graphqlApiUrl, logger, makeArticleUrl })
    .then(
      ({ initialProps, initialState, markup, responsiveStyles, styles }) => {
        try {
          const html = makeHtml(initialState, initialProps, {
            apstag: apstagConfig,
            bundleName: "article",
            markup,
            prebid: prebidConfig(originalUrl),
            responsiveStyles,
            styles,
            title: "Article"
          });
          response.send(html);
        } catch (err) {
          next(err);
        }
      }
    )
    .catch(err => {
      next(err);
    });
});

server.get("/profile/:slug", (request, response, next) => {
  const {
    originalUrl,
    params: { slug: authorSlug },
    query: { page }
  } = request;
  const currentPage = toNumber(page) || 1;

  ssr
    .authorProfile({ authorSlug, currentPage }, {
      graphqlApiUrl,
      logger,
      makeArticleUrl
    })
    .then(
      ({ initialProps, initialState, markup, responsiveStyles, styles }) => {
        try {
          const html = makeHtml(initialState, initialProps, {
            apstag: apstagConfig,
            bundleName: "author-profile",
            markup,
            prebid: prebidConfig(originalUrl),
            responsiveStyles,
            styles,
            title: authorSlug
          });
          response.send(html);
        } catch (err) {
          next(err);
        }
      }
    )
    .catch(err => {
      next(err);
    });
});

server.get("/topic/:slug", (request, response, next) => {
  const {
    originalUrl,
    params: { slug: topicSlug },
    query: { page }
  } = request;
  const currentPage = toNumber(page) || 1;

  ssr
    .topic({ currentPage, topicSlug }, {
      graphqlApiUrl,
      logger,
      makeArticleUrl
    })
    .then(
      ({ initialProps, initialState, markup, responsiveStyles, styles }) => {
        try {
          const html = makeHtml(initialState, initialProps, {
            apstag: apstagConfig,
            bundleName: "topic",
            markup,
            prebid: prebidConfig(originalUrl),
            responsiveStyles,
            styles,
            title: topicSlug
          });
          response.send(html);
        } catch (err) {
          next(err);
        }
      }
    )
    .catch(err => {
      next(err);
    });
});

const serviceName = "Stand-alone renderer server";

const App = server.listen(port, () =>
  console.log(`🚀  ${serviceName} ready at http://localhost:${port}`)
);

process.on("SIGTERM", () => {
  App.close(() => {
    console.log(`${serviceName} closed`);
  });
});
