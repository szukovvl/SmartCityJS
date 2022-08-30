import {
  WS_GAME_CONTROLLER_SERVICE
} from '~/assets/helpers'

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
  scenesData: []
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

//
export const mutations = {
  setConnetted (state, data) {
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
      default:
        /* eslint-disable no-console */
        console.warn('translateEvent - необработанное', data)
        /* eslint-enable no-console */
    }
  },
}

export const actions = {
  initializeGameController (context) {
    setTimeout(() => { wsGameController(this) }, 1000)
  },
}
