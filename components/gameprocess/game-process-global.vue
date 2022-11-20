<template>
  <v-row class="mt-2">
    <div v-if="$store.state.hasGamer">
      <div class="d-flex align-center text-subtitle-1 teal darken-4 px-2 py-1 white--text">
        <div>&nbsp;</div>
        <v-spacer />
        <div
          v-if="getGameSeconds(onegamer.root.address) !== 0"
        >
          <v-icon
            small
            dark
          >
            mdi-alarm
          </v-icon>
          {{ secondsAsString(getGameSeconds(onegamer.root.address)) }}
        </div>
      </div>
      <GamerAreaComponent :data="onegamer" />
    </div>
    <div v-else>
      <v-col
        v-for="(data, index) in scheme"
        :key="data.root.address"
      >
        <div class="d-flex align-center text-subtitle-1 teal darken-4 px-2 py-1 white--text">
          <div>
            {{ 'Игрок ' + (index + 1) }}
          </div>
          <v-spacer />
          <div
            v-if="getGameSeconds(data.root.address) !== 0"
          >
            <v-icon
              small
              dark
            >
              mdi-alarm
            </v-icon>
            {{ secondsAsString(getGameSeconds(data.root.address)) }}
          </div>
        </div>
        <GamerAreaComponent :data="data" />
      </v-col>
    </div>
  </v-row>
</template>

<script>
import GamerAreaComponent from '~/components/gameprocess/gamer-area.vue'

export default {
  name: 'GameGlobalComponent',

  components: { GamerAreaComponent },

  data: () => ({
  }),

  computed: {
    scheme () {
      const items = this.$store.state.prepareData
      return items !== undefined ? items : []
    },
    onegamer () {
      let item
      if (this.$store.state.hasGamer) {
        item = this.scheme.find(e => e.root.address === this.$store.state.gamerKey)
      }
      return item !== undefined ? item : { root: { address: 0 } }
    }
  },

  created () {
    if (process.client) {
      if (this.$store.state.prepareData.length === 0) {
        this.$store.dispatch('requestProcessData')
      }
    }
  },

  methods: {
    getGameSeconds (key) {
      const item = this.$store.state.datasets.find(e => e.key === key)
      return item !== undefined ? item.seconds : 0
    },
    secondsAsString (seconds) {
      const dataobj = new Date(0, 0, 0, 0, 0, 0)
      dataobj.setSeconds(seconds)
      return dataobj.toLocaleTimeString()
    }
  }
}
</script>
