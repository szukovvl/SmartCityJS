<template>
  <div class="justify-center align-center pa-10">
    <v-img src="welcom.png" />
    <v-btn
      top
      right
      :href="adminPath"
      target="_blank"
      absolute
      text
      color="amber accent-4"
    >
      Администрирование
    </v-btn>
  </div>
</template>

<script>
import { ADMIN_PORT } from '~/assets/helpers'

export default {
  name: 'IndexPage',

  data: () => ({
    adminPath: '127.0.0.1'
  }),

  created () {
    if (!this.$isServer) {
      this.adminPath = location.protocol + '//' + location.hostname + ':' + ADMIN_PORT
    }
  },

  methods: {
  }
}
</script>
