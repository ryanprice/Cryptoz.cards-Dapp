<template>
  <div>
    <div class="jumbotron">
      <h2>The Heartbeat of the Universe</h2>
      <Indicator v-for="item in items"
        :id="item.id"
      >
      </Indicator>
    </div>
  </div>
</template>

<script>
import Indicator from "@/components/Indicator.vue";

export default {
  name: "DataIndicators",
  components: {
    Indicator,
  },
  data() {
    return {
      items: [1,2,3],
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
