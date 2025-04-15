function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function logError(message) {
    console.log(`${new Date().toLocaleString()} ~ %c${message}`, 'color: red; font-weight: bold;');
}

function logSuccess(message) {
    console.log(`${new Date().toLocaleString()} ~ %c${message}`, 'color: #5a9a0a; font-weight: bold;');
}

function logWarning(message) {
    console.log(`${new Date().toLocaleString()} ~ %c${message}`, 'color: orange; font-weight: bold;');
}

function logInfo(message) {
    console.log(`${new Date().toLocaleString()} ~ %c${message}`, 'color: blue; font-weight: bold;');
}

class DOMElementHandler {
    constructor(selector) {
        this.selector = selector;
    }

    getElement() {
        return document.querySelector(this.selector);
    }

    getFreshElement() {
        return document.querySelector(this.selector);
    }

    exists() {
        return this.getFreshElement() !== null;
    }
}

class Victim {
    constructor(id, interval) {
        this.id = id;
        this.interval = interval;
        this.intervalId = null;
        this.attempts = 0;
        this.maxAttempts = 5;
        this.baseElement = new DOMElementHandler(`[data-slot-id="${id}"]`);
    }

    getVictimElement() {
        const base = this.baseElement.getFreshElement();
        return base?.parentNode?.parentNode?.parentNode;
    }

    async select() {
        try {
            await sleep(Math.floor(Math.random() * 5000));
            this.attempts++;
            if (this.attempts >= this.maxAttempts) throw new Error('Max attempts reached');

            const victim = this.getVictimElement();
            if (!victim) throw new Error('Victim element not found');

            const checkBox = victim.querySelector('[class="selection"] input');
            if (!checkBox) throw new Error('Checkbox not found');

            if (!checkBox.checked) {
                checkBox.click();

                if (!checkBox.checked && this.attempts < this.maxAttempts) {
                    logWarning(`Retrying to select victim ${this.getName()} (${this.attempts}/${this.maxAttempts})`);
                    await sleep(12345);
                    return await this.select(); // Retry
                }
            }

            this.attempts = 0;
            logSuccess(`Selected victim ${this.getName()}`);
            return true;
        } catch (error) {
            logError(`Error selecting victim ${this.getName()}:`, error);
            if (this.attempts >= this.maxAttempts) {
                this.attempts = 0;
                this.stop();
                this.start();
            }
            return false;
        }
    }

    getName() {
        try {
            const victim = this.getVictimElement();
            return victim?.querySelector('[class="target"] a span')?.innerHTML || 'Unknown';
        } catch {
            return 'Unknown';
        }
    }

    isRaiding() {
        try {
            const victim = this.getVictimElement();
            return victim?.querySelector('[class="state"]')?.children?.length !== 0;
        } catch {
            return false;
        }
    }

