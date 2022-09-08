<template>
  <v-card flat>
    <v-card-text>
      <v-text-field
        v-model="card.commandname"
        hint="название команды/игрока"
        persistent-hint
        dense
        placeholder="назови свою команду"
        filled
      />
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-textarea
        v-model="card.slogan"
        hint="девиз команды"
        persistent-hint
        placeholder="придумай правильный девиз и победи!"
        rows="2"
        auto-grow
        filled
      />
    </v-card-text>
    <v-divider v-if="card.partners.length !== 0" />
    <v-card-text v-if="card.partners.length !== 0">
      <div
        v-for="(item, index) in card.partners"
        :key="'part_' + index"
        class="d-flex flex-row align-center mr-2"
      >
        <div class="mr-2">
          {{ index + 1 }}.
        </div>
        <div class="mr-2">
          {{ item.role }}
        </div>
        <div class="mr-2">
          {{ item.name }}
        </div>
        <div class="mr-2">
          {{ item.youfrom }}
        </div>
        <div>
          <v-btn
            icon
            color="error"
            @click="doDeletePartner(index, item)"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <div class="d-flex flex-row align-center">
        <div class="mr-2">
          <b>Новый участник</b>
        </div>
        <div class="mr-2">
          <v-text-field
            v-model="newpartner.role"
            hint="роль"
            persistent-hint
            dense
          />
        </div>
        <div class="mr-2">
          <v-text-field
            v-model="newpartner.name"
            hint="имя участника"
            persistent-hint
            dense
            placeholder="имя участника"
          />
        </div>
        <div class="mr-2">
          <v-text-field
            v-model="newpartner.youfrom"
            hint="от куда ты"
            persistent-hint
            dense
            placeholder="от куда ты"
          />
        </div>
        <div v-if="namePresent">
          <v-btn
            icon
            color="primary"
            @click="doCreatePartner"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>
    </v-card-text>
    <v-divider />
    <v-card-text>
      <v-textarea
        v-model="card.notice"
        hint="дополнительно"
        persistent-hint
        placeholder="можно что-то написать..."
        auto-grow
        filled
      />
    </v-card-text>
    <v-card-text class="d-flex justify-center">
      <v-btn
        class="ma-2"
        color="success"
        :disabled="!complettedEnabled"
        @click="doCompletted"
      >
        готово
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'GameWelcomComponent',

  data: () => ({
    card: {
      commandname: undefined,
      slogan: undefined,
      partners: [],
      notice: undefined
    },
    newpartner: {
      role: undefined,
      name: undefined,
      youfrom: undefined
    },
    namePresent: false,
    complettedEnabled: false
  }),

  watch: {
    'newpartner.name' (v) {
      this.namePresent = v !== undefined && v.trim() !== ''
    },
    'card.commandname' (v) {
      this.complettedEnabled = v !== undefined && v.trim() !== ''
    }
  },

  created () {
    const gameCard = this.$store.state.gamerCard
    if (gameCard !== undefined) {
      this.card.commandname = gameCard.commandname
      this.card.slogan = gameCard.slogan
      this.card.notice = gameCard.notice
      this.card.partners = []
      if (gameCard.partners !== undefined) {
        gameCard.partners.forEach((element) => {
          this.card.partners.push({
            role: element.role,
            name: element.name,
            youfrom: element.youfrom
          })
        })
      }
    }
  },

  methods: {
    doCreatePartner () {
      this.card.partners.push(Object.assign({}, this.newpartner))
      this.newpartner.name = undefined
    },
    doCompletted () {
      /* eslint-disable no-console */
      console.log('карта завершенна', this.card)
      /* eslint-enable no-console */
      this.$store.dispatch('sceneIdentifyComplette', this.card)
    },
    doDeletePartner (index, data) {
      this.card.partners.splice(index, 1)
    }
  }
}
</script>
