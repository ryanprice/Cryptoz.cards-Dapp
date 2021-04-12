<template>
  <div>
    <b-card class="card-spacer"
          header="Indicator 1"
          header-tag="header"
        >
      <b-card-text>DATA GOES HERE</b-card-text>
    </b-card>
  </div>
</template>

<script>
import {
  BCard,
  BCardText,
} from "bootstrap-vue";

export default {
  name: "Indicator",
  components: {
    BCard,
    BCardText,
  },
  data() {
    return {

    }
  },
}
</script>

<style scoped>
.card-spacer{
  margin-bottom: 5px;
}
</style>
