const lsk_prefix = 'reportProduction'
const lsk_report1 = `${lsk_prefix}1`
const lsk_report2 = `${lsk_prefix}2`
const lsk_productionPerHour = 'productionPerHour'
function saveProductionToStorage({ reportIndex, datetime, timestamp, production }) {
	const key = `${lsk_prefix}${reportIndex}`
	chrome.storage.local.set({ [key]: { datetime, timestamp, production } }, () => {
		updateReportProduction(reportIndex, { datetime, timestamp, production })
		saveReportProduction()
	})
}

function saveReportProduction() {
	chrome.storage.local.get([lsk_report1, lsk_report2], (result) => {
		const reportProduction1 = result[lsk_report1]
		const reportProduction2 = result[lsk_report2]
		if (!reportProduction1 || !reportProduction2) return
		const production1 = reportProduction1.production
		const production2 = reportProduction2.production
		const timestamp1 = reportProduction1.timestamp
		const timestamp2 = reportProduction2.timestamp

		const timeDiff = Math.abs(timestamp1 - timestamp2) / 1000
		const productionDiff = Math.abs(production1 - production2)
		const productionPerHour = (productionDiff / timeDiff) * 3600

		chrome.storage.local.set({ [lsk_productionPerHour]: productionPerHour }, () => {
			document.getElementById('report-result').innerText = productionPerHour.toFixed(0)
		})
	})
}
function updateReportProduction(reportIndex, { datetime, production }) {
	document.getElementById(`report${reportIndex}-datetime`).innerText = datetime
	document.getElementById(`report${reportIndex}-production`).innerText = production
}

function getReport(reportIndex) {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabs[0].id },
					function: () => {
						const datetime = document.querySelector('[id="reportWrapper"] [class="header "] [class="time"] [class="text"]').innerText

						function getTimestamp(dateString) {
							const [datePart, timePart] = dateString.split(', ')
							const [day, month, year] = datePart.split('.')
							const [hours, minutes, seconds] = timePart.split(':')
							return new Date(
								2000 + Number.parseInt(year),
								Number.parseInt(month) - 1,
								Number.parseInt(day),
								Number.parseInt(hours),
								Number.parseInt(minutes),
								Number.parseInt(seconds),
							).getTime()
						}

						const timestamp = getTimestamp(datetime)

						const production = document.querySelectorAll('[class="additionalInformation"] [class="inlineIconList resourceWrapper"]')[1]
							.children[1].children[1].innerText
						return {
							datetime,
							timestamp,
							production: +production,
						}
					},
				},
				(results) => {
					const report = results[0].result
					const datetime = report.datetime
					const timestamp = report.timestamp
					const production = report.production
					saveProductionToStorage({ reportIndex, datetime, timestamp, production })
				},
			)
		})
	} catch (error) {
		console.error('Error in getReport:', error)
	}
}

// Add event listener when the popup loads
document.addEventListener('DOMContentLoaded', () => {
	const reportButton1 = document.getElementById('reportButton1')
	reportButton1.addEventListener('click', () => getReport(1))

	const reportButton2 = document.getElementById('reportButton2')
	reportButton2.addEventListener('click', () => getReport(2))

	chrome.storage.local.get([lsk_report1, lsk_report2, lsk_productionPerHour], (result) => {
		if (result[lsk_report1]) updateReportProduction(1, result[lsk_report1])
		if (result[lsk_report2]) updateReportProduction(2, result[lsk_report2])
		if (result[lsk_productionPerHour]) document.getElementById('report-result').innerText = result[lsk_productionPerHour].toFixed(0)
	})
})
