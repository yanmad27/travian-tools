async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function selectVictim(victim) {
    var htmlItem = getElementByXpath(victim.xpathCheckbox);
    if (!htmlItem.checked) htmlItem.click();
    console.log('LOG ~ ' + new Date().toLocaleString() + ' ~ select victim: ', victim.name);
}

function triggerRaid() {
    // Just make sure the interval is active
    var activeInterval = getElementByXpath('//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[1]/div[2]/div[1]');
    activeInterval.click();

    var act = getElementByXpath('//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[1]/button');
    var s = act.children[0].innerHTML;
    var regex = /Bắt đầu&nbsp;\((\d+)\)/;
    var match = s.match(regex);
    var count = Number(match[1]);
    if (count <= victims.length) {
        console.log('LOG ~ ' + new Date().toLocaleString() + ' ~trigger raid');
        act.click();
    }
}

setInterval(triggerRaid, 5000);

var victims = [
    {
        name: 'Mei`s F (-68|-22)',
        xpathCheckbox: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[1]/td[1]/label/input',
        xpathState: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[1]/td[2]',
        interval: 45,
        active: true,
    },
    {
        name: 'Lalala`s F (-67|-27)',
        xpathCheckbox: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[2]/td[1]/label/input',
        xpathState: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[2]/td[2]',
        interval: 30,
        active: true,
    },
    {
        name: '02.Camap (-54|-30)',
        xpathCheckbox: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[3]/td[1]/label/input',
        xpathState: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[3]/td[2]',
        interval: 30,
        active: true,
    },
    {
        name: 'Làng của abcd (-59|-42)',
        xpathCheckbox: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[4]/td[1]/label/input',
        xpathState: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[4]/td[2]',
        interval: 30,
        active: true,
    },
    {
        name: 'Hopeful`s F (-54|-36)',
        xpathCheckbox: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[5]/td[1]/label/input',
        xpathState: '//*[@id="rallyPointFarmList"]/div[2]/div[3]/div/div[2]/table/tbody/tr[5]/td[2]',
        interval: 30,
        active: true,
    },
];

for (let i = 0; i < victims.length; i++) {
    if (!victims[i].active) continue;
    (async function () {
        let victim = victims[i];
        while (getElementByXpath(victim.xpathState).children.length !== 0) await sleep(5000);
        selectVictim(victim);
        setInterval(() => selectVictim(victim), (victim.interval * 60 + 15) * 1000);
    })();
}
