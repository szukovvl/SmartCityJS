<template>
  <div>
    <v-card flat>
      <v-card-subtitle>
        Подстанции
      </v-card-subtitle>
      <MainStationMonitorControl :mainstation="mainstation" />
      <SubstationCardControl :station="substation" />
    </v-card>
    <v-card
      v-if="aregiven.length !== 0"
      flat
    >
      <v-card-subtitle>
        Даны организатором
      </v-card-subtitle>
      <v-card-text class="d-flex flex-wrap">
        <div
          v-for="consumer in aregiven"
          :key="consumer.identy"
          class="d-flex flex-nowrap"
        >
          <ConsumerCardComponent :consumer="consumer" />
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import MainStationMonitorControl from '~/components/viewers/main-station-monitor.vue'
import SubstationCardControl from '~/components/viewers/substation-card.vue'
import ConsumerCardComponent from '~/components/viewers/consumer-card.vue'
import {
  ESO_MAINSTATION_TYPE,
  ESO_DISTRIBUTOR_TYPE,
  ESO_CONSUMER_TYPE
} from '~/assets/helpers'

export default {
  name: 'FacilitiesESComponent',

  components: {
    MainStationMonitorControl,
    SubstationCardControl,
    ConsumerCardComponent
  },

  data: () => ({
  }),

  computed: {
    sceneData () {
      return this.$store.state.scenesData !== undefined
        ? this.$store.state.scenesData.find(e => e.mainstation === this.$store.state.gamerKey)
        : undefined
    },
    mainstation () {
      return this.$store.state.gameResources !== undefined && this.$store.state.gameResources[ESO_MAINSTATION_TYPE] !== undefined
        ? this.$store.state.gameResources[ESO_MAINSTATION_TYPE].find(e => e.devaddr === this.$store.state.gamerKey)
        : undefined
    },
    substation () {
      return this.sceneData !== undefined &&
        this.$store.state.gameResources !== undefined &&
        this.$store.state.gameResources[ESO_DISTRIBUTOR_TYPE] !== undefined
        ? this.$store.state.gameResources[ESO_DISTRIBUTOR_TYPE].find(e => e.devaddr === this.sceneData.substation)
        : undefined
    },
    aregiven () { // даны организатором
      return this.sceneData !== undefined &&
      this.sceneData.consumers !== undefined &&
      this.$store.state.gameResources !== undefined &&
      this.$store.state.gameResources[ESO_CONSUMER_TYPE] !== undefined
        ? this.$store.state.gameResources[ESO_CONSUMER_TYPE].filter(e => this.sceneData.consumers.includes(e.devaddr))
        : []
    }
  },

  watch: {
  },

  created () {
  },

  methods: {
  }
}
</script>
