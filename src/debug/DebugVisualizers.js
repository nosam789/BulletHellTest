class DebugVisualizers {
    constructor(scene, debugSystem) {
        this.scene = scene;
        this.debugSystem = debugSystem;
        this.graphics = null;
        this.init();
    }

    init() {
        this.graphics = this.scene.add.graphics();
        this.graphics.setDepth(9998);
    }

    enable() {
        this.graphics.setVisible(true);
    }

    disable() {
        this.graphics.setVisible(false);
    }

    clear() {
        this.graphics.clear();
    }

    update() {
        this.clear();

        if (this.debugSystem.isActive('hitbox_player')) {
            this.drawPlayerHitbox();
        }

        if (this.debugSystem.isActive('hitbox_enemy')) {
            this.drawEnemyHitboxes();
        }

        if (this.debugSystem.isActive('hitbox_player_bullet')) {
            this.drawPlayerBulletHitboxes();
        }

        if (this.debugSystem.isActive('hitbox_enemy_bullet')) {
            this.drawEnemyBulletHitboxes();
        }
    }

    drawHitbox(object, color, style) {
        if (!object || !object.body) return;

        const body = object.body;
        const width = body.width;
        const height = body.height;

        const originX = object.originX || 0;
        const originY = object.originY || 0;

        const centerX = object.x - (width * originX) + (width / 2);
        const centerY = object.y - (height * originY) + (height / 2);

        const offsetX = body.offset.x || 0;
        const offsetY = body.offset.y || 0;

        const collisionX = centerX + offsetX;
        const collisionY = centerY + offsetY;

        const x = collisionX - width / 2;
        const y = collisionY - height / 2;

        this.graphics.lineStyle(style.lineWidth, color, 1);

        if (style.fillAlpha > 0) {
            this.graphics.fillStyle(color, style.fillAlpha);
            this.graphics.fillRect(x, y, width, height);
        }

        this.graphics.strokeRect(x, y, width, height);

        this.drawCenterDot(centerX, centerY, color);
    }

    drawCenterDot(x, y, color) {
        const size = 4;
        this.graphics.fillStyle(color, 1);
        this.graphics.fillRect(x - size / 2, y - size / 2, size, size);
    }

    drawPlayerHitbox() {
        if (!this.scene.player) return;
        const style = this.debugSystem.getHitboxStyle('hitbox_player');
        this.drawHitbox(this.scene.player, 0x00ff00, style);
    }

    drawEnemyHitboxes() {
        if (!this.scene.activeEnemies) return;
        const style = this.debugSystem.getHitboxStyle('hitbox_enemy');
        
        this.scene.activeEnemies.forEach(enemy => {
            if (enemy && enemy.sprite) {
                this.drawHitbox(enemy.sprite, 0xff0000, style);
            }
        });
    }

    drawPlayerBulletHitboxes() {
        if (!this.scene.playerBullets) return;
        const style = this.debugSystem.getHitboxStyle('hitbox_player_bullet');
        
        this.scene.playerBullets.getChildren().forEach(bullet => {
            this.drawHitbox(bullet, 0xffff00, style);
        });
    }

    drawEnemyBulletHitboxes() {
        if (!this.scene.enemyBullets) return;
        const style = this.debugSystem.getHitboxStyle('hitbox_enemy_bullet');
        
        this.scene.enemyBullets.getChildren().forEach(bullet => {
            this.drawHitbox(bullet, 0xffa500, style);
        });
    }

    destroy() {
        if (this.graphics) {
            this.graphics.destroy();
        }
    }
}

export default DebugVisualizers;