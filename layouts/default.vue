<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',

  data: () => ({
  }),

  computed: {
    isConnected () {
      return this.$store.state.isConnected
    }
  },

  watch: {
    isConnected (v) {
      if (v) {
        this.$store.dispatch('setGamerMode')
      }
    }
  },

  created () {
    if (process.client) {
      this.$store.dispatch('initializeGameController')
    }
  }
}
</script>
