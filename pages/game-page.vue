<template>
  <v-stepper
    v-model="gamestep"
    flat
  >
    <v-stepper-header>
      <v-stepper-step
        :complete="sceneNumber > 1"
        step="1"
      >
        регистрация
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="sceneNumber > 2"
        step="2"
      >
        присоединение потребителей
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="sceneNumber > 3"
        step="3"
      >
        подготовка к аукциону
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="sceneNumber > 4"
        step="4"
      >
        аукцион
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="sceneNumber > 6"
        step="6"
      >
        схемы ЭС
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="sceneNumber > 7"
        step="7"
      >
        анализ
      </v-stepper-step>

      <v-divider />

      <v-stepper-step step="8">
        игра
      </v-stepper-step>
    </v-stepper-header>

    <v-stepper-items>
      <v-stepper-content step="1">
        <GameWelcomComponent />
      </v-stepper-content>

      <v-stepper-content step="2">
        <FacilitiesESComponent />
      </v-stepper-content>

      <v-stepper-content step="3">
        <AuctionLotsViewer />
      </v-stepper-content>

      <v-stepper-content step="4">
        <h1>4</h1>
      </v-stepper-content>

      <v-stepper-content step="5">
        <h1>5</h1>
      </v-stepper-content>

      <v-stepper-content step="6">
        <h1>6</h1>
      </v-stepper-content>

      <v-stepper-content step="7">
        <h1>7</h1>
      </v-stepper-content>

      <v-stepper-content step="8">
        <h1>8</h1>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import GameWelcomComponent from '~/components/game/welcome.vue'
import FacilitiesESComponent from '~/components/game/facilities-es.vue'
import AuctionLotsViewer from '~/components/game/auction-lots.vue'

export default {
  name: 'GamePage',

  components: {
    GameWelcomComponent,
    FacilitiesESComponent,
    AuctionLotsViewer
  },

  layout: 'game',

  data: () => ({
    gamestep: 0
  }),

  computed: {
    sceneNumber () {
      return this.$store.state.sceneNumber
    }
  },

  watch: {
    sceneNumber (v) {
      this.gamestep = v
      if (v === 0) {
        this.$router.replace('/')
      }
    }
  },

  created () {
    if (process.client) {
      this.gamestep = this.sceneNumber
      if (this.$store.state.scenesData.length === 0) {
        this.$store.dispatch('loadGameData')
      }
    }
  },

  methods: {
  }
}
</script>
