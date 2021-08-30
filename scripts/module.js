import { SettingsMenu } from './settings-menu.js'
import { MODULE_LAYER, MODULE_NAME, MODULE_TITLE, SETTINGS } from './config.js'
import { MobileControls } from './mobile-controls.js'

let socket
let controls = new MobileControls()

const updatePlayer = () => {
  const newPlayerSettings = game.settings.get(MODULE_NAME, SETTINGS.GlobalData)[game.user.id]
  game.settings.set(MODULE_NAME, SETTINGS.PlayerData, newPlayerSettings)
  $('body').toggleClass('enable-mobile-token-movement-ui', newPlayerSettings?.mobile)
  controls.render(true)
}

Hooks.once('init', () => {
  game.settings.register(MODULE_NAME, SETTINGS.GlobalData, {
    name: '',
    hint: '',
    scope: "world",
    config: false,
    default: {},
    type: Object,
  })
  game.settings.register(MODULE_NAME, SETTINGS.PlayerData, {
    name: '',
    hint: '',
    scope: "client",
    config: false,
    default: {},
    type: Object,
  })
})

Hooks.once('socketlib.ready', () => {
  socket = socketlib.registerModule(MODULE_NAME)
  socket.register('updatePlayer', updatePlayer)
})

Hooks.once('ready', () => {
  socket.executeForEveryone('updatePlayer')
})

Hooks.on('canvasReady', () => {
  controls.render(true)
})

// Register button in scene controls
Hooks.on('getSceneControlButtons', async controls => {
  controls.find(c => c.name === 'token').tools.push({
    name: MODULE_NAME,
    title: MODULE_TITLE,
    icon: 'fas fa-mobile-alt',
    visible: game.user.isGM,
    layer: MODULE_LAYER,
    onClick: () => { new SettingsMenu().render(true) },
  })
})
