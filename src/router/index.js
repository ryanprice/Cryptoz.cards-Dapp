import Vue from 'vue'
import Router from 'vue-router'
import BodyContent from '@/components/BodyContent.vue'
import ShopContent from '@/components/ShopContent.vue'
import CryptContent from '@/components/CryptContent.vue'
import MarketContent from '@/components/MarketContent.vue'
import HelpContent from '@/components/HelpContent.vue'
import TokenContent from '@/components/TokenContent.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'BodyContent',
      component: BodyContent,
      meta: {
          title: 'Cryptoz Cards - Where the dead live forever on the Blockchain',
          metaTags: [
                {
                    name: 'description',
                    content : 'A Universe of limited edition ERC-721 NFT collectible zombie cards stored in your Ethereum blockchain wallet'
                },
                {
                    property: 'og:url',
                    content: 'https://cryptoz.cards/',
                },
                {
                    property: 'og:type',
                    content: 'website',
                },
                {
                    property: 'og:title',
                    content: 'Cryptoz Cards unique and fun collectibles on the Ethereum blockchain',
                },
                {
                    property: 'og:image',
                    content: 'https://cryptoz.cards/assets/cryptokeeper_logo.svg',
                }
          ]
      }
    },
    {
      path: '/shop',
      name: 'ShopContent',
      component: ShopContent,
        meta: {
          title: 'Cryptoz Cards - Shop - Purchase Limited edition Cryptoz and claim cards for FREE',
          metaTags: [
                {
                    name: 'description',
                    content : 'Shop for Limited Edition cards, never to be released again, claim some for FREE while quantities last. Purchase Booster credits to open possibly rare and epic booster cards'
                },
                {
                    property: 'og:url',
                    content: 'https://cryptoz.cards/shop',
                },
                {
                    property: 'og:type',
                    content: 'website',
                },
                {
                    property: 'og:title',
                    content: 'Cryptoz Cards - Shop - Purchase Limited edition Cryptoz and claim some for FREE',
                },
                {
                    property: 'og:image',
                    content: 'https://cryptoz.cards/assets/cryptokeeper_logo.svg',
                }
          ]
        }
    },
    {
      path: '/crypt',
      name: 'CryptContent',
      component: CryptContent,
      meta: {
          title: 'Cryptoz Cards - Your Crypt - A collection of all the cards you own',
          metaTags: [
                {
                    name: 'description',
                    content : 'Browse through Your Crypt to view all the cards you have bought, claimed or been gifted. Also open Booster Cards for a chance to pull a Rare or even Epic card !. Sacrifice cards for CZXP tokens and gift cards to friends'
                },
                {
                    property: 'og:url',
                    content: 'https://cryptoz.cards/crypt',
                },
                {
                    property: 'og:type',
                    content: 'website',
                },
                {
                    property: 'og:title',
                    content: 'Cryptoz Cards - Your Crypt - A collection of all the cards you own',
                },
                {
                    property: 'og:image',
                    content: 'https://cryptoz.cards/assets/cryptokeeper_logo.svg',
                }
          ]
        }
    },
    {
      path: '/market',
      name: 'MarketContent',
      component: MarketContent,
      meta: {
          title: 'Cryptoz Cards - Market - Buy and Sell Cryptoz Cards and CZXP tokens with people around the world',
          metaTags: [
                {
                    name: 'description',
                    content : 'Cryptoz Cards and the CZXP tokens are built on the tokens standards that allow them to be traded, bought and sold on any of the compatible markets. Browse through the markets for opportunities and profits !'
                },
                {
                    property: 'og:url',
                    content: 'https://cryptoz.cards/market',
                },
                {
                    property: 'og:type',
                    content: 'website',
                },
                {
                    property: 'og:title',
                    content: 'Cryptoz Cards - Market - Buy and Sell Cryptoz Cards and CZXP tokens with people around the world',
                },
                {
                    property: 'og:image',
                    content: 'https://cryptoz.cards/assets/cryptokeeper_logo.svg',
                }
          ]
        }
    },
    {
      path: '/help',
      name: 'HelpContent',
      component: HelpContent,
        meta: {
          title: 'Cryptoz Cards - Help - Answers to all your Frequently Asked Questions',
          metaTags: [
                {
                    name: 'description',
                    content : 'While we do our best to make the Cryptoz Cards Experience as seamless as possible, this page offers answers and examples for most questions people have when getting started and even for the experienced player'
                },
                {
                    property: 'og:url',
                    content: 'https://cryptoz.cards/help',
                },
                {
                    property: 'og:type',
                    content: 'website',
                },
                {
                    property: 'og:title',
                    content: 'Cryptoz Cards - Help - Answers to all your Frequently Asked Questions',
                },
                {
                    property: 'og:image',
                    content: 'https://cryptoz.cards/assets/cryptokeeper_logo.svg',
                }
          ]
        }
    },
    {
      path: '/view/:token_id',
      name: 'TokenContent',
      component: TokenContent,
        meta: {
          title: 'Cryptoz Cards - View Card - Detailed information about a Cryptoz Card',
          metaTags: [
                {
                    name: 'description',
                    content : 'Detailed information about a Cryptoz card. Including owner wallet address'
                },
                {
                    property: 'og:url',
                    content: 'TOKEN_ID', // will get replaced in the loop processor below
                },
                {
                    property: 'og:type',
                    content: 'website',
                },
                {
                    property: 'og:title',
                    content: 'Cryptoz Cards - View Card - Detailed information about a Cryptoz Card',
                },
                {
                    property: 'og:image',
                    content: 'https://cryptoz.cards/assets/cryptokeeper_logo.svg',
                }
          ]
        }
    }
  ],
  scrollBehavior() {
    return {x: 0, y: 0}
  }
})

// This callback runs before every route change, including on page load.
router.beforeEach((to, from, next) => {
    console.log('FROM router:',to)
  // This goes through the matched routes from last to first, finding the closest route with a title.
  // eg. if we have /some/deep/nested/route and /some, /deep, and /nested have titles, nested's will be chosen.
  const nearestWithTitle = to.matched.slice().reverse().find(r => r.meta && r.meta.title);

  // Find the nearest route element with meta tags.
  const nearestWithMeta = to.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);
  const previousNearestWithMeta = from.matched.slice().reverse().find(r => r.meta && r.meta.metaTags);

  // If a route with a title was found, set the document (page) title to that value.
  if(nearestWithTitle) document.title = nearestWithTitle.meta.title;

  // Remove any stale meta tags from the document using the key attribute we set below.
  Array.from(document.querySelectorAll('[data-vue-router-controlled]')).map(el => el.parentNode.removeChild(el));

  // Skip rendering meta tags if there are none.
  if(!nearestWithMeta) return next();

  // Turn the meta tag definitions into actual elements in the head.
  nearestWithMeta.meta.metaTags.map(tagDef => {
    const tag = document.createElement('meta');

    Object.keys(tagDef).forEach(key => {
        
        //Replace the og:url content with a dynamic url
        if(tagDef[key] == 'TOKEN_ID'){
            tagDef[key] = 'https://cryptoz.cards/view/'+to.params.token_id
        }
        
      tag.setAttribute(key, tagDef[key]);
    });

    // We use this to track which meta tags we create, so we don't interfere with other ones.
    tag.setAttribute('data-vue-router-controlled', '');

    return tag;
  })
  // Add the meta tags to the document head.
  .forEach(tag => document.head.appendChild(tag));

  next();
});

export default router;
