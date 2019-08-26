import Vue from 'vue'
import Router from 'vue-router'
import BodyContent from '@/components/BodyContent.vue'
import ShopContent from '@/components/ShopContent.vue'
import CryptContent from '@/components/CryptContent.vue'
import MarketContent from '@/components/MarketContent.vue'
import HelpContent from '@/components/HelpContent.vue'
import TokenContent from '@/components/TokenContent.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'BodyContent',
      component: BodyContent
    },
    {
      path: '/shop',
      name: 'ShopContent',
      component: ShopContent
    },
    {
      path: '/crypt',
      name: 'CryptContent',
      component: CryptContent
    },
    {
      path: '/market',
      name: 'MarketContent',
      component: MarketContent
    },
    {
      path: '/help',
      name: 'HelpContent',
      component: HelpContent
    },
    {
      path: '/view/:token_id',
      name: 'TokenContent',
      component: TokenContent
    }
  ],
  scrollBehavior() {
    return {x: 0, y: 0}
  }
})
