import { MobileTokenMovementControls } from './mobile-token-movement-controls.js'

Hooks.once('ready', () => {
  const isMobileDevice = game.canvas.app.screen.width <= 600 || game.canvas.app.screen.height <= 600
  new Dialog({
    title: 'Mobile Token Movement',
    content: game.i18n.localize('MobileTokenMovement.dialog.content'),
    buttons: {
      cancel: {
        label: game.i18n.localize('MobileTokenMovement.dialog.cancel'),
        icon: '<i class="fa fa-ban"></i>',
        callback: () => {}
      },
      enable: {
        label: game.i18n.localize('MobileTokenMovement.dialog.enable'),
        icon: '<i class="fas fa-mobile-alt"></i>',
        callback: () => {
          $('body').toggleClass('enable-mobile-token-movement-ui', true)
          new MobileTokenMovementControls().render(true)
        }
      }
    }
  }).render(isMobileDevice)
})
