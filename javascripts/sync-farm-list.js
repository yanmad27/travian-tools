function syncFarmList() {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabs[0].id },
					function: () => {
						const farmListIds = []
						const farmListDOM = document.querySelectorAll('#rallyPointFarmList .farmListHeader .dragAndDrop')
						farmListDOM.forEach((item) => {
							farmListIds.push(Number(item.getAttribute('data-list')))
						})

						function getVictims(farmlistId) {
							const farmlist = document.querySelector(`[data-list="${farmlistId}"]`).parentElement.parentElement.querySelector('tbody')

							const farms = []
							farmlist.childNodes.forEach((child, index) => {
								if (index === farmlist.childNodes.length - 1) return
								let name = child.querySelector('[class="target"] span').innerHTML
								if (name.includes('coordinate')) {
									name = `Oasis ${child.querySelector('[class="target"] [class="coordinateX"]').innerHTML}|${child.querySelector('[class="target"] [class="coordinateY"]').innerHTML}`
									name = name.replace(/\.|\,|\u202D|\u202C/g, '')
								}
								const troops = Number(child.querySelector('[class="troops"] [class="value"]').innerHTML)
								const item = {
									_no: index + 1,
									id: Number(child.querySelector('[class="selection"] input').getAttribute('data-slot-id')),
									interval: troops < 20 ? 5 : 30,
									active: troops < 20,
									attackTroops: troops,
									name: name,
								}
								farms.push(item)
							})
							return farms
						}

						const farmList = []
						for (const id of farmListIds) {
							farmList.push({
								_no: farmList.length + 1,
								id: id,
								active: true,
								victims: getVictims(id),
							})
						}
						return farmList
					},
				},
				(result) => {
					const farmList = result[0].result
					console.log(farmList)
					navigator.clipboard.writeText(JSON.stringify(farmList))
				},
			)
		})
	} catch (error) {
		console.error('Error in syncFarmList:', error)
		// document.getElementById('result').innerHTML = 'Error syncing farm list. Please check the console for details.'
	}
}

document.getElementById('syncFarmList').addEventListener('click', () => {
	syncFarmList()
})