    start() {
        this.stop();
        this.intervalId = setInterval(async () => {
            await this.select();
        }, this.interval * 60 * 1000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

class FarmList {
    constructor(id) {
        this.id = id;
        this.intervalId = null;
        this.baseElement = new DOMElementHandler(`[data-list="${id}"]`);
    }

    getListElement() {
        const base = this.baseElement.getFreshElement();
        return base?.parentNode;
    }

    getName() {
        try {
            const list = this.getListElement();
            return list?.querySelector('[class="farmListName"] [class="name"]')?.innerHTML || 'Unknown';
        } catch {
            return 'Unknown';
        }
    }

    isCollapsed() {
        try {
            const list = this.getListElement();
            return list?.parentNode?.className?.includes('collapsed') || false;
        } catch {
            return false;
        }
    }

    toggleCollapse() {
        try {
            const list = this.getListElement();
            list?.querySelector('[class="expandCollapse"]')?.click();
        } catch (error) {
            logError(`Error toggling farm list ${this.getName()}:`, error);
        }
    }

    hasAtLeastOneActiveVictim() {
        try {
            const victims = document.querySelectorAll(`tbody [data-farm-list-id="${this.id}"]`);
            return Array.from(victims).some((v) => v.checked);
        } catch {
            return false;
        }
    }

    triggerRaid() {
        try {
            const list = this.getListElement();
            list?.querySelector('[class="farmListName"] [class="name"]')?.click();
            list?.querySelector('button')?.click();
        } catch (error) {
            logError(`Error triggering raid for farm list ${this.id}-${this.getName()}:`, error);
        }
    }

    start() {
        this.stop();
        this.intervalId = setInterval(() => {
            if (this.isCollapsed()) {
                this.toggleCollapse();
            }
            if (this.hasAtLeastOneActiveVictim()) {
                this.triggerRaid();
            }
        }, 10000);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }
}

class FarmBot {
    constructor(farmLists) {
        this.farmLists = farmLists;
        this.victims = farmLists.flatMap((fl) => fl.victims);
        this.activeFarmLists = new Map();
        this.activeVictims = new Map();
        this.healthCheckInterval = null;
    }

    initialize() {
        logInfo('Initializing farm bot...');
        // Initialize farm lists
        this.farmLists.forEach(async (farmListData, i) => {
            await sleep(i * 5000);
            const farmList = new FarmList(farmListData.id);
            this.activeFarmLists.set(farmListData.id, farmList);

            if (farmList.isCollapsed()) {
                farmList.toggleCollapse();
            }
            await sleep(5000);
            farmList.start();
        });

        // Initialize victims
        this.victims.forEach(async (victimData, i) => {
            if (!victimData.active) return;

            await sleep(i * 5 * 1000);
            const victim = new Victim(victimData.id, victimData.interval);
            this.activeVictims.set(victimData.id, victim);

            // Wait if currently raiding
            let waitTime = 0;
            while (victim.isRaiding() && waitTime < victim.interval * 60 * 1000) {
                await sleep(5000);
                waitTime += 5000;
            }

            await victim.select();
            victim.start();
        });

        // Start health check
        this.startHealthCheck();
    }

    async activateVictim(id, interval) {
        if (this.activeVictims.get(id)) return;

        const victim = new Victim(id, interval);
        this.activeVictims.set(id, victim);

        // Wait if currently raiding
        let waitTime = 0;
        while (victim.isRaiding() && waitTime < victim.interval * 60 * 1000) {
            await sleep(5000);
            waitTime += 5000;
        }

        await victim.select();
        victim.start();
    }

    async deactivateVictim(id) {
        const victim = this.activeVictims.get(id);
        if (!victim) return;

        victim.stop();
        this.activeVictims.delete(id);
    }

    startHealthCheck() {
        this.healthCheckInterval = setInterval(() => {
            logInfo('Running health check...');

            // Check farm lists
            this.activeFarmLists.forEach((farmList) => {
                if (!farmList.baseElement.exists()) {
                    logWarning(`Farm list ${farmList.id} element missing, restarting...`);
                    farmList.stop();
                    farmList.start();
                }
            });

            // Check victims
            this.activeVictims.forEach((victim) => {
                if (!victim.baseElement.exists()) {
                    logWarning(`Victim ${victim.id} element missing, restarting...`);
                    victim.stop();
                    victim.start();
                }
            });
        }, 300000); // Every 5 minutes
    }

    stop() {
        // Clean up all intervals
        this.activeFarmLists.forEach((farmList) => farmList.stop());
        this.activeVictims.forEach((victim) => victim.stop());

        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
        }

        this.activeFarmLists.clear();
        this.activeVictims.clear();
    }
}

// Usage
const farmLists = [
    {
        id: 1817,
        victims: [
            {
                id: 62034,
                name: 'Azamat`s village',
                interval: 10,
                active: true,
            },
            {
                id: 55465,
                name: 'Mei`s F',
                interval: 10,
                active: true,
            },
            {
                id: 61851,
                name: 'Lalala`s F',
                interval: 10,
                active: true,
            },
            {
                id: 59457,
                name: 'Mocho`s village',
                interval: 10,
                active: true,
            },
            {
                id: 55464,
                name: 'An nghĩa đường',
                interval: 15,
                active: true,
            },
            {
                id: 62318,
                name: 'shoes19944116',
                interval: 30,
                active: true,
            },
            {
                id: 43830,
                name: 'ab1` F',
                interval: 10,
                active: true,
            },
            {
                id: 65832,
                name: 'Dorf von Djimmy98',
                interval: 45,
                active: true,
            },
            {
                id: 62443,
                name: 'Mr.Piet 01',
                interval: 15,
                active: true,
            },
            {
                id: 62444,
                name: 'Mr.Piet 00',
                interval: 15,
                active: true,
            },
            {
                id: 62317,
                name: 'Draktallar`s village',
                interval: 45,
                active: true,
            },
            {
                id: 48393,
                name: 'Ly ly',
                interval: 45,
                active: true,
            },
            {
                id: 66572,
                name: 'Spartacus',
                interval: 45,
                active: true,
            },
        ],
    },
    {
        id: 1732,
        victims: [
            {
                id: 61858,
                name: '02Camap',
                interval: 10,
                active: false,
            },
            {
                id: 51230,
                name: 'Làng của abcd',
                interval: 10,
                active: true,
            },
            {
                id: 46845,
                name: 'Hopeful`s F',
                interval: 10,
                active: true,
            },
        ],
    },
];

const bot = new FarmBot(farmLists);
bot.initialize();
