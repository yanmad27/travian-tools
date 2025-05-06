// background.js
const paths = ['/patients', '/patient-overview']
const domain = 'https://test.garrio.dev/pro/praxis'

async function getData() {
	for (const path of paths) {
		await chrome.tabs.update({ url: domain + path }, (tab) => {
			chrome.scripting.executeScript({
				target: { tabId: tab.id },
				files: ['content-script.js'],
			})
		})
		await new Promise((resolve) => setTimeout(resolve, 5000))
	}
}
getData()

// background.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.type === 'data') {
		console.log('Data from:', request.payload.url, request.payload)
		// Store or process data (e.g., in chrome.storage)
	}
})
