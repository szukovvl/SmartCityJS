<template>
  <div class="justify-center align-center pa-10">
    <v-img src="welcom.png" />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',

  data: () => ({
  }),

  computed: {
    sceneNumber () {
      return this.$store.state.sceneNumber
    },
    hasGamer () {
      return this.$store.state.hasGamer
    }
  },

  watch: {
    sceneNumber (newval, oldval) {
      if (oldval === 0 && this.hasGamer) {
        if (newval !== 0) {
          this.$router.replace('/game-page')
        }
      }
    },
    hasGamer (v) {
      if (v && this.sceneNumber !== 0) {
        this.$router.replace('/game-page')
      }
    }
  },

  created () {
    if (process.client) {
      this.$store.dispatch('requestGameStatus')
    }
  },

  methods: {
  }
}
</script>
