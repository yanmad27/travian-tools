const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const random = (min, max) => min + Math.floor(Math.random() * (max - min))
const logBase =
	(color) =>
	(message, ...args) => {
		const newArgs = [`color: ${color}; font-weight: bold;`]
		let baseMessage = `${new Date().toLocaleString()} ~ %c${message}`

		for (let i = 0; i < args.length; i += 2) {
			baseMessage += ` %c${args[i]}=%c${args[i + 1]}`
			newArgs.push('color: gray;')
			switch (typeof args[i + 1]) {
				case 'number':
					newArgs.push('color: rgb(146, 121, 241);')
					break
				case 'string':
					newArgs.push('color: white;')
					break
				default:
					newArgs.push('color: white;')
					break
			}
		}

		console.log(baseMessage, ...newArgs)
	}
const logInfo = logBase('blue')
const logError = logBase('red')
const logSuccess = logBase('#5a9a0a')
const logWarning = logBase('orange')

const triggerRaid = async () => {
	try {
		document.querySelector('#stickyWrapper > button.textButtonV2.buttonFramed.startAllFarmLists.rectangle.withText.green').click()
		logSuccess('Raid triggered')
	} catch (error) {
		logError('Failed to trigger raid')
	}
}

const main = async (waiting) => {
	await sleep(waiting * 60 * 1000)
	await triggerRaid()
	setInterval(triggerRaid, 5 * 60 * 1000 + random(0, 5 * 60 * 1000))
}

main(5)
