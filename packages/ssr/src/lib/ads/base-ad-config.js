module.exports = {
  apstagConfig: {
    adServer: "googletag",
    bidTimeout: 3000,
    gdpr: {
      cmpTimeout: 3000
    },
    pubID: "3360"
  },

  defaultClient: {
    adUnit: "d.thetimes.co.uk",
    biddersConfig: {
      bidders: {
        amazon: {
          accountId: "3360",
          slots: []
        },
        appnexus: {
          placementId: "5823281"
        },
        ix: {
          siteId: "1234"
        },
        rubicon: {
          accountId: "14062",
          siteId: "70608",
          zoneId: "335918"
        }
      },
      bucketSize: 0.25,
      maxBid: 15,
      minPrice: 0.01,
      timeout: 3000
    },
    bidderSlots: ["header", "inline-ad"],
    bidInitialiser: Promise.resolve(),
    globalSlots: ["ad-pixel", "ad-pixelskin", "ad-pixelteads"],
    networkId: "25436805"
  },

  defaultServer: {
    adUnit: "25436805",
    biddersConfig: {
      bidders: {
        amazon: {
          accountId: "3360"
        },
        appnexus: {
          placementId: "5823281"
        },
        ix: {
          siteId: "1234"
        },
        rubicon: {
          accountId: "14062",
          siteId: "70608",
          zoneId: "335918"
        }
      },
      bucketSize: 0.25,
      maxBid: 15,
      minPrice: 0.01,
      timeout: 3000
    },
    bidderSlots: ["header", "inline-ad"],
    bidInitialiser: false,
    debug: true,
    disabled: false,
    globalSlots: ["ad-pixel", "ad-pixelskin", "ad-pixelteads"],
    networkId: "",
    pageTargeting: {},
    slotTargeting: {}
  },

  prebidConfig: url => ({
    bidTimeout: 3000,
    cache: {
      url: "https://prebid.adnxs.com/pbc/v1/cache"
    },
    consentManagement: {
      allowAuctionWithoutConsent: true,
      cmpApi: "iab",
      timeout: 300
    },
    debug: true,
    enableSendAllBids: true,
    publisherDomain: encodeURIComponent(url),
    rubicon: {
      singleRequest: true
    },
    userSync: {
      enableOverride: false,
      syncDelay: 3000,
      syncEnabled: true,
      syncsPerBidder: 5
    }
  })
};
