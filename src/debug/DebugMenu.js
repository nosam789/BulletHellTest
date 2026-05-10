import { DEBUG_CATEGORIES, DEBUG_UI, DEBUG_KEYS, DEBUG_SUBMENU, DEBUG_CHECKBOX } from '../debug/DebugConstants.js';

class DebugMenu {
    constructor(debugSystem) {
        this.debugSystem = debugSystem;
        this.scene = debugSystem.scene;
        this.container = null;
        this.background = null;
        this.titleText = null;
        this.mainButtons = [];
        this.mainButtonTexts = [];
        this.mainSelectionIndex = -1;
        this.exitText = null;
        this.isVisible = false;
        this.currentMenuState = 'main';
        this.submenuTitle = null;
        this.submenuButtons = [];
        this.submenuButtonTexts = [];
        this.submenuSelectionIndex = -1;
        this.submenuCheckboxStates = [];
        
        this.init();
        this.setupInput();
    }

    init() {
        const centerX = this.scene.cameras.main.centerX;
        const centerY = this.scene.cameras.main.centerY;
        const x = centerX - DEBUG_UI.WIDTH / 2;
        const y = centerY - DEBUG_UI.HEIGHT / 2;

        this.container = this.scene.add.container(x, y);
        this.container.setDepth(9999);

        this.background = this.scene.add.rectangle(
            DEBUG_UI.WIDTH / 2,
            DEBUG_UI.HEIGHT / 2,
            DEBUG_UI.WIDTH,
            DEBUG_UI.HEIGHT,
            DEBUG_UI.BACKGROUND_COLOR
        );
        this.background.setAlpha(DEBUG_UI.BACKGROUND_ALPHA);
        this.container.add(this.background);

        this.titleText = this.scene.add.text(
            10,
            10,
            'DEBUG MENU',
            { fontSize: DEBUG_UI.FONT_SIZE_TITLE, fill: DEBUG_UI.BUTTON_TEXT_COLOR }
        );
        this.container.add(this.titleText);

        this.createMainButtons();

        this.exitText = this.scene.add.text(
            10,
            DEBUG_UI.HEIGHT - 25,
            'P / ESC to close',
            { fontSize: '14px', fill: '#888888' }
        );
        this.container.add(this.exitText);
    }

    createMainButtons() {
        const categories = Object.values(DEBUG_CATEGORIES);
        const startY = 60;
        const gap = 5;

        categories.forEach((category, index) => {
            const y = startY + index * (DEBUG_UI.BUTTON_HEIGHT + gap);
            
            const button = this.scene.add.rectangle(
                DEBUG_UI.WIDTH / 2,
                y,
                DEBUG_UI.WIDTH - 20,
                DEBUG_UI.BUTTON_HEIGHT,
                DEBUG_UI.BUTTON_COLOR
            );
            button.setInteractive();
            button.setDepth(10000 + index);
            button.setData('category', category);
            button.setData('index', index);
            
            const text = this.scene.add.text(
                10,
                y - 9,
                `  ${category}`,
                { fontSize: DEBUG_UI.FONT_SIZE, fill: DEBUG_UI.BUTTON_TEXT_COLOR }
            );

            this.mainButtons.push(button);
            this.mainButtonTexts.push(text);

            button.on('pointerover', () => {
                button.setFillStyle(DEBUG_UI.BUTTON_HOVER_COLOR);
                this.highlightMainSelection(index);
            });

            button.on('pointerout', () => {
                if (this.mainSelectionIndex !== index) {
                    button.setFillStyle(DEBUG_UI.BUTTON_COLOR);
                }
            });

            button.on('pointerdown', () => {
                this.onMainButtonSelect(category);
            });

            this.container.add(button);
            this.container.add(text);
        });
    }

