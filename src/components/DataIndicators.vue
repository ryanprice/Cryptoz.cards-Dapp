<template>
  <div>
    <div class="jumbotron">
      <h2>The Heartbeat of the Universe</h2>
      <b-card
        class="card-container"
        header="Rarity Distribution"
        header-tag="header"
      >
        <b-tabs>
          <b-tab title="All Types">
            <div class="chart-container">
              <doughnut-chart :chart-data="allTypesData" />
            </div>
          </b-tab>
          <b-tab title="Store Types">
            <div class="chart-container">
              <doughnut-chart :chart-data="storeTypesData" />
            </div>
          </b-tab>
        </b-tabs>
      </b-card>
      <b-card
        class="card-container"
        header="Total NFTs sacrificed over time"
        header-tag="header"
      >
        <div class="chart-container">
          <line-chart :chart-data="nftsMintedOverTime" />
        </div>
      </b-card>
    </div>
  </div>
</template>

<script>

import {
  BCard,
  BCardText,
  BTabs,
  BTab
} from "bootstrap-vue";

import LineChart from './charts/LineChart'
import DoughnutChart from './charts/DoughnutChart'

export default {
  name: "DataIndicators",
  components: {
    BCard,
    BCardText,
    BTabs,
    BTab,
    LineChart,
    DoughnutChart,
  },
  data() {
    return {
      allTypesData: {
        labels: [
          'Common',
          'Uncommon',
          'Rare',
          'Epic',
          'Platinum',
        ],
        datasets:[{
          label: 'yeet',
          data: [79, 59, 34, 20, 5], //SELECT count(rarity),rarity FROM cards GROUP BY rarity
          backgroundColor: [
            '#545161',
            '#2BA4FA',
            '#CA3C2C',
            '#5745E5',
            '#D3D3D3',
          ],
          hoverOffset: 2,
        }]
      },
      storeTypesData: {
        labels: [
          'Common',
          'Uncommon',
          'Rare',
          'Epic',
          'Platinum',
        ],
        datasets:[{
          label: 'yeet',
          data: [22, 15, 15, 6, 0], //SELECT count(rarity),rarity FROM cards GROUP BY rarity
          backgroundColor: [
            '#545161',
            '#2BA4FA',
            '#CA3C2C',
            '#5745E5',
            '#D3D3D3',
          ],
          hoverOffset: 2,
        }]
      },
      nftsMintedOverTime: {

      },
      options: {
        responsive: true,
      }
    }
  },
}
</script>

<style scoped lang="scss">
.card-container{
  margin-bottom: 10px;
}
.card-body {

  .chart-container {
    width: 350px;
    position: relative;
  }
}
</style>
