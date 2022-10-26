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
        :complete="sceneNumber > 5"
        step="5"
      >
        схема ЭС
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="sceneNumber > 6"
        step="6"
      >
        анализ
      </v-stepper-step>

      <v-divider />

      <v-stepper-step step="7">
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
        <AuctionPurchase />
        <div class="text-subtitle-1 teal darken-4 mt-2 px-2 py-1 white--text">
          Приобретенные объекты генерации
        </div>
        <AuctionGamerLots />
      </v-stepper-content>

      <v-stepper-content step="5">
        <SchemesPreparation />
      </v-stepper-content>

      <v-stepper-content step="6">
        <h1>6</h1>
      </v-stepper-content>

      <v-stepper-content step="7">
        <h1>7</h1>
      </v-stepper-content>
    </v-stepper-items>
  </v-stepper>
</template>

<script>
import GameWelcomComponent from '~/components/game/welcome.vue'
import FacilitiesESComponent from '~/components/game/facilities-es.vue'
import AuctionLotsViewer from '~/components/game/auction-lots.vue'
import AuctionPurchase from '~/components/game/auction-purchase.vue'
import AuctionGamerLots from '~/components/viewers/auction-gamer-lots.vue'
import SchemesPreparation from '~/components/game/schema-preparation.vue'

export default {
  name: 'GamePage',

  components: {
    GameWelcomComponent,
    FacilitiesESComponent,
    AuctionLotsViewer,
    AuctionPurchase,
    AuctionGamerLots,
    SchemesPreparation
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
