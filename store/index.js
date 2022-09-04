//
import {
  WS_GAME_CONTROLLER_SERVICE,

  GAME_STATUS_NONE,
  GAME_STATUS_SCENE_1,

  GAME_EVENT_STATUS,
  GAME_EVENT_ERROR,
  GAME_EVENT_SCENE_IDENTIFY,
  GAME_EVENT_SCENES_DATA,
  GAME_EVENT_GAMER_ENTER,
  SCENE_EVENT_COMPLETTE_IDENTIFY
} from '~/assets/helpers'

//
const LS_GAMER_KEY = 'gamer_key'
const LS_GAMER_CARD = 'gamer_card'

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
    const lconn = connection
    connection = undefined
    context.commit('setConnected', false)
    /* eslint-disable no-console */
    console.error(event)
    /* eslint-enable no-console */
    lconn.close()
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
  gamerKey: undefined,
  scriptToken: undefined,
  gameStatus: GAME_STATUS_NONE,
  gamerCard: undefined
})

//
function internalSetState (state, data) {
  state.info = {
    administrationLocked: data.data.administration,
    gamersCount: data.data.gamers,
    guestsCount: data.data.guests
  }
  internalTranslateScene(state, data.data.status)
}

function internalTranslateScene (state, srvstatus) {
  state.gameStatus = srvstatus

  switch (state.gameStatus) {
    case GAME_STATUS_NONE:
      state.sceneNumber = 0
      break
    case GAME_STATUS_SCENE_1:
      state.sceneNumber = 1
      break
    default:
      /* eslint-disable no-console */
      console.warn('internalTranslateScene - необработанное', srvstatus)
      /* eslint-enable no-console */
  }
}

function internalEnterGamerMode (state, data) {
  internalTranslateScene(state, data.gameStatus)
  if (data.accept) {
    state.hasGamer = true
    state.scriptToken = data.token
    state.gamerKey = data.key

    localStorage.setItem(LS_GAMER_KEY, state.gamerKey)

    if (state.scenesData.length !== 0) {
      const idx = state.scenesData.findIndex(e => e.mainstation === state.gamerKey)
      if (idx >= 0) {
        state.scenesData[idx] = data.data
      }
    } else {
      state.scenesData.push(data.data)
    }

    const json = localStorage.getItem(LS_GAMER_CARD)
    if (json !== undefined && json != null) {
      state.gamerCard = JSON.parse(json)
    }
  } else {
    state.hasGamer = false
    state.scriptToken = undefined
    state.gamerKey = undefined
  }
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
        internalTranslateScene(state, GAME_STATUS_SCENE_1)
        break
      case GAME_EVENT_SCENES_DATA:
        state.scenesData = data.data
        break
      case GAME_EVENT_GAMER_ENTER:
        internalEnterGamerMode(state, data.data)
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
  },
  sceneIdentifyComplette (state, carddata) {
    localStorage.setItem(LS_GAMER_CARD, JSON.stringify(carddata))
    if (state.hasGamer) {
      sendEventMessage(SCENE_EVENT_COMPLETTE_IDENTIFY, JSON.stringify(carddata))
    }
  },
  clearErrorService (state) {
    state.errorEvent = undefined
  }
}

export const actions = {
  initializeGameController (context) {
    setTimeout(() => { wsGameController(this) }, 1000)
  },
  setGamerMode (context) {
    context.commit('setGamerMode')
  },
  sceneIdentifyComplette (context, data) {
    context.commit('sceneIdentifyComplette', data)
  },
  clearErrorService (context) {
    context.commit('clearErrorService')
  }
}
