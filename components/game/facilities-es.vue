<template>
  <div>
    <v-card flat>
      <v-card-subtitle>
        Подстанции
      </v-card-subtitle>
      <MainStationMonitorControl :mainstation="mainstation" />
      <SubstationCardControl :station="substation" />
    </v-card>
    <v-card
      v-if="aregiven.length !== 0"
      flat
    >
      <v-card-subtitle>
        Даны организатором
      </v-card-subtitle>
      <v-card-text class="d-flex flex-wrap">
        <div
          v-for="consumer in aregiven"
          :key="consumer.identy"
          class="d-flex flex-nowrap"
        >
          <ConsumerCardComponent :consumer="consumer" />
        </div>
      </v-card-text>
    </v-card>
    <v-card
      v-if="aregiven.length !== 0"
      flat
    >
      <v-card-subtitle>
        Доступные потребители
      </v-card-subtitle>
      <v-card-text
        v-if="availconsumers.length !== 0"
        class="ma-0 pa-0"
      >
        <div
          v-for="item in availconsumers"
          :key="item.itemgroup.value"
        >
          <div class="text-subtitle-2 teal lighten-5 pa-2 mb-2">
            Потребители {{ item.itemgroup.text }}
          </div>
          <div class="d-flex flex-wrap">
            <div
              v-for="consumer in item.items"
              :key="consumer.identy"
              class="d-flex flex-nowrap "
            >
              <ChooseConsumerCardComponent :consumer="consumer" />
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-text v-else>
        нет доступных потребителей
      </v-card-text>
    </v-card>
    <v-card
      v-if="aregiven.length !== 0"
      flat
    >
      <v-card-subtitle>
        Мой выбор
      </v-card-subtitle>
      <v-card-text
        v-if="mychoice.length !== 0"
        class="ma-0 pa-0"
      >
        <div
          v-for="item in mychoice"
          :key="item.itemgroup.value"
        >
          <div class="text-subtitle-2 teal lighten-5 pa-2 mb-2">
            Потребители {{ item.itemgroup.text }}
          </div>
          <div class="d-flex flex-wrap">
            <div
              v-for="consumer in item.items"
              :key="consumer.identy"
              class="d-flex flex-nowrap "
            >
              <RefuseConsumerCardComponent :consumer="consumer" />
            </div>
          </div>
        </div>
      </v-card-text>
      <v-card-text v-else>
        ничего не выбрано
      </v-card-text>
      <v-card-text class="d-flex justify-center">
        <v-btn
          class="ma-2"
          color="success"
          @click="doCompletted"
        >
          готово
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import MainStationMonitorControl from '~/components/viewers/main-station-monitor.vue'
import SubstationCardControl from '~/components/viewers/substation-card.vue'
import ConsumerCardComponent from '~/components/viewers/consumer-card.vue'
import ChooseConsumerCardComponent from '~/components/viewers/choose_consumer_card.vue'
import RefuseConsumerCardComponent from '~/components/viewers/refuse_consumer_card.vue'
import {
  ESO_MAINSTATION_TYPE,
  ESO_DISTRIBUTOR_TYPE,
  ESO_CONSUMER_TYPE,

  CONSUMER_BY_TYPES
} from '~/assets/helpers'

export default {
  name: 'FacilitiesESComponent',

  components: {
    MainStationMonitorControl,
    SubstationCardControl,
    ConsumerCardComponent,
    ChooseConsumerCardComponent,
    RefuseConsumerCardComponent
  },

  data: () => ({
  }),

  computed: {
    sceneData () {
      return this.$store.state.scenesData !== undefined
        ? this.$store.state.scenesData.find(e => e.mainstation === this.$store.state.gamerKey)
        : undefined
    },
    mainstation () {
      return this.$store.state.gameResources !== undefined && this.$store.state.gameResources[ESO_MAINSTATION_TYPE] !== undefined
        ? this.$store.state.gameResources[ESO_MAINSTATION_TYPE].find(e => e.devaddr === this.$store.state.gamerKey)
        : undefined
    },
    substation () {
      return this.sceneData !== undefined &&
        this.$store.state.gameResources !== undefined &&
        this.$store.state.gameResources[ESO_DISTRIBUTOR_TYPE] !== undefined
        ? this.$store.state.gameResources[ESO_DISTRIBUTOR_TYPE].find(e => e.devaddr === this.sceneData.substation)
        : undefined
    },
    aregiven () { // даны организатором
      return this.sceneData !== undefined &&
      this.sceneData.consumers !== undefined &&
      this.$store.state.gameResources !== undefined &&
      this.$store.state.gameResources[ESO_CONSUMER_TYPE] !== undefined
        ? this.$store.state.gameResources[ESO_CONSUMER_TYPE].filter(e => this.sceneData.consumers.includes(e.devaddr))
        : []
    },
    availconsumers () { // доступные для выбора
      const consumers = this.$store.state.gameResources
      const availitems = this.$store.state.choiceAll
      let res = []
      if (availitems !== undefined && consumers !== undefined && consumers[ESO_CONSUMER_TYPE] !== undefined) {
        res = CONSUMER_BY_TYPES.map(e => ({
          itemgroup: e,
          items: consumers[ESO_CONSUMER_TYPE].filter(el => availitems.includes(el.devaddr) && el.data.consumertype === e.value)
        }))
      }
      return res.filter(e => e.items.length !== 0)
    },
    mychoice () { // собственный выбор
      const choices = this.$store.state.gamerChoice
      const consumers = this.$store.state.gameResources
      let res = []
      if (choices !== undefined &&
        choices.items !== undefined &&
        consumers !== undefined &&
        consumers[ESO_CONSUMER_TYPE] !== undefined) {
        res = CONSUMER_BY_TYPES.map(e => ({
          itemgroup: e,
          items: consumers[ESO_CONSUMER_TYPE].filter(el => choices.items.includes(el.devaddr) && el.data.consumertype === e.value)
        }))
      }
      return res.filter(e => e.items.length !== 0)
    }
  },

  watch: {
  },

  created () {
    if (process.client) {
      this.$store.dispatch('checkGameController')
    }
  },

  methods: {
    doCompletted () {
    }
  }
}
</script>
