import { MobileTokenMovementControls } from './mobile-token-movement-controls.js'

const moduleName = "mobile-token-movement";
const minWidthSettingName = 'min-width'

Hooks.once('init', () => {
	game.settings.register(moduleName, minWidthSettingName, {
		name: "Minimum screen width (px)",
		hint: "The minimum screen width in pixels to trigger the mobile UI",
		scope: "world",
		config: true,
		default: 600,
		type: Number,
        requiresReload: true
	});
})

Hooks.once('ready', () => {
  const minScreenWidth = game.settings.get(moduleName, minWidthSettingName)

  const isMobileDevice = game.canvas.app.screen.width <= minScreenWidth
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