    createSubmenuButtons(config) {
        const buttons = config.buttons;
        const startY = 60;
        const gap = 5;

        buttons.forEach((label, index) => {
            const y = startY + index * (DEBUG_UI.BUTTON_HEIGHT + gap);
            
            const button = this.scene.add.rectangle(
                DEBUG_UI.WIDTH / 2,
                y,
                DEBUG_UI.WIDTH - 20,
                DEBUG_UI.BUTTON_HEIGHT,
                DEBUG_UI.BUTTON_COLOR
            );
            button.setInteractive();
            button.setDepth(10000 + index);
            button.setData('index', index);
            
            const checkbox = '[ ]';
            const text = this.scene.add.text(
                10,
                y - 9,
                `${checkbox} ${label}`,
                { fontSize: DEBUG_UI.FONT_SIZE, fill: DEBUG_UI.BUTTON_TEXT_COLOR }
            );

            this.submenuButtons.push(button);
            this.submenuButtonTexts.push(text);
            this.submenuCheckboxStates.push(false);

            button.on('pointerover', () => {
                button.setFillStyle(DEBUG_UI.BUTTON_HOVER_COLOR);
                this.highlightSubmenuSelection(index);
            });

            button.on('pointerout', () => {
                if (this.submenuSelectionIndex !== index) {
                    button.setFillStyle(DEBUG_UI.BUTTON_COLOR);
                }
            });

            button.on('pointerdown', () => {
                this.onSubmenuButtonSelect(index);
            });

            this.container.add(button);
            this.container.add(text);
        });

        const backBtnY = startY + buttons.length * (DEBUG_UI.BUTTON_HEIGHT + gap);
        
        const backButton = this.scene.add.rectangle(
            DEBUG_UI.WIDTH / 2,
            backBtnY,
            DEBUG_UI.WIDTH - 20,
            DEBUG_UI.BUTTON_HEIGHT,
            DEBUG_UI.BUTTON_COLOR
        );
        backButton.setInteractive();
        backButton.setDepth(10000 + buttons.length);
        backButton.setData('index', buttons.length);
        
        const backText = this.scene.add.text(
            DEBUG_UI.WIDTH - 40,
            backBtnY - 9,
            'Back',
            { fontSize: DEBUG_UI.FONT_SIZE, fill: DEBUG_UI.BUTTON_TEXT_COLOR }
        );
        backText.setOrigin(1, 0);

        this.submenuButtons.push(backButton);
        this.submenuButtonTexts.push(backText);

        backButton.on('pointerover', () => {
            backButton.setFillStyle(DEBUG_UI.BUTTON_HOVER_COLOR);
            this.highlightSubmenuSelection(buttons.length);
        });

        backButton.on('pointerout', () => {
            if (this.submenuSelectionIndex !== buttons.length) {
                backButton.setFillStyle(DEBUG_UI.BUTTON_COLOR);
            }
        });

        backButton.on('pointerdown', () => {
            this.closeSubmenu();
        });

        this.container.add(backButton);
        this.container.add(backText);
    }

    setupInput() {
        this.scene.input.keyboard.on('keydown-UP', () => {
            if (!this.isVisible) return;
            if (this.currentMenuState === 'main') {
                this.navigateMain(-1);
            } else {
                this.navigateSubmenu(-1);
            }
        });

        this.scene.input.keyboard.on('keydown-DOWN', () => {
            if (!this.isVisible) return;
            if (this.currentMenuState === 'main') {
                this.navigateMain(1);
            } else {
                this.navigateSubmenu(1);
            }
        });

        this.scene.input.keyboard.on('keydown-ENTER', () => {
            if (!this.isVisible) return;
            if (this.currentMenuState === 'main') {
                if (this.mainSelectionIndex >= 0 && this.mainSelectionIndex < this.mainButtons.length) {
                    const category = this.mainButtons[this.mainSelectionIndex].getData('category');
                    this.onMainButtonSelect(category);
                }
            } else {
                if (this.submenuSelectionIndex >= 0 && this.submenuSelectionIndex < this.submenuButtons.length) {
                    this.onSubmenuButtonSelect(this.submenuSelectionIndex);
                }
            }
        });

        this.scene.input.keyboard.on('keydown-BACKSPACE', () => {
            if (!this.isVisible) return;
            if (this.currentMenuState === 'submenu') {
                this.closeSubmenu();
            }
        });
    }

    navigateMain(direction) {
        if (this.mainSelectionIndex === -1) {
            this.mainSelectionIndex = 0;
        } else {
            this.mainSelectionIndex = (this.mainSelectionIndex + direction + this.mainButtons.length) % this.mainButtons.length;
        }
        this.highlightMainSelection(this.mainSelectionIndex);
    }

    navigateSubmenu(direction) {
        if (this.submenuSelectionIndex === -1) {
            this.submenuSelectionIndex = 0;
        } else {
            this.submenuSelectionIndex = (this.submenuSelectionIndex + direction + this.submenuButtons.length) % this.submenuButtons.length;
        }
        this.highlightSubmenuSelection(this.submenuSelectionIndex);
    }

