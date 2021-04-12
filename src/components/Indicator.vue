<template>
  <div>
    <b-card class="card-spacer"
          header="Shop Rarity Distribution"
          header-tag="header"
        >
        <b-row>
          <b-col>
            <b-card-text>
              Common</br>
              UnCommon</br>
              Rare</br>
              Epic</br>
            </b-card-text>
          </b-col>
          <b-col>
            <graph-treemap
              :width="400"
              :height="400"
              :text-align="'right'"
              :text-vertical-align="'bottom'"
              :colors="[ '#545161', '#2BA4FA', '#CA3C2C', '#5745E5' ]"
              :values="allCards.values">
            </graph-treemap>
          </b-col>
        </b-row>
    </b-card>
  </div>
</template>

<script>
import GraphTreemap from 'vue-graph/src/components/treemap.js'
import NoteWidget from 'vue-graph/src/widgets/note.js'
import LegendWidget from 'vue-graph/src/widgets/legends.js'
import ToolTip from 'vue-graph/src/widgets/tooltip.js'

import {
  BCard,
  BCardText,
  BCol,
  BRow,
} from "bootstrap-vue";

export default {
  name: "Indicator",
  components: {
    BCard,
    BCardText,
    BCol,
    BRow,
    NoteWidget,
    LegendWidget,
    ToolTip,
    GraphTreemap,
  },
  data() {
    return {
      allCards: {
        values: [
            [ '0', 'Common', -1 ],
            [ '0.0', 'Common', 79 ],
            [ '1', 'Uncommon', -1 ],
            [ '1.0', 'Uncommon', 59 ],
            [ '2', 'Rare', -1 ],
            [ '2.0', 'Rare', 34 ],
            [ '3', 'Epic',  ],
            [ '3.0', 'Epic', 20 ],
            [ '4', 'Platinum',  ],
            [ '4.0', 'Epic', 5 ],
        ]
      }
    }
  },
}
</script>

<style scoped>
.card-spacer{
  margin-bottom: 5px;
}
</style>
