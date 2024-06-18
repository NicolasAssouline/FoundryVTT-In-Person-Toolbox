import {
    SELECTION_OPTIONS,
    IN_COMBAT_FOCUS_SETTING,
    IN_COMBAT_SELECT_SETTING,
    MODULE_NAME,
    DEBUG_MESSAGES_SETTING
} from "./constants.js";

const DEBUG_MESSAGES = game.settings.get(MODULE_NAME, DEBUG_MESSAGES_SETTING);

function selectToken(token) {
    // enemy tokens don't need to be selected for player characters
    if (!game.user.isGM && !token.hasPlayerOwner) return;

    canvas.tokens.releaseAll();
    canvas.tokens.selectObjects([token]);
}

async function focusToken(token) {
    await canvas.animatePan({
        duration: 150,
        x: token.x + token.w / 2,
        y: token.y + token.h / 2,
        scale: canvas.scene._viewPosition.scale,
    });
}

export async function updateActiveToken() {
    const selectActiveToken = game.settings.get(MODULE_NAME, IN_COMBAT_SELECT_SETTING);
    const focusActiveToken = game.settings.get(MODULE_NAME, IN_COMBAT_FOCUS_SETTING);

    const activeToken = game.combats?.active?.combatant?.token;

    if (DEBUG_MESSAGES) {
        console.info(`Selection options: ${selectActiveToken}`);
        console.info(`Focus options: ${focusActiveToken}`);
        console.info(`Active token: ${JSON.stringify(activeToken)}`);
    }

    if (!activeToken) return;

    switch (selectActiveToken) {
        case SELECTION_OPTIONS.DM_ONLY:
            if (game.user.isGM) selectToken(activeToken);
            break;
        case SELECTION_OPTIONS.PLAYERS_ONLY:
            if (!game.user.isGM) selectToken(activeToken);
            break;
        case SELECTION_OPTIONS.EVERYONE:
            selectToken(activeToken);
            break;
    }

    switch (focusActiveToken) {
        case SELECTION_OPTIONS.DM_ONLY:
            if (game.user.isGM) await focusToken(activeToken);
            break;
        case SELECTION_OPTIONS.PLAYERS_ONLY:
            if (!game.user.isGM) await focusToken(activeToken);
            break;
        case SELECTION_OPTIONS.EVERYONE:
            await focusToken(activeToken);
            break;
    }
}

