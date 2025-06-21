const SERVER_SPEED = 2
const TROOPS_BASE_SPEED = {
	tribe7: {
		t4: 16,
		t6: 14,
	},
}

function calculateTroopsNeeded() {
	const intervalInput = document.getElementById('interval')
	const interval = parseFloat(intervalInput.value) || 6 // Default 10 minutes if not set

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript(
			{
				target: { tabId: tabs[0].id },
				function: () => {
					// Extract farm list data from the page
					const farmListIds = []
					const farmListDOM = document.querySelectorAll('#rallyPointFarmList .farmListHeader .dragAndDrop')
					farmListDOM.forEach((item) => {
						farmListIds.push(Number(item.getAttribute('data-list')))
					})

					function getVictims(farmlistId) {
						const farmlistContainer = document.querySelector(`[data-list="${farmlistId}"]`).parentElement.parentElement
						const farmlist = farmlistContainer.querySelector('tbody')
						if (!farmlist) return []

						const farms = []
						// Get all TR elements instead of childNodes to avoid text nodes
						const rows = farmlist.querySelectorAll('tr')

						rows.forEach((child, index) => {
							// Skip the last row if it's the "add slot" row
							if (child.querySelector('.addSlot')) return

							// Get farm name
							const targetElement = child.querySelector('.target span')
							if (!targetElement) return

							let name = targetElement.innerHTML || ''
							if (name.includes('coordinate')) {
								const coordX = child.querySelector('.target .coordinateX')?.innerHTML || ''
								const coordY = child.querySelector('.target .coordinateY')?.innerHTML || ''
								name = `Oasis ${coordX}|${coordY}`
								name = name.replace(/\.|\,|\u202D|\u202C/g, '')
							}

							// Extract data
							const troopsElement = child.querySelector('.troops .value')
							const distanceElement = child.querySelector('.distance span')

							if (!troopsElement || !distanceElement) return

							const troops = Number(troopsElement.innerHTML || 0)
							const distance = Number(distanceElement.innerHTML || 0)
							const active = !child.classList.contains('disabled')

							farms.push({
								_no: farms.length + 1,
								id: Number(child.querySelector('.selection input')?.getAttribute('data-slot-id') || 0),
								name: name,
								distance: distance,
								currentTroops: troops,
								active: active,
							})
						})

						console.log(`Farm list ${farmlistId} has ${farms.length} victims`)
						return farms
					}

					const farmLists = []
					for (const id of farmListIds) {
						const header = document.querySelector(`[data-list="${id}"]`).parentElement
						const listName = header.querySelector('.farmListName')?.textContent || `Farm List ${id}`

						const victims = getVictims(id)
						if (victims.length > 0) {
							farmLists.push({
								id: id,
								name: listName,
								victims: victims,
							})
						}
					}
					return farmLists
				},
			},
			(result) => {
				if (!result || !result[0] || !result[0].result) {
					document.getElementById('troops-needed-result').innerHTML = '<p style="color: red;">Error: Could not extract farm list data. Make sure you are on the Rally Point farm list page.</p>'
					return
				}

				const farmLists = result[0].result
				const resultDiv = document.getElementById('troops-needed-result')

				// Calculate troops needed for each victim
				let html = '<div class="troops-calculation">'
				let grandTotal = 0

				farmLists.forEach((farmList) => {
					if (farmList.victims.length === 0) return

					let totalTroopsNeeded = 0
					let activeVictimCount = 0

					farmList.victims.forEach((victim) => {
						if (!victim.active) return

						activeVictimCount++

						// Calculate travel time in minutes (one way)
						// Using t6 speed (14 fields/hour) as default
						const troopSpeed = TROOPS_BASE_SPEED.tribe7.t6 * SERVER_SPEED
						const travelTimeOneWay = (Number(victim.distance) / troopSpeed) * 60 // in minutes
						const roundTripTime = travelTimeOneWay * 2

						// Calculate how many raids can fit in the interval
						const raidsPerInterval = Math.floor(roundTripTime / interval)

						// Troops needed = current troops * raids that can fit in interval
						const troopsNeeded = Math.ceil(victim.currentTroops * raidsPerInterval)
						totalTroopsNeeded += troopsNeeded
					})

					grandTotal += totalTroopsNeeded

					if (activeVictimCount > 0) {
						html += `<div class="farm-list-total">`
						html += `<span class="list-name">${farmList.name}</span>`
						html += `<span class="victim-count">(${activeVictimCount} active farms)</span>`
						html += `<span class="total-troops">${totalTroopsNeeded} troops</span>`
						html += `</div>`
					}
				})

				html += `<div class="grand-total">`
				html += `<span>Total Troops Needed:</span>`
				html += `<span class="total-value">${grandTotal}</span>`
				html += `</div>`

				html += '</div>'
				html += `<p class="calculation-info">Calculated with ${interval} minute interval, using T6 cavalry speed (${TROOPS_BASE_SPEED.tribe7.t6 * SERVER_SPEED} fields/hour)</p>`

				resultDiv.innerHTML = html
			},
		)
	})
}

// Add event listener for the interval input
document.addEventListener('DOMContentLoaded', () => {
	const intervalInput = document.getElementById('interval')
	const calculateButton = document.createElement('button')
	calculateButton.textContent = 'Calculate'
	calculateButton.id = 'calculateTroopsNeeded'
	intervalInput.parentElement.appendChild(calculateButton)

	calculateButton.addEventListener('click', calculateTroopsNeeded)

	// Allow calculation on Enter key
	intervalInput.addEventListener('keypress', (e) => {
		if (e.key === 'Enter') {
			calculateTroopsNeeded()
		}
	})
})
