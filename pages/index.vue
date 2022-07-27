<template>
  <div class="justify-center align-center pa-10">
    <v-img src="welcom.png" />
  </div>
</template>

<script>
export default {
  name: 'IndexPage',

  created () {
    setTimeout(() => this.Redirect(), 3000)
  },

  methods: {
    Redirect () {
      this.$router.replace('/game-page')
    }
  }
}
</script>
