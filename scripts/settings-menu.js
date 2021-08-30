import { MODULE_NAME, MODULE_TITLE, SETTINGS } from './config.js'

export class SettingsMenu extends Application {
  constructor(options = {}) {
    super(options);
  }

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      id: MODULE_NAME,
      title: MODULE_TITLE,
      template: `./modules/${MODULE_NAME}/templates/settings-menu.html`,
      width: 250,
      popOut: true
    });
  }

  getData(options) {
    const globalData = game.settings.get(MODULE_NAME, SETTINGS.GlobalData)
    const players = game.users
      .filter(u => u.id !== game.user.id && !u.isGM)
      .map(({ id, name }) => mergeObject({
        id, name, mobile: false
      }, globalData[id] || {}))

    return {
      players: players
    }
  }

  saveData() {
    let globalData = game.settings.get(MODULE_NAME, SETTINGS.GlobalData)
    $('tbody tr', this.element).each(function () {
      let id = this.dataset.itemId;
      let data = globalData[id] || {};
      data.mobile = $('input', this).is(':checked');
      globalData[id] = data;
    })

    game.settings.set(MODULE_NAME, SETTINGS.GlobalData, globalData)
      .then(() => {
        let socket = socketlib.registerModule(MODULE_NAME)
        socket.executeForEveryone('updatePlayer')
      })

    this.close()
  }

  activateListeners(html) {
    super.activateListeners(html);
    $('.dialog-buttons.save', html).click($.proxy(this.saveData, this))
  }
}
