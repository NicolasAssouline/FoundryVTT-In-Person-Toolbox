export class MobileTokenMovementControls extends Application {
    VIEWPOINT_PAN_THRESHOLD_MULTIPLIER = 2;
    tokenCycleIndex = 0;


    constructor(options = {}) {
        super(options);
    }

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            template: `./modules/mobile-token-movement/templates/mobile-token-movement-controls.html`, popOut: false,
        });
    }

    getToken = () => {
        if (canvas.tokens.controlled.length === 0) {
            ui.notifications.warn(game.i18n.localize('MobileTokenMovement.warn.noTokenSelected'));
            return;
        }

        this.clipCycleIndexValue();
        return canvas.tokens.controlled[this.tokenCycleIndex];
    };

    async move(x, y) {
        const t = this.getToken();
        if (!t) return;

        const newPoint = {x: t.x + t.w * x, y: t.y + t.h * y};
        console.info(`Attempting to move token from (${t.x}, ${t.y}) to ${JSON.stringify(newPoint)}, Collision: ${t.checkCollision(newPoint)}`);

        if (!t.checkCollision(newPoint) && t.document.canUserModify(game.user, "update")) {
            await t.document.update(newPoint);
            await canvas.animatePan({
                duration: 250,
                x: Math.round(newPoint.x + t.w / 2),
                y: Math.round(newPoint.y + t.h / 2),
                scale: canvas.scene._viewPosition.scale,
            });
        }
    }

    selectToken = async () => {

        if (this.isViewCentered()) {
            this.cycleActiveToken();
        }

        const t = this.getToken();
        if (!t) return;

        await canvas.animatePan({
            duration: 150,
            x: t.x + t.w / 2,
            y: t.y + t.h / 2,
            scale: canvas.scene._viewPosition.scale,
        })
    };

    isViewCentered = () => {
        const currentViewPosition = canvas.scene._viewPosition;

        const token = this.getToken();
        if (!token) return true;

        const tokenX = token.x + token.w / 2;
        const tokenY = token.y + token.h / 2;

        const viewCenterToTokenDistance = this.calculatePointDistance(currentViewPosition.x, currentViewPosition.y, tokenX, tokenY);
        return viewCenterToTokenDistance < Math.max(token.w, token.h) * this.VIEWPOINT_PAN_THRESHOLD_MULTIPLIER;
    };

    calculatePointDistance = (x1, y1, x2, y2) => {
        const x = x2 - x1;
        const y = y2 - y1;

        return Math.sqrt(x * x + y * y);
    };

    cycleActiveToken = () => {
        if (++this.tokenCycleIndex >= canvas.tokens.controlled.length) {
            this.tokenCycleIndex = 0;
        }
    };


    async zoomIn() {
        const view = canvas.scene._viewPosition;
        await canvas.animatePan({
            duration: 200, x: view.x, y: view.y, scale: view.scale * 1.25,
        });
    };

    async zoomOut() {
        const view = canvas.scene._viewPosition;
        await canvas.animatePan({
            duration: 200, x: view.x, y: view.y, scale: view.scale * 0.80,
        });
    };

    moveTopLeft = async () => this.move(-1, -1);

    moveLeft = async () => this.move(-1, 0);

    moveBottomLeft = async () => this.move(-1, 1);

    moveTop = async () => this.move(0, -1);

    moveBottom = async () => this.move(0, 1);

    moveTopRight = async () => this.move(1, -1);

    moveRight = async () => this.move(1, 0);

    moveBottomRight = async () => this.move(1, 1);

    activateListeners(html) {
        super.activateListeners(html)

        $('.mtmc-select', html).on('click', this.selectToken)
        $('.mtmc-zoomin', html).on('click', this.zoomIn)
        $('.mtmc-zoomout', html).on('click', this.zoomOut)
        $('.mtmc-topleft', html).on('click', this.moveTopLeft)
        $('.mtmc-left', html).on('click', this.moveLeft)
        $('.mtmc-bottomleft', html).on('click', this.moveBottomLeft)
        $('.mtmc-top', html).on('click', this.moveTop)
        $('.mtmc-bottom', html).on('click', this.moveBottom)
        $('.mtmc-topright', html).on('click', this.moveTopRight)
        $('.mtmc-right', html).on('click', this.moveRight)
        $('.mtmc-bottomright', html).on('click', this.moveBottomRight)
    }
}
