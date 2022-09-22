<template>
  <div>
    <div class="text-subtitle-1 teal darken-4 px-2 py-1 white--text">
      Лоты
    </div>
    <v-card
      v-if="generators.length !== 0"
      flat
    >
      <v-card-subtitle>Генераторы</v-card-subtitle>
      <div class="d-flex flex-wrap">
        <GeneratorCardComponent
          v-for="item in generators"
          :key="item.identy"
          :generator="item"
        />
      </div>
    </v-card>

    <v-card
      v-if="storages.length !== 0"
      flat
    >
      <v-card-subtitle>Хранение</v-card-subtitle>
      <div class="d-flex flex-wrap">
        <StorageCardComponent
          v-for="item in storages"
          :key="item.identy"
          :generator="item"
        />
      </div>
    </v-card>

    <v-card
      v-if="greengeneators.length !== 0"
      flat
    >
      <v-card-subtitle>Альтернативная генерация</v-card-subtitle>
      <div
        v-for="item in greengeneators"
        :key="item.itemgroup.value"
      >
        <div class="text-subtitle-2 white--text light-green accent-4 px-2 py-1 d-inline-flex">
          {{ item.itemgroup.text }}
        </div>
        <div class="d-flex flex-wrap">
          <component
            :is="tempates[element.data.generation_type]"
            v-for="element in item.items"
            :key="element.identy"
            :generator="element"
          />
        </div>
      </div>
    </v-card>

    <p v-if="notFound">
      элементы генерации не найдены
    </p>
  </div>
</template>

<script>
import GeneratorCardComponent from '~/components/viewers/generator-card.vue'
import StorageCardComponent from '~/components/viewers/storage-card.vue'
import SolarCardComponent from '~/components/viewers/solar-card.vue'
import WindCardComponent from '~/components/viewers/wind-card.vue'
import GenerationShortCard from '~/components/viewers/generation-short-card.vue'
import {
  ESO_GREEGENERATOR_TYPE,
  ESO_STORAGE_TYPE,
  ESO_GENERATOR_TYPE,
  ALTERNATION_BY_TYPES
} from '~/assets/helpers'

export default {
  name: 'AuctionLotsViewer',

  components: {
    GeneratorCardComponent,
    StorageCardComponent,
    SolarCardComponent,
    WindCardComponent,
    GenerationShortCard
  },

  data: () => ({
    tempates: {
      SOLAR: SolarCardComponent,
      WIND: WindCardComponent
    }
  }),

  computed: {
    auctionLots () {
      return this.$store.state.auction !== undefined && this.$store.state.auction.lots !== undefined
        ? this.$store.state.auction.lots
        : []
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
    generators () {
      return this.resourceGenerators.filter(e => this.auctionLots.includes(e.devaddr))
    },
    greengeneators () {
      return ALTERNATION_BY_TYPES.map(e => ({
        itemgroup: e,
        items: this.resourceAlternations.filter(el => el.data.generation_type === e.value && this.auctionLots.includes(el.devaddr))
      })).filter(e => e.items.length !== 0)
    },
    storages () {
      return this.resourceStorages.filter(e => this.auctionLots.includes(e.devaddr))
    },
    notFound () {
      return this.generators.length === 0 &&
      this.storages.length === 0 &&
      this.greengeneators.length === 0
    }
  }
}
</script>
