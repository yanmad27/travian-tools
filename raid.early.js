// ==UserScript==
// @name         Raiding
// @namespace    http://tampermonkey.net/
// @version      2025-05-10
// @description  try to take over the world!
// @author       You
// @match        https://ts7.x1.international.travian.com/build.php?gid=16&tt=99
// @icon         https://www.google.com/s2/favicons?sz=64&domain=travian.com
// @grant        none
// ==/UserScript==

(function () {
	'use strict'

	setInterval(() => {

        console.log("Start raiding")
        var victims = document.querySelector('#rallyPointFarmList > div.villageWrapper > div.dropContainer > div > div.slotsWrapper.formV2 > table > tbody').childNodes
        var firstNotRaidingVictim = null
        for (let i = 0; i < victims.length - 1; i++) {
            const victim = victims[i]
            const isRaiding = victim.querySelector('[class="state"]').childNodes.length > 0
            if (isRaiding) continue
            firstNotRaidingVictim = victim
            break
        }
        if (!firstNotRaidingVictim) {
            console.log("No victim found")
            
        }
        console.log("Select first no raid victim")
        firstNotRaidingVictim.querySelector('[class="selection"] input').click()
        //document.querySelector('#rallyPointFarmList > div.villageWrapper > div.dropContainer > div > div.farmListHeader > button').click()
        window.location.reload()
	}, 20000)
})()
