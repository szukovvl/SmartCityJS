<template>
  <v-stepper
    v-model="step"
    flat
  >
    <v-stepper-header>
      <v-stepper-step
        :complete="step > 1"
        step="1"
      >
        регистрация
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step > 2"
        step="2"
      >
        объекты ЭС
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step > 3"
        step="3"
      >
        портфель
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step > 4"
        step="4"
      >
        договора
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step > 5"
        step="5"
      >
        аукцион
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step > 6"
        step="6"
      >
        схемы ЭС
      </v-stepper-step>

      <v-divider />

      <v-stepper-step
        :complete="step > 7"
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
        <FacilitiesESComponent :is-reload="gamestep === 1" />
      </v-stepper-content>

      <v-stepper-content step="3">
        <h1>3</h1>
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

export default {
  name: 'GamePage',

  components: {
    GameWelcomComponent,
    FacilitiesESComponent
  },

  layout: 'game',

  data: () => ({
    gamestep: 0
  }),

  computed: {
    step () {
      return this.gamestep + 1
    }
  },

  watch: {
  },

  created () {
    setTimeout(() => { this.repeat() }, 10000)
  },

  methods: {
    repeat () {
      this.gamestep++
      this.gamestep %= 8
      setTimeout(() => { this.repeat() }, 10000)
    }
  }
}
</script>
