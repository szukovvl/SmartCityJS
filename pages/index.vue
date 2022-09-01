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
    }
  },

  watch: {
    sceneNumber (newval, oldval) {
      if (oldval === 0) {
        if (newval !== 0) {
          this.$router.replace('/game-page')
        }
      }
    }
  },

  created () {
  },

  methods: {
  }
}
</script>
