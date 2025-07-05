const troopneededkey = 'troopsNeeded'
const troopsOverviewkey = 'troopsOverview'

const renderResult = (villageList, troopsOverview) => {
	const troopsImgPath = 'https://cdn.legends.travian.com/gpack/155.5/img_ltr/global/units/hun/icon/hun_small.png'
	// const interval = Number(document.getElementById('interval').value)
	const result = document.getElementById('troops-needed-result')
	result.innerHTML = ''
	for (const village of villageList) {
		const villageName = village.name
		const tsLevel = village.tsLevel
		const farmList = village.farmList
		const sumTroops = {
			t1: 0,
			t2: 0,
			t3: 0,
			t4: 0,
			t5: 0,
			t6: 0,
			t7: 0,
		}
		const sumTroopsAll = {
			t1: 0,
			t2: 0,
			t3: 0,
			t4: 0,
			t5: 0,
			t6: 0,
			t7: 0,
		}
		for (const farm of farmList) {
			const victimList = farm.victimList
			for (const victim of victimList) {
				for (const [key, value] of Object.entries(victim.troops)) {
					sumTroopsAll[key] += value
					if (!victim.isDisabled) sumTroops[key] += value
				}
			}
		}
		result.innerHTML += `
              <div class="farm-item">
                <div class="farm-name" style="margin-bottom: 8px; font-weight: bold;">${villageName} - <span style="font-size: 12px; color: #999;">TS Lvl: ${tsLevel || 0}</span></div>
                <div class="farm-troops" style="display: flex; align-items: center; gap: 8px;">
                  ${Object.entries(sumTroops)
						.map(([key, value]) => {
							if (key !== 't4' && key !== 't6') return ''
							// if (value === 0) return ''
							const backgrounPosition = {
								t1: '0 0',
								t2: '0 -16px',
								t3: '0 -32px',
								t4: '0 -48px',
								t5: '0 -64px',
								t6: '0 -80px',
								t7: '0 -96px',
							}
							const backgroundPosition = backgrounPosition[key] || '0 0'
							const ratio = Number(value) / Number(troopsOverview[villageName]?.[key] || 1)
							let color = 'black'
							if (ratio > 0.95) color = 'red'
							if (ratio <= 0.95) color = 'orange'
							if (ratio <= 0.9) color = 'green'
							const style1 = `color: ${color};`
							const style2 = `color: #999;`

							return `
              <div style="display: flex; align-items: center; gap: 4px;">
                <div style="background-image: url(${troopsImgPath});width: 16px;height: 16px;display: inline-block;vertical-align: bottom;background-position: ${backgroundPosition};"></div>
                <div style="min-width: 40px; max-width: 80px;">
                  <span style="${style1}">${value}</span>
                  <span style="${style2}">/ ${troopsOverview[villageName]?.[key]} </span>
                  <br/>
                  <span style="${style1}">${(ratio * 100).toFixed(0)}%</span> 
                  <span style="${style2}">(${sumTroopsAll[key]})</span>
                </div>
              </div>
              `
						})
						.join('')}
                </div>
              </div>`
	}
}
function saveToStorage(data) {
	chrome.storage.local.set({ [troopneededkey]: data })
}

function saveToStorage2(data) {
	chrome.storage.local.set({ [troopsOverviewkey]: data }, () => {})
}

const getTroopNeeded = () => {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabs[0].id },
					function: () => {
						const BASE_INTERVAL = 4.8125
						const SLOWEST_SPEED = 28

						const getTroops = (totalLoop, troopsElem) => {
							const getTroops = (selector) => {
								const cnt = Number(troopsElem.querySelector(selector)?.parentNode.querySelector('.value').innerHTML)
								return isNaN(cnt) ? 0 : cnt
							}
							return {
								t1: getTroops('i.t1') * totalLoop,
								t2: getTroops('i.t2') * totalLoop,
								t3: getTroops('i.t3') * totalLoop,
								t4: getTroops('i.t4') * totalLoop,
								t5: getTroops('i.t5') * totalLoop,
								t6: getTroops('i.t6') * totalLoop,
								t7: getTroops('i.t7') * totalLoop,
							}
						}
						const villageListElems = document.querySelectorAll('.villageWrapper ')
						const villageList = []
						for (const villageListElem of villageListElems) {
							const villageName = villageListElem.querySelector('.villageName').innerHTML
							const getTSLevel = (villageName) => {
								const tsLevel = {
									O1: 13,
									F1: 5,
									F2: 2,
								}
								return tsLevel[villageName] || 0
							}
							const tsLevel = getTSLevel(villageName)
							const farmListElems = villageListElem.querySelectorAll('.farmListWrapper')
							const farmList = []
							for (const farmListElem of farmListElems) {
								const farmListName = farmListElem.querySelector('.farmListName .name').innerHTML
								const victimListElem = farmListElem.querySelectorAll('tr.slot')
								const victimList = []
								for (const victimElem of victimListElem) {
									const isDisabled = victimElem.getAttribute('class')?.includes('disabled')
									const id = victimElem.querySelector('[class="selection"] input').getAttribute('data-slot-id')
									const distance = Number(victimElem.querySelector('.distance span').innerHTML)
									// TODO: Add TS Level

									const loopWithin20Field = (2 * 60 * Math.min(distance, 20)) / SLOWEST_SPEED
									const loopOutside20Field = (2 * 60 * Math.max(distance - 20, 0)) / (SLOWEST_SPEED * (1 + tsLevel * 0.2))
									const totalLoop = (loopWithin20Field + loopOutside20Field) / BASE_INTERVAL
									const ceilTotalLoop = Math.ceil(totalLoop)
									const troops = getTroops(ceilTotalLoop, victimElem.querySelector('td.troops div'))
									const item = {
										id,
										distance,
										troops,
										isDisabled,
									}
									victimList.push(item)
								}
								farmList.push({
									name: farmListName,
									victimList,
								})
							}
							villageList.push({
								name: villageName,
								tsLevel,
								farmList,
							})
						}

						console.log('LOG ~ chrome.tabs.query ~ villageList:', villageList)
						return villageList
					},
				},
				(results) => {
					const villageList = results[0].result
					if (villageList.length === 0) return
					saveToStorage(villageList)
				},
			)
		})
	} catch (error) {
		console.log('LOG ~ getTroopNeeded ~ error:', error)
	}
}

const getTroopsOverview = () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript(
			{
				target: { tabId: tabs[0].id },
				function: () => {
					if (!document.location.href.includes('/village/statistics/troops')) return
					const table = document.querySelector('#troops')
					const tmps = table.querySelectorAll('td.villageName')
					const troops = {}
					for (const tmp of tmps) {
						const row = tmp.parentNode
						const getTroop = (index) => {
							return isNaN(Number(row.querySelector(`td:nth-child(${index})`).innerHTML)) ? 0 : Number(row.querySelector(`td:nth-child(${index})`).innerHTML)
						}
						const name = row.querySelector('.villageName a').innerHTML
						const troop = {
							t1: getTroop(2),
							t2: getTroop(3),
							t3: getTroop(4),
							t4: getTroop(5),
							t5: getTroop(6),
							t6: getTroop(7),
							t7: getTroop(8),
							t8: getTroop(9),
							t9: getTroop(10),
							t10: getTroop(11),
						}
						troops[name] = troop
					}
					return troops
				},
			},
			(results) => {
				const troops = results[0].result
				if (troops.length === 0) return
				saveToStorage2(troops)
			},
		)
	})
}
document.addEventListener('DOMContentLoaded', () => {
	getTroopNeeded()
	getTroopsOverview()
	chrome.storage.local.get([troopneededkey, troopsOverviewkey], (result) => {
		const villageList = result[troopneededkey] || []
		const troopsOverview = result[troopsOverviewkey] || {}
		renderResult(villageList, troopsOverview)
	})
	setTimeout(() => {
		chrome.storage.local.get([troopneededkey, troopsOverviewkey], (result) => {
			const villageList = result[troopneededkey] || []
			const troopsOverview = result[troopsOverviewkey] || {}
			renderResult(villageList, troopsOverview)
		})
	}, 500)
})
