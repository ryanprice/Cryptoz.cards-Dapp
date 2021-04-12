import Vue from "vue";
import Router from "vue-router";
// import BodyContent from '@/components/BodyContent.vue'
// import ShopContent from '@/components/ShopContent.vue'
// import CryptContent from '@/components/CryptContent.vue'
// import MarketContent from '@/components/MarketContent.vue'
// import HelpContent from '@/components/HelpContent.vue'
// import TokenContent from '@/components/TokenContent.vue'
// import OthersCryptContent from '@/components/OthersCryptContent.vue'

const lazyLoadComponents = (component) => {
  return () => import(`@/components/${component}.vue`);
};

Vue.use(Router);

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "BodyContent",
      component: lazyLoadComponents("BodyContent"),
      meta: {
        title:
          "The Cryptoz NFT Universe - Where the dead live forever on the Blockchain",
        metaTags: [
          {
            name: "description",
            content:
              "A Universe of limited edition BEP-721 NFT collectible zombie cards stored in your BSC blockchain wallet",
          },
          {
            property: "og:url",
            content: "https://bsc.cryptoz.cards/",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content:
              "Cryptoz NFT Cards unique and fun collectibles on the Binance Smart Chain",
          },
          {
            property: "og:image",
            content: "https://cryptoz.cards/assets/cryptokeeper_logo_binance.svg",
          },
        ],
      },
    },
    {
      path: "/shop",
      name: "ShopContent",
      component: lazyLoadComponents("ShopContent"),
      meta: {
        title:
          "Cryptoz Cards - Shop - Purchase Limited edition Cryptoz and claim cards for FREE",
        metaTags: [
          {
            name: "description",
            content:
              "Shop for Limited Edition cards, never to be released again, claim some for FREE while quantities last. Purchase Booster credits to open possibly rare and epic booster cards",
          },
          {
            property: "og:url",
            content: "https://cryptoz.cards/shop",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content:
              "The Cryptoz NFT Universe - Shop - Purchase Limited edition Cryptoz NFTs and claim some for FREE",
          },
          {
            property: "og:image",
            content: "https://cryptoz.cards/assets/cryptokeeper_logo_binance.svg",
          },
        ],
      },
    },
    {
      path: "/my-cryptoz-nfts",
      name: "CryptContent",
      component: lazyLoadComponents("CryptContent"),
      meta: {
        title:
          "Cryptoz Cards - Your Crypt - A collection of all the cards you own",
        metaTags: [
          {
            name: "description",
            content:
              "Browse through Your Crypt to view all the cards you have bought, claimed or been gifted. Also open Booster Cards for a chance to pull a Rare or even Epic card !. Sacrifice cards for CZXP tokens and gift cards to friends",
          },
          {
            property: "og:url",
            content: "https://bsc.cryptoz.cards/my-cryptoz-nfts",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content:
              "Cryptoz Cards - Your Crypt - A collection of all the cards you own",
          },
          {
            property: "og:image",
            content: "https://cryptoz.cards/assets/cryptokeeper_logo_binance.svg",
          },
        ],
      },
    },
    {
      path: "/my-cryptoz-nfts/:address",
      name: "OthersCrypt",
      component: lazyLoadComponents("OthersCryptContent"),
      meta: {
        title: "Cryptoz Cards - A collection of cards",
        metaTags: [
          {
            name: "description",
            content: "Browse through other person's Cryptoz cards!",
          },
          {
            property: "og:url",
            content: "https://bsc.cryptoz.cards/my-cryptoz-nfts",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content:
              "Cryptoz Cards - Other's Crypt - A collection of all the cards your friend owns",
          },
          {
            property: "og:image",
            content: "https://cryptoz.cards/assets/cryptokeeper_logo_binance.svg",
          },
        ],
      },
    },
    {
      path: "/market",
      name: "MarketContent",
      component: lazyLoadComponents("MarketContent"),
      meta: {
        title:
          "Cryptoz Cards - Market - Buy and Sell Cryptoz Cards and CZXP tokens with people around the world",
        metaTags: [
          {
            name: "description",
            content:
              "Cryptoz Cards and the CZXP tokens are built on the tokens standards that allow them to be traded, bought and sold on any of the compatible markets. Browse through the markets for opportunities and profits !",
          },
          {
            property: "og:url",
            content: "https://bsc.cryptoz.cards/market",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content:
              "Cryptoz NFTs - Market - Buy and Sell Cryptoz NFTs and CZXP tokens with people around the world",
          },
          {
            property: "og:image",
            content: "https://cryptoz.cards/assets/cryptokeeper_logo_binance.svg",
          },
        ],
      },
    },
    {
      path: "/help",
      name: "HelpContent",
      props: (route) => ({ query: route.query.t }),
      component: lazyLoadComponents("HelpContent"),
      meta: {
        title:
          "Cryptoz Cards - Help - Answers to all your Frequently Asked Questions",
        metaTags: [
          {
            name: "description",
            content:
              "While we do our best to make the Cryptoz Cards Experience as seamless as possible, this page offers answers and examples for most questions people have when getting started and even for the experienced player",
          },
          {
            property: "og:url",
            content: "https://bsc.cryptoz.cards/help",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content:
              "Cryptoz NFT Cards - Help - Answers to all your Frequently Asked Questions",
          },
          {
            property: "og:image",
            content: "https://cryptoz.cards/assets/cryptokeeper_logo_binance.svg",
          },
        ],
      },
    },
    {
      path: "/view/:token_id",
      name: "TokenContent",
      component: lazyLoadComponents("TokenContent"),
      meta: {
        title:
          "Cryptoz NFTs - View NFT - Detailed information about a minted Cryptoz NFT",
        metaTags: [
          {
            name: "description",
            content:
              "Detailed information about a Cryptoz NFT. Including owner wallet address",
          },
          {
            property: "og:url",
            content: "TOKEN_ID", // will get replaced in the loop processor below
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content:
              "The Cryptoz NFT Universe - View NFT - Detailed information about a Uniqiue Cryptoz NFT Card",
          },
          {
            property: "og:image",
            content: "https://cryptoz.cards/assets/cryptokeeper_logo_binance.svg",
          },
        ],
      },
    },
    {
      path: "/data-indicators",
      name: "DataIndicators",
      component: lazyLoadComponents("DataIndicators"),
      meta: {
        title:
          "The Cryptoz NFT Universe - Data Inidicators - The Heart of the Universe",
        metaTags: [
          {
            name: "description",
            content:
              "All the data in the Universe, Rarity, Scarcity, trends and indicators",
          },
          {
            property: "og:url",
            content: "https://cryptoz.cards/data-indicators",
          },
          {
            property: "og:type",
            content: "website",
          },
          {
            property: "og:title",
            content:
              "The Cryptoz NFT Universe - Data Inidicators - The Heart of the Universe",
          },
          {
            property: "og:image",
            content: "https://cryptoz.cards/assets/cryptokeeper_logo_binance.svg",
          },
        ],
      },
    },
  ],
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
  //console.log('FROM router:',to)
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched
    .slice()
    .reverse()
    .find((r) => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if (nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(
    document.querySelectorAll("[data-vue-router-controlled]")
  ).map((el) => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if (!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags
    .map((tagDef) => {
      const tag = document.createElement("meta");

      Object.keys(tagDef).forEach((key) => {
        //Replace the og:url content with a dynamic url
        if (tagDef[key] == "TOKEN_ID") {
          tagDef[key] = "https://cryptoz.cards/view/" + to.params.token_id;
        }

        tag.setAttribute(key, tagDef[key]);
      });

      // We use this to track which meta tags we create, so we don't interfere with other ones.
      tag.setAttribute("data-vue-router-controlled", "");

      return tag;
    })
    // Add the meta tags to the document head.
    .forEach((tag) => document.head.appendChild(tag));

  next();
});

export default router;
