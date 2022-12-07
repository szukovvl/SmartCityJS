<template>
  <v-app>
    <v-app-bar
      class="justify-space-between"
      app
      clipped-right
      clipped-left
    >
      <v-img
        class="mr-4"
        src="logo-rus.png"
        max-height="50"
        max-width="128"
        contain
        alt="SmartCityJS"
      />

      <v-toolbar-title v-if="titleText !== undefined">
        {{ titleText }}
      </v-toolbar-title>

      <v-spacer />
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>

    <v-footer
      style="font-size:10pt"
      app
      outlined
    >
      <a
        href="http://new.novatorlab.ru/"
        target="_blank"
        rel="noopener noreferrer"
      >
        ООО «Рекуп Энерго»
      </a>, {{ new Date().getFullYear() }}
      <v-spacer />
      <v-icon
        v-if="!isConnected"
        class="red pa-1"
        size="14"
        color="white"
      >
        mdi-connection
      </v-icon>
    </v-footer>

    <v-snackbar
      v-model="hasServiceError"
      :timeout="-1"
      color="error"
    >
      {{ errorMessage }}
      <template #action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="clearServiceErrors"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
export default {
  name: 'GameLayout',

  data: () => ({
    hasServiceError: false
  }),

  computed: {
    isConnected () {
      return this.$store.state.isConnected
    },
    servicesError () {
      return this.$store.state.errorEvent
    },
    errorMessage () {
      return this.$store.state.errorEvent !== undefined
        ? this.$store.state.errorEvent.data.errorMessage
        : 'Ошибка сервиса'
    },
    gamerCard () {
      return this.$store.state.gamerCard !== undefined ? this.$store.state.gamerCard : { }
    },
    titleText () {
      return this.gamerCard.commandname
    }
  },

  watch: {
    isConnected (v) {
      if (v) {
        this.$store.dispatch('setGamerMode')
      }
    },
    servicesError () {
      this.hasServiceError = this.$store.state.errorEvent !== undefined
    }
  },

  methods: {
    clearServiceErrors () {
      this.$store.dispatch('clearErrorService')
    }
  }
}
</script>