    highlightMainSelection(index) {
        this.mainButtons.forEach((btn, i) => {
            if (i === index) {
                btn.setFillStyle(DEBUG_UI.BUTTON_HOVER_COLOR);
            } else {
                btn.setFillStyle(DEBUG_UI.BUTTON_COLOR);
            }
        });
    }

    highlightSubmenuSelection(index) {
        this.submenuButtons.forEach((btn, i) => {
            if (i === index) {
                btn.setFillStyle(DEBUG_UI.BUTTON_HOVER_COLOR);
            } else {
                btn.setFillStyle(DEBUG_UI.BUTTON_COLOR);
            }
        });
    }

    onMainButtonSelect(category) {
        console.log(`[DebugMenu] Main button selected: ${category}`);
        this.debugSystem.onCategorySelect(category);
    }

    onSubmenuButtonSelect(index) {
        console.log(`[DebugMenu] Submenu button selected: ${index}`);
        if (index === this.submenuButtons.length - 1) {
            this.closeSubmenu();
        } else {
            if (this.currentCategory === 'Visualizers') {
                const feature = DEBUG_SUBMENU.VISUALIZERS.features[index];
                const isActive = this.debugSystem.isActive(feature);
                
                this.debugSystem.toggleFeature(feature);
                const newActiveState = !isActive;
                
                this.updateCheckbox(index, newActiveState);
                console.log(`[DebugMenu] Toggled ${feature}: now ${newActiveState}`);
            } else if (this.currentCategory === 'Player Weapons') {
                const weaponKey = DEBUG_SUBMENU.PLAYER_WEAPONS.buttons[index];
                const isActive = this.debugSystem.scene.weaponManager.isActiveWeapon(weaponKey);
                
                this.debugSystem.scene.weaponManager.toggleWeapon(weaponKey);
                const newActiveState = !isActive;
                
                this.updateCheckbox(index, newActiveState);
                console.log(`[DebugMenu] Toggled weapon ${weaponKey}: now ${newActiveState}`);
            }
        }
    }

    show(visible) {
        this.isVisible = visible;
        this.container.setVisible(visible);
        this.container.setAlpha(visible ? 1 : 0);
        
        if (visible) {
            if (this.currentMenuState === 'submenu') {
                this._destroySubmenuElements();
            }
            this.currentMenuState = 'main';
            this.currentCategory = null;
            this.mainSelectionIndex = -1;
            this.mainButtons.forEach(btn => {
                btn.setFillStyle(DEBUG_UI.BUTTON_COLOR);
            });
            console.log('[Debug Menu] Opened');
        } else {
            if (this.currentMenuState === 'submenu') {
                this.closeSubmenu();
            }
        }
    }

    openSubmenu(category) {
        this._destroySubmenuElements();
        
        this.currentMenuState = 'submenu';
        this.currentCategory = category;
        this.submenuTitle = category;
        this.submenuSelectionIndex = -1;
        this.submenuCheckboxStates = [];
        
        this.titleText.setText(category);
        this.exitText.setText('BACKSPACE to return');
        
        this.mainButtons.forEach(btn => btn.setVisible(false));
        this.mainButtonTexts.forEach(text => text.setVisible(false));
        
        // Handle different submenu types
        if (category === 'Visualizers') {
            this.createSubmenuButtons(DEBUG_SUBMENU.VISUALIZERS);
            DEBUG_SUBMENU.VISUALIZERS.features.forEach((feature, index) => {
                const isActive = this.debugSystem.isActive(feature);
                this.updateCheckbox(index, isActive);
            });
        } else if (category === 'Player Weapons') {
            this.createWeaponsSubmenu();
            DEBUG_SUBMENU.PLAYER_WEAPONS.features.forEach((weaponKey, index) => {
                const isActive = this.debugSystem.scene.weaponManager.isActiveWeapon(weaponKey);
                this.updateCheckbox(index, isActive);
            });
        }
    }

