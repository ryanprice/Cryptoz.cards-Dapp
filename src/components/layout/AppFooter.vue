<template>
  <div class="hello">
    <!-- Footer -->
<footer class="page-footer font-small blue pt-4">

    <!-- Footer Links -->
    <div class="container-fluid text-center text-md-left">

      <!-- Grid row -->
      <div class="row">

        <!-- Grid column -->
        <div class="col-md-6 mt-md-0 mt-3">

          <!-- Content -->
          <img class="img-fluid dev-logo" src="./assets/cardinal.png" />
          <p v-if="isInjected">You are connected to: {{network}}</p>
          <p v-else>
            Metamask is <strong>required</strong> to bridge Cryptoz on Ethereum<br>
            <a href="https://metamask.io/" target="_blank">
              <img src="static/metamask_logo.png" width="20%" />
            </a>
          </p>

        </div>
        <!-- Grid column -->

        <hr class="clearfix w-100 d-md-none pb-3">

        <!-- Grid column -->
        <div class="col-md-3 mb-md-0 mb-3">

            <!-- Links -->
            <h5 class="text-uppercase">Links</h5>

            <ul class="list-unstyled">
              <li>
                <a href="#!">Blog</a>
              </li>
              <li>
                <a href="#!">Telegram</a>
              </li>
              <li>
                <a href="#!">Telegram Announcements</a>
              </li>
              <li>
                <a href="#!">Instagram</a>
              </li>
            </ul>

          </div>
          <!-- Grid column -->

          <!-- Grid column -->
          <div class="col-md-3 mb-md-0 mb-3">

            <!-- Links -->
            <h5 class="text-uppercase">Links</h5>

            <ul class="list-unstyled">
              <li>
                <a href="#!">Link 1</a>
              </li>
              <li>
                <a href="#!">Link 2</a>
              </li>
              <li>
                <a href="#!">Link 3</a>
              </li>
              <li>
                <a href="#!">Link 4</a>
              </li>
            </ul>

          </div>
          <!-- Grid column -->

      </div>
      <!-- Grid row -->

    </div>
    <!-- Footer Links -->

    <!-- Copyright -->
    <div class="footer-copyright text-center py-3">© 2018 Copyright Cardinal Entertainment
    </div>
    <!-- Copyright -->

  </footer>
  <!-- Footer -->
  </div>
</template>

<script>
import {NETWORKS} from '../../util/constants/networks'
import {mapState} from 'vuex'

export default {
  name: 'AppFooter',
  computed: mapState({
    isInjected: state => state.web3.isInjected,
    network: state => NETWORKS[state.web3.networkId],
  }),
  data () {
    return {
      // 0 - detecting, 1 - no metamask, 2- mm installed , show network
    }
  },
  props : [],
  methods : {
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  footer{
    color: #FFF;
    width: 100%;
    height: 100%;
    background-color: #343a40!important;
  }
  .dev-logo{
    width:28%;
    padding:0px 0px 10px;
  }
</style>