class Victim {
    constructor(id, interval) {
        this.id = id;
        this.interval = interval;
        this.victim = document.querySelector(`[data-slot-id="${id}"]`).parentNode.parentNode.parentNode;
    }
    reInit() {
        this.victim = document.querySelector(`[data-slot-id="${this.id}"]`).parentNode.parentNode.parentNode;
    }
    getInterval() {
        return this.interval;
    }
    async select() {
        this.reInit();
        var checkBox = this.victim.querySelector('[class="selection"] input');
        let count = 0;
        while (!checkBox.checked) {
            checkBox.click();
            await sleep(1000);
            count++;
            if (count > 10) {
                console.log('LOG ~ ' + new Date().toLocaleString() + ' ~ select victim: ' + `%c${this.getName()}`, 'color: red; font-weight: bold;');
                return;
            }
        }
        console.log('LOG ~ ' + new Date().toLocaleString() + ' ~ select victim: ' + `%c${this.getName()}`, 'color: #5a9a0a; font-weight: bold;');
    }
    getName() {
        this.reInit();
        return this.victim.querySelector('[class="target"] a span').innerHTML;
    }
    getPopulation() {
        this.reInit();
        return this.victim.querySelector('[class="population"] span').innerHTML;
    }
    getDistance() {
        this.reInit();
        return this.victim.querySelector('[class="distance"] span').innerHTML;
    }
    isRaidding() {
        this.reInit();
        return this.victim.querySelector('[class="state"]').children.length !== 0;
    }
    isLastRaidFull() {
        this.reInit();
        return this.victim.querySelector('[class="lastRaidBounty"] i').className.includes('bounty_full_small');
    }
    isLastRaidHalf() {
        this.reInit();
        return this.victim.querySelector('[class="lastRaidBounty"] i').className.includes('bounty_half_small');
    }
    lastRaidFromNow() {
        this.reInit();
        try {
            const time = this.victim.querySelector('[class="lastRaidReport "] span').innerHTML;
            const regex = /(\d+):(\d+):(\d+)/;
            const match = time.match(regex);
            const now = new Date();
            const lastRaid = new Date(now.getFullYear(), now.getMonth(), now.getDate(), match[1], match[2], match[3]);
            return Math.floor((now.getTime() - lastRaid.getTime()) / 1000 / 60);
        } catch {
            return 10000;
        }
    }
}

class FarmList {
    constructor(id) {
        this.id = id;
        this.farmList = document.querySelector(`[data-list="${id}"]`).parentNode;
    }
    reInit() {
        this.farmList = document.querySelector(`[data-list="${this.id}"]`).parentNode;
    }
    getName() {
        this.reInit();
        return this.farmList.querySelector('[class="farmListName"] [class="name"]').innerHTML;
    }
    triggerRaid() {
        this.reInit();
        this.farmList.querySelector('[class="farmListName"] [class="name"]').click();
        this.farmList.querySelector('button').click();
    }
    isCollapsed() {
        this.reInit();
        return this.farmList.parentNode.className.includes('collapsed');
    }
    toggleCollapse() {
        this.reInit();
        this.farmList.querySelector('[class="expandCollapse"]').click();
    }
    getCurrentSelectedVictim() {
        this.reInit();
        var text = this.farmList.querySelector('button div').innerHTML;
        var regex = /Bắt đầu&nbsp;\((\d+)\)/;
        var match = text.match(regex);
        return parseInt(match[1]);
    }
    hasAtLeastOneActiveVictim() {
        var victims = document.querySelectorAll(`tbody [data-farm-list-id="${this.id}"]`);
        for (let i = 0; i < victims.length; i++) {
            if (victims[i].checked) return true;
        }
        return false;
    }
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

var farmLists = [
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
                name: 'Mei`s F (-68|-22)',
                interval: 30,
                active: true,
            },
            {
                id: 61851,
                name: 'Lalala`s F (-67|-27)',
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
                name: 'An nghĩa đường (-72|-11)',
                interval: 30,
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
                interval: 30,
                active: true,
            },
            {
                id: 62444,
                name: 'Mr.Piet 00',
                interval: 30,
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
                name: '02Camap (-54|-30)',
                interval: 10,
                active: true,
            },
            {
                id: 51230,
                name: 'Làng của abcd (-59|-42)',
                interval: 10,
                active: true,
            },
            {
                id: 46845,
                name: 'Hopeful`s F (-54|-36)',
                interval: 10,
                active: true,
            },
        ],
    },
];

var victims = farmLists.flatMap((farmList) => farmList.victims);

async function main() {
    for (let i = 0; i < farmLists.length; i++) {
        (async function () {
            await sleep(i * 5000);
            var farmList = new FarmList(farmLists[i].id);
            if (farmList.isCollapsed()) farmList.toggleCollapse();
            await sleep(5000);
            setInterval(async () => {
                if (farmList.isCollapsed()) farmList.toggleCollapse();
                if (farmList.hasAtLeastOneActiveVictim()) farmList.triggerRaid();
            }, 10000);
        })();
    }

    for (let i = 0; i < victims.length; i++) {
        if (!victims[i].active) continue;
        console.log(
            'LOG ~ ' + new Date().toLocaleString() + ' ~ start victim: ' + `%c${victims[i].name.padEnd(25)}` + '%c ~ after: ' + i + ' minutes',
            'color: #5a9a0a; font-weight: bold;',
            '',
        );
        (async function () {
            await sleep(i * 5 * 1000);
            let victim = new Victim(victims[i].id, victims[i].interval);
            let sleepTime = 0;
            while (victim.isRaidding() && sleepTime < victim.getInterval() * 60 * 1000) {
                await sleep(5000);
                sleepTime += 5000;
            }
            await victim.select();
            setInterval(async () => await victim.select(), victim.getInterval() * 60 * 1000);
        })();
    }
}

main();
