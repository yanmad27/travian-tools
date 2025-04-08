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
    select() {
        this.reInit();
        this.victim.querySelector('[class="selection"] input').click();
        console.log('LOG ~ ' + new Date().toLocaleString() + ' ~ select victim: ', this.getName());
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
}

async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

var victims = [
    {
        id: 51231,
        name: 'Mei`s F (-68|-22)',
        interval: 45,
        active: true,
    },
    {
        id: 51232,
        name: 'Lalala`s F (-67|-27)',
        interval: 30,
        active: true,
    },
    {
        id: 51433,
        name: '02.Camap (-54|-30)',
        interval: 30,
        active: true,
    },
    {
        id: 51230,
        name: 'Làng của abcd (-59|-42)',
        interval: 30,
        active: true,
    },
    {
        id: 46845,
        name: 'Hopeful`s F (-54|-36)',
        interval: 30,
        active: true,
    },
];

function main() {
    var farmList = new FarmList(1732);
    setInterval(() => {
        if (farmList.isCollapsed()) farmList.toggleCollapse();
        if (farmList.getCurrentSelectedVictim() <= victims.length) farmList.triggerRaid();
    }, 5000);

    for (let i = 0; i < victims.length; i++) {
        if (!victims[i].active) continue;
        console.log('LOG ~ ' + new Date().toLocaleString() + ' ~ start victim: ', victims[i].name, ', after: ', i, ' minutes');
        (async function () {
            await sleep(i * 60 * 1 * 1000);
            let victim = new Victim(victims[i].id, victims[i].interval);
            while (victim.isRaidding()) await sleep(5000);
            victim.select();
            setInterval(() => victim.select(), victim.getInterval() * 60 * 1000);
        })();
    }
}

main();
