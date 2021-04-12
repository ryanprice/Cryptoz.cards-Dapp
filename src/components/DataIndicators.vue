<template>
  <div>
  <div class="jumbotron">
    <h2>The Heartbeat of the Universe</h2>

    <b-card class="card-spacer"
          header="All Types Rarity Distribution"
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
              :width="300"
              :height="300"
              :text-align="'right'"
              :text-vertical-align="'bottom'"
              :colors="[ '#545161', '#2BA4FA', '#CA3C2C', '#5745E5', '#d3d3d3' ]"
              :values="treeMaprarity.allTypes">
            </graph-treemap>
          </b-col>
        </b-row>
    </b-card>

    <b-card class="card-spacer"
          header="Store Types Rarity Distribution"
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
              :width="300"
              :height="300"
              :text-align="'right'"
              :text-vertical-align="'bottom'"
              :colors="[ '#545161', '#2BA4FA', '#CA3C2C', '#5745E5', '#d3d3d3' ]"
              :values="treeMaprarity.storeTypes">
            </graph-treemap>
          </b-col>
        </b-row>
    </b-card>


    </div>
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
  name: "DataIndicators",
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
      treeMaprarity: {
        allTypes: [ //SELECT count(rarity),rarity FROM cards GROUP BY rarity
            [ '0', 'Common', -1 ],
            [ '0.0', 'Common', 79 ],
            [ '1', 'Uncommon', -1 ],
            [ '1.0', 'Uncommon', 59 ],
            [ '2', 'Rare', -1 ],
            [ '2.0', 'Rare', 34 ],
            [ '3', 'Epic', -1 ],
            [ '3.0', 'Epic', 20 ],
            [ '4', 'Platinum',  ],
            [ '4.0', 'Platinum', 5 ],
        ],
        storeTypes: [ // SELECT count(rarity),rarity FROM cards WHERE in_store=0 GROUP BY rarity
            [ '0', 'Common', -1 ],
            [ '0.0', 'Common', 22 ],
            [ '1', 'Uncommon', -1 ],
            [ '1.0', 'Uncommon', 15 ],
            [ '2', 'Rare', -1 ],
            [ '2.0', 'Rare', 15 ],
            [ '3', 'Epic', -1 ],
            [ '3.0', 'Epic', 6 ],
            [ '4', 'Platinum', -1 ],
            [ '4.0', 'Platinum', 0 ],
        ]
      }
    }
  },
}
</script>

<style scoped>
.card-spacer{
  margin-bottom: 10px;
}
</style>
