const troopneededkey = 'troopsNeeded'

const renderResult = (farmList) => {
	const troopsImgPath = 'https://cdn.legends.travian.com/gpack/155.5/img_ltr/global/units/hun/icon/hun_small.png'
	// const interval = Number(document.getElementById('interval').value)
	const result = document.getElementById('troops-needed-result')
	for (const farm of farmList) {
		const farmName = farm.name
		const victimList = farm.victimList
		const sumTroops = {
			t1: 0,
			t2: 0,
			t3: 0,
			t4: 0,
			t5: 0,
			t6: 0,
			t7: 0,
		}
		for (const victim of victimList) {
			for (const [key, value] of Object.entries(victim.troops)) {
				sumTroops[key] += value
			}
		}

		result.innerHTML += `
              <div class="farm-item">
                <div class="farm-name">${farmName}</div>
                <div class="farm-troops">
                  ${Object.entries(sumTroops)
						.map(([key, value]) => {
							if (value === 0) return ''
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
							return `<div style="display: flex; align-items: center; gap: 8px;">
                      <div style="margin-left: 20px;background-image: url(${troopsImgPath});width: 16px;height: 16px;display: inline-block;vertical-align: bottom;background-position: ${backgroundPosition};" />
                      <div style="margin-left: 20px">${value}</div>
                    </div>`
						})
						.join('')}
                </div>
              </div>`
	}
}
function saveToStorage(data) {
	chrome.storage.local.set({ [troopneededkey]: data }, () => {
		renderResult(data)
	})
}

const getTroopNeeded = () => {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabs[0].id },
					function: () => {
						const BASE_INTERVAL = 6
						const SLOWEST_SPEED = 28
						const getTroops = (totalLoop, troopsElem) => {
							const getTroops = (selector) => {
								return isNaN(Number(troopsElem.querySelector(selector)?.parentNode.querySelector('.value').innerHTML)) ? 0 : Number(troopsElem.querySelector(selector)?.parentNode.querySelector('.value').innerHTML)
							}
							return {
								t1: getTroops('i.t1') * totalLoop,
								t2: getTroops('i.t2') * totalLoop,
								t3: getTroops('i.t3') * totalLoop,
								t4: getTroops('i.t4') * totalLoop,
								t5: getTroops('i.t5') * totalLoop,
								t6: getTroops('i.t6') * totalLoop,
								t7: getTroops('i.t7'),
							}
						}
						const farmListElems = document.querySelectorAll('.farmListWrapper')
						const farmList = []
						for (const farmListElem of farmListElems) {
							const name = farmListElem.querySelector('.farmListName .name').innerHTML
							const victimListElem = farmListElem.querySelectorAll('tr.slot')
							const victimList = []
							for (const victimElem of victimListElem) {
								const isDisabled = victimElem.getAttribute('class')?.includes('disabled')
								const id = victimElem.querySelector('[class="selection"] input').getAttribute('data-slot-id')
								const distance = Number(victimElem.querySelector('.distance span').innerHTML)
								const totalLoop = (60 * 2 * distance) / SLOWEST_SPEED / BASE_INTERVAL
								const ceilTotalLoop = Math.ceil(totalLoop)
								const troops = getTroops(ceilTotalLoop, victimElem.querySelector('td.troops div'))
								const item = {
									id,
									distance,
									troops,
									isDisabled,
								}
								if (isDisabled) continue
								victimList.push(item)
							}
							farmList.push({
								name,
								victimList,
							})
						}
						return farmList
					},
				},
				(results) => {
					const farmList = results[0].result
					if (farmList.length === 0) return
					saveToStorage(farmList)
				},
			)
		})
	} catch (error) {
		console.log('LOG ~ getTroopNeeded ~ error:', error)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	getTroopNeeded()
	chrome.storage.local.get([troopneededkey], (result) => {
		const farmList = result[troopneededkey] || []
		console.log('LOG ~ chrome.storage.local.get ~ farmList:', farmList)
		renderResult(farmList)
	})
})