    createWeaponsSubmenu() {
        const buttons = DEBUG_SUBMENU.PLAYER_WEAPONS.buttons;
        const startY = 60;
        const gap = 5;

        buttons.forEach((label, index) => {
            const y = startY + index * (DEBUG_UI.BUTTON_HEIGHT + gap);
            
            const button = this.scene.add.rectangle(
                DEBUG_UI.WIDTH / 2,
                y,
                DEBUG_UI.WIDTH - 20,
                DEBUG_UI.BUTTON_HEIGHT,
                DEBUG_UI.BUTTON_COLOR
            );
            button.setInteractive();
            button.setDepth(10000 + index);
            button.setData('index', index);
            button.setData('type', 'weapon');
            
            const checkbox = '[ ]';
            const text = this.scene.add.text(
                10,
                y - 9,
                `${checkbox} ${label}`,
                { fontSize: DEBUG_UI.FONT_SIZE, fill: DEBUG_UI.BUTTON_TEXT_COLOR }
            );

            this.submenuButtons.push(button);
            this.submenuButtonTexts.push(text);
            this.submenuCheckboxStates.push(false);

            button.on('pointerover', () => {
                button.setFillStyle(DEBUG_UI.BUTTON_HOVER_COLOR);
                this.highlightSubmenuSelection(index);
            });

            button.on('pointerout', () => {
                if (this.submenuSelectionIndex !== index) {
                    button.setFillStyle(DEBUG_UI.BUTTON_COLOR);
                }
            });

            button.on('pointerdown', () => {
                this.onSubmenuButtonSelect(index);
            });

            this.container.add(button);
            this.container.add(text);
        });

        const backBtnY = startY + buttons.length * (DEBUG_UI.BUTTON_HEIGHT + gap);
        
        const backButton = this.scene.add.rectangle(
            DEBUG_UI.WIDTH / 2,
            backBtnY,
            DEBUG_UI.WIDTH - 20,
            DEBUG_UI.BUTTON_HEIGHT,
            DEBUG_UI.BUTTON_COLOR
        );
        backButton.setInteractive();
        backButton.setDepth(10000 + buttons.length);
        backButton.setData('index', buttons.length);
        
        const backText = this.scene.add.text(
            DEBUG_UI.WIDTH - 40,
            backBtnY - 9,
            'Back',
            { fontSize: DEBUG_UI.FONT_SIZE, fill: DEBUG_UI.BUTTON_TEXT_COLOR }
        );
        backText.setOrigin(1, 0);

        this.submenuButtons.push(backButton);
        this.submenuButtonTexts.push(backText);

        backButton.on('pointerover', () => {
            backButton.setFillStyle(DEBUG_UI.BUTTON_HOVER_COLOR);
            this.highlightSubmenuSelection(buttons.length);
        });

        backButton.on('pointerout', () => {
            if (this.submenuSelectionIndex !== buttons.length) {
                backButton.setFillStyle(DEBUG_UI.BUTTON_COLOR);
            }
        });

        backButton.on('pointerdown', () => {
            this.closeSubmenu();
        });

        this.container.add(backButton);
        this.container.add(backText);
    }

    closeSubmenu() {
        this._destroySubmenuElements();
        
        this.currentMenuState = 'main';
        this.submenuTitle = null;
        this.mainSelectionIndex = -1;
        
        this.titleText.setText('DEBUG MENU');
        this.exitText.setText('P / ESC to close');
        
        this.mainButtons.forEach(btn => {
            btn.setVisible(true);
            btn.setFillStyle(DEBUG_UI.BUTTON_COLOR);
        });
        this.mainButtonTexts.forEach(text => text.setVisible(true));
    }

    _destroySubmenuElements() {
        this.submenuButtons.forEach(btn => {
            if (btn.parentContainer) {
                btn.destroy();
            }
        });
        this.submenuButtonTexts.forEach(text => {
            if (text.parentContainer) {
                text.destroy();
            }
        });
        this.submenuButtons = [];
        this.submenuButtonTexts = [];
        this.submenuCheckboxStates = [];
    }

    updateCheckbox(index, isActive) {
        if (!this.submenuButtonTexts[index]) return;
        
        const checkbox = isActive ? 
            `[${DEBUG_CHECKBOX.CHECKED}]` : 
            `[${DEBUG_CHECKBOX.UNCHECKED}]`;
        
        let label;
        if (this.currentCategory === 'Visualizers') {
            label = DEBUG_SUBMENU.VISUALIZERS.buttons[index];
        } else if (this.currentCategory === 'Player Weapons') {
            label = DEBUG_SUBMENU.PLAYER_WEAPONS.buttons[index];
        }
        
        this.submenuButtonTexts[index].setText(`${checkbox} ${label}`);
        this.submenuCheckboxStates[index] = isActive;
    }

    update() {
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
        
        this.scene.input.keyboard.off('keydown-UP');
        this.scene.input.keyboard.off('keydown-DOWN');
        this.scene.input.keyboard.off('keydown-ENTER');
    }
}

export default DebugMenu;