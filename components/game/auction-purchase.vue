<template>
  <v-card outlined>
    <div
      v-if="lot !== undefined"
      class="d-flex flex-wrap justify-space-around"
    >
      <v-card flat>
        <v-card-text v-if="hasGamer">
          <div>
            <v-btn
              v-if="lot !== undefined"
              class="ma-2"
              color="success"
              :disabled="!buyEnabled"
              @click="buyLot"
            >
              Купить
            </v-btn>
          </div>
        </v-card-text>
      </v-card>
      <v-card flat>
        <div v-if="oes !== undefined">
          <div class="d-flex flex-row">
            <h2 v-if="lotTime !== undefined">
              {{ lotTime }} сек.
            </h2>
            <v-spacer />
            <h2>
              {{ price }} руб.
            </h2>
          </div>
          <component
            :is="template"
            :generator="oes"
          />
        </div>
      </v-card>
    </div>
    <div v-else>
      <v-card-subtitle>
        лот не представлен
      </v-card-subtitle>
    </div>
  </v-card>
</template>

<script>
import SolarCardComponent from '~/components/viewers/solar-card.vue'
import WindCardComponent from '~/components/viewers/wind-card.vue'
import GeneratorCardComponent from '~/components/viewers/generator-card.vue'
import StorageCardComponent from '~/components/viewers/storage-card.vue'
import {
  ESO_GENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GREEGENERATOR_TYPE,
  ESO_GREENGENERATION_TYPE_SOLAR,

  roundToTwoAsStr
} from '~/assets/helpers'

export default {
  name: 'AuctionPurchase',

  components: {
    SolarCardComponent,
    WindCardComponent,
    GeneratorCardComponent,
    StorageCardComponent
  },

  data: () => ({
  }),

  computed: {
    lot () {
      return this.$store.state.auction.current
    },
    price () {
      return roundToTwoAsStr(this.lot !== undefined ? this.lot.price : 0)
    },
    settings () {
      return this.$store.state.auction.settings
    },
    hasGamer () {
      return this.$store.state.hasGamer
    },
    lotTime () {
      return this.lot !== undefined ? this.$store.state.lotTime : undefined
    },
    buyEnabled () {
      return this.$store.state.auction.buyer !== undefined && this.$store.state.auction.buyer !== this.$store.state.gamerKey
    },

    resourceGenerators () {
      const items = this.$store.state.gameResources[ESO_GENERATOR_TYPE]
      return items !== undefined ? items : []
    },
    resourceAlternations () {
      const items = this.$store.state.gameResources[ESO_GREEGENERATOR_TYPE]
      return items !== undefined ? items : []
    },
    resourceStorages () {
      const items = this.$store.state.gameResources[ESO_STORAGE_TYPE]
      return items !== undefined ? items : []
    },
    allGenerators () {
      return this.resourceGenerators.concat(this.resourceAlternations, this.resourceStorages)
    },
    oes () {
      return this.lot !== undefined ? this.allGenerators.find(e => e.devaddr === this.lot.key) : undefined
    },
    template () {
      if (this.oes !== undefined) {
        switch (this.oes.componentType) {
          case ESO_STORAGE_TYPE:
            return StorageCardComponent
          case ESO_GREEGENERATOR_TYPE: {
            if (this.oes.data.generation_type === ESO_GREENGENERATION_TYPE_SOLAR) {
              return SolarCardComponent
            }
            return WindCardComponent
          }
          default:
            return GeneratorCardComponent
        }
      }
      return undefined
    }
  },

  created () {
    if (process.client && this.settings === undefined) {
      this.$store.dispatch('loadAuctionData')
    }
  },

  methods: {
    buyLot () {
      this.$store.dispatch('auctionBuyLot')
    }
  }
}
</script>
