import { MobileTokenMovementControls } from './mobile-token-movement-controls.js';
import { updateActiveToken } from './combat-selection.js';
import {
    DEBUG_MESSAGES_SETTING, SELECTION_OPTIONS,
    IN_COMBAT_FOCUS_SETTING, IN_COMBAT_SELECT_SETTING,
    MIN_HEIGHT_SETTING,
    MIN_WIDTH_SETTING,
    MODULE_NAME
} from './constants.js';

Hooks.once('init', () => {
    game.settings.register(MODULE_NAME, MIN_WIDTH_SETTING, {
        name: "Minimum screen width (px)",
        hint: "The minimum screen width in pixels to trigger the mobile UI (set to 0 to disable condition)",
        scope: "world",
        config: true,
        default: 600,
        type: Number,
        requiresReload: true
    });

    game.settings.register(MODULE_NAME, MIN_HEIGHT_SETTING, {
        name: "Minimum screen height (px)",
        hint: "The minimum screen height in pixels to trigger the mobile UI (set to 0 to disable condition)",
        scope: "world",
        config: true,
        default: 0,
        type: Number,
        requiresReload: true
    });

    game.settings.register(MODULE_NAME, IN_COMBAT_FOCUS_SETTING, {
        name: "Auto focus active token in combat",
        scope: "world",
        config: true,
        choices: SELECTION_OPTIONS,
        default: SELECTION_OPTIONS.PLAYERS_ONLY,
        type: String,
    });

    game.settings.register(MODULE_NAME, IN_COMBAT_SELECT_SETTING, {
      name: "Auto select active token in combat",
      scope: "world",
      config: true,
      choices: SELECTION_OPTIONS,
      default: SELECTION_OPTIONS.EVERYONE,
      type: String,
    });

    game.settings.register(MODULE_NAME, DEBUG_MESSAGES_SETTING, {
        name: "Write debug messages to the console",
        hint: "Write debug messages to the console to diagnose issues more easily. Turn off to reduce clutter",
        scope: "world",
        config: true,
        default: false,
        type: Boolean,
    });
})

Hooks.once('ready', () => {
    const minScreenWidth = game.settings.get(MODULE_NAME, MIN_WIDTH_SETTING);
    const minScreenHeight = game.settings.get(MODULE_NAME, MIN_HEIGHT_SETTING);

    const isMobileDevice =
        (minScreenWidth > 0 || minScreenHeight > 0) &&
        (game.canvas.app.screen.width <= minScreenWidth || game.canvas.app.screen.height <= minScreenHeight);

    new Dialog({
        title: 'Mobile Token Movement',
        content: game.i18n.localize('MobileTokenMovement.dialog.content'),
        buttons: {
            yes: {
                label: game.i18n.localize('MobileTokenMovement.dialog.yes'),
                icon: '<i class="fas fa-mobile-alt"></i>',
                callback: () => {
                    $('body').toggleClass('enable-mobile-token-movement-ui', true)
                    new MobileTokenMovementControls().render(true)
                }
            },
            no: {
                label: game.i18n.localize('MobileTokenMovement.dialog.no'),
                icon: '<i class="fa fa-ban"></i>',
                callback: () => {}
            }
        }
    }).render(isMobileDevice);
});

Hooks.on('updateCombat', updateActiveToken);
