import {
    SELECTION_OPTIONS,
    IN_COMBAT_FOCUS_SETTING,
    IN_COMBAT_SELECT_SETTING,
    MODULE_NAME,
} from "./constants.js";

function selectToken(token) {
    // enemy tokens don't need to be selected for player characters
    if (!game.user.isGM && !token.hasPlayerOwner) return;

    canvas.tokens.releaseAll();
    token.control();
}

async function focusToken(token) {
    // don't want to reveal locations of hidden tokens to players
    if (!game.user.isGM && !token.hasPlayerOwner && token.data.hidden) return;

    await canvas.animatePan({
        speed: 1500,
        easing: "easeInOutQuad",
        x: token.x + token.w / 2,
        y: token.y + token.h / 2,
    });
}

export async function updateActiveToken() {
    const selectActiveToken = game.settings.get(MODULE_NAME, IN_COMBAT_SELECT_SETTING);
    const focusActiveToken = game.settings.get(MODULE_NAME, IN_COMBAT_FOCUS_SETTING);

    const activeCombatant = game.combats?.active?.combatant;
    if (!activeCombatant) return;

    const activeToken = canvas.tokens.get(activeCombatant.tokenId);
    if (!activeToken) return;

    switch (selectActiveToken) {
        case SELECTION_OPTIONS.GM:
            if (game.user.isGM) selectToken(activeToken);
            break;
        case SELECTION_OPTIONS.Players:
            if (!game.user.isGM) selectToken(activeToken);
            break;
        case SELECTION_OPTIONS.Everyone:
            selectToken(activeToken);
            break;
    }

    switch (focusActiveToken) {
        case SELECTION_OPTIONS.GM:
            if (game.user.isGM) await focusToken(activeToken);
            break;
        case SELECTION_OPTIONS.Players:
            if (!game.user.isGM) await focusToken(activeToken);
            break;
        case SELECTION_OPTIONS.Everyone:
            await focusToken(activeToken);
            break;
    }
}

