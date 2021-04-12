<template>
  <div>
    <div class="jumbotron">
      IS this working ?
      <Indicator></Indicator>
    </div>
  </div>
</template>

<script>
import Indicator from "@/components/Indicator.vue";

export default {
  name: "DataIndicators",
  data() {
    return {

    }
  },
};
</script>

<style scoped>
.jumbotron {
  margin: auto;
  width: 95%;
}
</style>
