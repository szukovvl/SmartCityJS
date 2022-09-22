//
import {
  WS_GAME_CONTROLLER_SERVICE,

  GAME_STATUS_NONE,
  GAME_STATUS_SCENE_1,
  GAME_STATUS_SCENE_2,
  GAME_STATUS_SCENE_3,
  GAME_STATUS_SCENE_4,

  GAME_EVENT_STATUS,
  GAME_EVENT_ERROR,
  GAME_EVENT_SCENE_IDENTIFY,
  GAME_EVENT_SCENES_DATA,
  GAME_EVENT_GAMER_ENTER,
  SCENE_EVENT_COMPLETTE_IDENTIFY,
  GAME_EVENT_SCENE_CHOICE,
  GAME_EVENT_CAPTURE_OES,
  GAME_EVENT_REFUSE_OES,
  GAME_EVENT_SCENE_AUCTION_PREPARE,
  GAME_EVENT_SCENE_AUCTION,
  GAME_EVENT_SCENE_AUCTION_SALE,
  GAME_EVENT_SCENE_AUCTION_TIME_LOT,

  ENERGYSYSTEM_OBJECT_TYPES,

  API_ENERGY_SERVICE_FIND,
  API_TARIFFS_SERVICE
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
    internalLoadGameResources(context)
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

function initGameResources () {
  const res = { }
  ENERGYSYSTEM_OBJECT_TYPES.forEach(e => (res[e.value] = []))
  return res
}

//
function internalLoadGameResources (context) {
  ENERGYSYSTEM_OBJECT_TYPES.forEach(item =>
    context.$axios.$get(API_ENERGY_SERVICE_FIND + '/' + item.value, { progress: false })
      .then((v) => {
        context.commit('setGameResources', { type: item.value, data: v })
      })
      .catch((error) => {
        let msg
        if (error.response) {
          msg = 'ошибка ' + error.response.status + ': ' + error.response.data
        } else {
          msg = 'ошибка REST API'
        }
        /* eslint-disable no-console */
        console.error(msg)
        /* eslint-enable no-console */
      })
  )

  context.$axios.$get(API_TARIFFS_SERVICE, { progress: false })
    .then((v) => {
      context.commit('setTariffsData', v)
    })
    .catch((error) => {
      let msg
      if (error.response) {
        msg = 'ошибка ' + error.response.status + ': ' + error.response.data
      } else {
        msg = 'ошибка REST API'
      }
      /* eslint-disable no-console */
      console.error(msg)
      /* eslint-enable no-console */
    })
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
  lotTime: 0,
  scenesData: [],
  hasGamer: false,
  gamerKey: undefined,
  scriptToken: undefined,
  gameStatus: GAME_STATUS_NONE,
  gamerCard: undefined,
  gameResources: initGameResources(),
  tariffs: undefined,
  choiceAll: [],
  gamerChoice: [],
  auction: {}
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
    case GAME_STATUS_SCENE_2:
      state.sceneNumber = 2
      break
    case GAME_STATUS_SCENE_3:
      state.sceneNumber = 3
      break
    case GAME_STATUS_SCENE_4:
      state.sceneNumber = 4
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
        if (state.hasGamer && data.data.status === GAME_STATUS_SCENE_2 && state.choiceAll.length === 0) {
          sendEventMessage(GAME_EVENT_SCENE_CHOICE)
        }
        break
      case GAME_EVENT_ERROR:
        state.errorEvent = data
        /* eslint-disable no-console */
        console.warn('GAME_EVENT_ERROR', data)
        /* eslint-enable no-console */
        break
      case GAME_EVENT_SCENES_DATA:
        state.scenesData = data.data
        break
      case GAME_EVENT_GAMER_ENTER:
        internalEnterGamerMode(state, data.data)
        break
      case GAME_EVENT_SCENE_IDENTIFY:
        internalTranslateScene(state, GAME_STATUS_SCENE_1)
        internalLoadGameResources(this)
        break
      case GAME_EVENT_SCENE_CHOICE:
        state.choiceAll = data.data.items
        state.gamerChoice = data.data.gamers !== undefined
          ? data.data.gamers.find(e => e.key === state.gamerKey)
          : []
        internalTranslateScene(state, GAME_STATUS_SCENE_2)
        break
      case GAME_EVENT_SCENE_AUCTION_PREPARE:
        state.auction = data.data
        internalTranslateScene(state, GAME_STATUS_SCENE_3)
        break
      case GAME_EVENT_SCENE_AUCTION:
        state.auction = data.data
        internalTranslateScene(state, data.data.status)
        break
      case GAME_EVENT_SCENE_AUCTION_SALE:
        state.auction = data.data
        internalTranslateScene(state, GAME_STATUS_SCENE_4)
        break
      case GAME_EVENT_SCENE_AUCTION_TIME_LOT:
        state.lotTime = data.data
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
  },
  loadGameData (state) {
    sendEventMessage(GAME_EVENT_SCENES_DATA)
  },
  setGameResources (state, data) {
    state.gameResources[data.type] = data.data
  },
  setTariffsData (state, data) {
    state.tariffs = data
  },
  captureOes (state, data) {
    sendEventMessage(GAME_EVENT_CAPTURE_OES, data)
  },
  refuseOes (state, data) {
    sendEventMessage(GAME_EVENT_REFUSE_OES, data)
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
  },
  loadGameData (context) {
    if (connection !== undefined) {
      context.commit('loadGameData')
    } else {
      wsGameController(this)
    }
  },
  checkGameController (context) {
    if (connection === undefined) {
      wsGameController(this)
    }
  },
  captureOes (context, data) {
    context.commit('captureOes', data)
  },
  refuseOes (context, data) {
    context.commit('refuseOes', data)
  }
}
