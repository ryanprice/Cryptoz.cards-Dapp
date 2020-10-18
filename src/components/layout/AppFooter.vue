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
          <img class="img-fluid dev-logo" src="./../assets/cardinal.png" />
          <p v-if="isConnected">You are connected to: {{network}}</p>

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

export default {
  name: 'AppFooter',
  computed: {
    isConnected() {
      return this.$store.state.web3.isConnected
    },
    network() {
      const hexString = this.$store.state.web3.chainId
      if (!hexString) return "Unidentified Network"
      return NETWORKS[hexString.split('x')[1]]
    }
  },
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
    box-shadow: 0 50vh 0 50vh #343a40;
  }
  .dev-logo{
    width:28%;
    padding:0px 0px 10px;
  }
</style>