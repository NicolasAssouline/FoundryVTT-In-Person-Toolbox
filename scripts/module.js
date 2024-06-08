import {MobileTokenMovementControls} from './mobile-token-movement-controls.js'

const moduleName = "mobile-token-movement";
const minWidthSettingName = 'min-width'
const minHeightSettingName = 'min-height'

Hooks.once('init', () => {
    game.settings.register(moduleName, minWidthSettingName, {
        name: "Minimum screen width (px)",
        hint: "The minimum screen width in pixels to trigger the mobile UI (set to 0 to disable condition)",
        scope: "world",
        config: true,
        default: 600,
        type: Number,
        requiresReload: true
    });

    game.settings.register(moduleName, minHeightSettingName, {
        name: "Minimum screen height (px)",
        hint: "The minimum screen height in pixels to trigger the mobile UI (set to 0 to disable condition)",
        scope: "world",
        config: true,
        default: 0,
        type: Number,
        requiresReload: true
    });
})

Hooks.once('ready', () => {
    const minScreenWidth = game.settings.get(moduleName, minWidthSettingName);
    const minScreenHeight = game.settings.get(moduleName, minHeightSettingName);

    const isMobileDevice =
        (minScreenWidth > 0 || minScreenHeight > 0) &&
        (game.canvas.app.screen.width <= minScreenWidth || game.canvas.app.screen.height <= minScreenHeight);

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
    }).render(isMobileDevice);
});
