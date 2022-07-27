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
        ООО «Новатор Лаб»
      </a>, {{ new Date().getFullYear() }}
      <v-spacer />
      <v-icon
        v-if="connectionFail"
        class="red pa-1"
        size="14"
        color="white"
      >
        mdi-connection
      </v-icon>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'GameLayout',

  data: () => ({
    connectionFail: false
  })
}
</script>
