//
import {
  WS_GAME_CONTROLLER_SERVICE,

  GAME_STATUS_NONE,
  GAME_STATUS_SCENE_1,

  GAME_EVENT_STATUS,
  GAME_EVENT_ERROR,
  GAME_EVENT_SCENE_IDENTIFY,
  GAME_EVENT_SCENES_DATA,
  GAME_EVENT_GAMER_ENTER
} from '~/assets/helpers'

//
const LS_GAMER_KEY = 'gamer_key'

//
let connection

function wsGameController (context) {
  connection = new WebSocket('ws://' + (location !== undefined ? location.host : '127.0.0.1') + WS_GAME_CONTROLLER_SERVICE)

  connection.onmessage = function (event) {
    context.commit('translateEvent', JSON.parse(event.data))
  }

  connection.onopen = () => {
    context.commit('setConnected', true)
  }

  connection.onerror = function (event) {
    connection = undefined
    context.commit('setConnected', false)
    /* eslint-disable no-console */
    console.error(event)
    /* eslint-enable no-console */
    connection.close()
  }

  connection.onclose = () => {
    connection = undefined
    context.commit('setConnected', false)
    /* eslint-disable no-console */
    console.warn('wsSocket контроллера игрового сервиса закрыт.')
    /* eslint-enable no-console */
    setTimeout(() => { wsGameController(context) }, 10000)
  }
}

function sendEventMessage (event, message) {
  if (connection !== undefined) {
    connection.send(JSON.stringify({
      type: event,
      payload: message
    }))
  }
}

//
export const state = () => ({
  isConnected: false,
  errorEvent: undefined,
  info: {
    administrationLocked: false,
    gamersCount: 0,
    guestsCount: 0
  },
  sceneNumber: 0,
  scenesData: [],
  hasGamer: false,
  gamerKey: undefined
})

//
function internalSetState (state, data) {
  state.info = {
    administrationLocked: data.data.administration,
    gamersCount: data.data.gamers,
    guestsCount: data.data.guests
  }
  state.gameStatus = data.data.status

  switch (state.gameStatus) {
    case GAME_STATUS_NONE:
      state.sceneNumber = 0
      break
    case GAME_STATUS_SCENE_1:
      state.sceneNumber = 1
      break
  }
}

function internalEnterGamerMode (state, data) {
  /* eslint-disable no-console */
  console.warn('GAME_EVENT_GAMER_ENTER', data)
  /* eslint-enable no-console */
}
//
export const mutations = {
  setConnected (state, data) {
    state.isConnected = data
    if (data) {
      state.errorEvent = undefined
    }
  },
  translateEvent (state, data) {
    state.errorEvent = undefined
    switch (data.type) {
      case GAME_EVENT_STATUS:
        internalSetState(state, data)
        break
      case GAME_EVENT_ERROR:
        state.errorEvent = data
        /* eslint-disable no-console */
        console.warn('GAME_EVENT_ERROR', data)
        /* eslint-enable no-console */
        break
      case GAME_EVENT_SCENE_IDENTIFY:
        state.sceneNumber = 1
        break
      case GAME_EVENT_SCENES_DATA:
        state.scenesData = data.data
        break
      case GAME_EVENT_GAMER_ENTER:
        internalEnterGamerMode(state, data)
        break
      default:
        /* eslint-disable no-console */
        console.warn('translateEvent - необработанное', data)
        /* eslint-enable no-console */
    }
  },
  setGamerMode (state, data) {
    if (!state.hasGamer) {
      sendEventMessage(GAME_EVENT_GAMER_ENTER, localStorage.getItem(LS_GAMER_KEY))
    }
  }
}

export const actions = {
  initializeGameController (context) {
    setTimeout(() => { wsGameController(this) }, 1000)
  },
  setGamerMode (context) {
    context.commit('setGamerMode')
  }
}
