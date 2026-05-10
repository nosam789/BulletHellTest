export const WEAPON_CONFIGS = {
    BASIC: {
        id: 'basic',
        name: 'Standard Blaster',
        fireRate: 200,
        bulletSpeed: 500,
        bulletDamage: 60,
        bulletColor: 0xffff00,
        bulletSize: { w: 6, h: 12 },
        autoShootEnabled: true,
        ammo: Infinity,
        maxAmmo: Infinity,
        reloadTime: 0,
        pattern: 'SINGLE',
        spreadAngle: 0,
        bulletCount: 1,
        description: 'Basic single-shot weapon'
    },
    
    RAPID: {
        id: 'rapid',
        name: 'Rapid Fire',
        fireRate: 100,
        bulletSpeed: 550,
        bulletDamage: 40,
        bulletColor: 0x00ffff,
        bulletSize: { w: 5, h: 10 },
        autoShootEnabled: true,
        ammo: Infinity,
        maxAmmo: Infinity,
        reloadTime: 0,
        pattern: 'ALTERNATING_POSITION',
        positionOffset: 10,
        bulletCount: 1,
        description: 'Fast-firing blaster with alternating positions'
    },
    
    SPREAD: {
        id: 'spread',
        name: 'Spread Gun',
        fireRate: 400,
        bulletSpeed: 480,
        bulletDamage: 50,
        bulletColor: 0xff8800,
        bulletSize: { w: 6, h: 12 },
        autoShootEnabled: true,
        ammo: Infinity,
        maxAmmo: Infinity,
        reloadTime: 0,
        pattern: 'SPREAD',
        spreadAngle: Math.PI / 12,
        bulletCount: 3,
        description: 'Triple shot with angled spread'
    }
};

export function getWeaponConfig(weaponKey) {
    return WEAPON_CONFIGS[weaponKey] || WEAPON_CONFIGS.BASIC;
}

export function getWeaponKeys() {
    return Object.keys(WEAPON_CONFIGS);
}
