<template>
  <div>
    <b-dropdown
      :disabled="disabled"
      id="dropdown"
      :text="'Sort by ' + (sortType ? types[sortType] : '')"
    >
      <b-dropdown-item
        v-for="(name, type) in types"
        :key="type"
        @click="callSort(type)"
      >
        {{ name }}
      </b-dropdown-item>
    </b-dropdown>

    <b-button
      v-if="sortType"
      id="toggle-order-button"
      @click="toggleOrder"
      v-b-tooltip.hover="'Toggle sort order'"
    >
      {{ isDescending ? "➘" : "➚" }}
    </b-button>
  </div>
</template>

<script>
import { BDropdown, BDropdownItem, BButton } from "bootstrap-vue";
export default {
  name: "SortDropdown",
  components: {
    BDropdown,
    BDropdownItem,
    BButton,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isDescending: false,
      sortType: null,
      types: {
        name: "Name",
        rarity: "Rarity",
        cost: "Cost",
        card_set: "Card Set",
        edition_number: "Edition Number",
        card_level: "Level",
        unlock_czxp: "Unlock CZXP",
        buy_czxp: "Buy CZXP",
        transfer_czxp: "Transfer CZXP",
        sacrifice_czxp: "Sacrifice CZXP",
      },
    };
  },
  methods: {
    callSort(param) {
      this.sortType = param;
      this.$emit("sort-by-attr", param, this.isDescending);
    },
    toggleOrder() {
      this.isDescending = !this.isDescending;
      this.callSort(this.sortType);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
#toggle-order-button {
  margin-left: 0.5rem;
}
</style>
