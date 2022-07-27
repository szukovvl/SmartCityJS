//
/* export const CONSUMER_BY_TYPES = [
  { text: '1-й категории', value: 'HOSPITAL' },
  { text: '2-й категории', value: 'INDUSTRY' },
  { text: '3-й категории', value: 'DISTRICT' }
] */

/* export const ALTERNATION_BY_TYPES = [
  { text: 'солнечная', value: 'SOLAR' },
  { text: 'ветровая', value: 'WIND' }
] */

export const GAME_COMPONENT_ES_TYPES = [
  { text: 'потребители', value: 'CONSUMER' },
  { text: 'генераторы', value: 'GENERATOR' },
  { text: 'хранение', value: 'STORAGE' },
  { text: 'альтернативная энергетика', value: 'GREEGENERATOR' }
]

//
const REST_API_URL = '/api'
export const API_ENERGY_SERVICE_FIND = REST_API_URL + '/energy/find'
