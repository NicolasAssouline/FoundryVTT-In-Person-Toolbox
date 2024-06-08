import { MobileTokenMovementControls } from './mobile-token-movement-controls.js';
import { DEBUG_MESSAGES_SETTING_NAME, MIN_HEIGHT_SETTING_NAME, MIN_WIDTH_SETTING_NAME, MODULE_NAME } from './constants.js';

Hooks.once('init', () => {
    game.settings.register(MODULE_NAME, MIN_WIDTH_SETTING_NAME, {
        name: "Minimum screen width (px)",
        hint: "The minimum screen width in pixels to trigger the mobile UI (set to 0 to disable condition)",
        scope: "world",
        config: true,
        default: 600,
        type: Number,
        requiresReload: true
    });

    game.settings.register(MODULE_NAME, MIN_HEIGHT_SETTING_NAME, {
        name: "Minimum screen height (px)",
        hint: "The minimum screen height in pixels to trigger the mobile UI (set to 0 to disable condition)",
        scope: "world",
        config: true,
        default: 0,
        type: Number,
        requiresReload: true
    });

    game.settings.register(MODULE_NAME, DEBUG_MESSAGES_SETTING_NAME, {
        name: "Write debug messages to the console",
        hint: "Write debug messages to the console to diagnose issues more easily. Turn off to reduce clutter",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });
})

Hooks.once('ready', () => {
    const minScreenWidth = game.settings.get(MODULE_NAME, MIN_WIDTH_SETTING_NAME);
    const minScreenHeight = game.settings.get(MODULE_NAME, MIN_HEIGHT_SETTING_NAME);

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
