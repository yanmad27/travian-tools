function highlightTroops() {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				function: () => {
					document.querySelectorAll('[class~="unit"]').forEach((el) => {
						const unitCount = Number(el.innerHTML)
						if (unitCount !== 0) {
							el.style.color = 'white'
							el.style.background = 'green'
							switch (true) {
								case unitCount > 100:
									el.style.background = 'yellow'
									break
								case unitCount > 50:
									el.style.background = 'orange'
									break
								default:
									el.style.background = 'green'
									break
							}
						}
					})
				},
			})
		})
	} catch (error) {
		console.error('Error in highlightTroops:', error)
	}
}

document.addEventListener('DOMContentLoaded', () => {
	const highlightTroopsButton = document.getElementById('highlightTroops')
	highlightTroopsButton.addEventListener('click', highlightTroops)
	highlightTroops()
})
