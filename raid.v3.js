const INTERVAL = 7
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const random = (min, max) => min + Math.floor(Math.random() * max)
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

class Victim {
	constructor(victim) {
		this.victim = victim
	}

	async isAttackWithoutLosses() {
		const lastRaidState = this.victim.querySelector('td.lastRaid i.lastRaidState')
		if (!lastRaidState) return true
		const lastRaidStateClass = lastRaidState.getAttribute('class')
		return lastRaidStateClass.includes('attack_won_withoutLosses_small')
	}

	async isDisabled() {
		return this.victim.getAttribute('class')?.includes('disabled')
	}

	async activate() {
		try {
			this.victim.querySelector('td.openContextMenu a').click()
			await sleep(500)
			this.victim.querySelector('td.openContextMenu button.activate').click()
			await sleep(500)
		} catch (error) {
			console.log('LOG ~ activate ~ error:', error)
		}
	}

	async deactivate() {
		try {
			this.victim.querySelector('td.openContextMenu a').click()
			await sleep(500)
			this.victim.querySelector('td.openContextMenu button.deactivate').click()
			await sleep(500)
		} catch (error) {
			console.log('LOG ~ deactivate ~ error:', error)
		}
	}
}

const checkVictims = async () => {
	const victims = document.querySelectorAll('tr.slot')
	for (let i = 0; i < victims.length; i++) {
		const victimElement = victims[i]
		const victim = new Victim(victimElement)
		const isDisabled = await victim.isDisabled()
		const isAttackWithoutLosses = await victim.isAttackWithoutLosses()
		if (!isDisabled && !isAttackWithoutLosses) {
			logWarning('Deactivating victim', 'index', i, 'reason', 'attack without losses')
			await victim.deactivate()
			await sleep(500)
		}
	}
}

const main = async () => {
	try {
		await checkVictims()
		await sleep(random(1000, 10_000))
		await triggerRaid()
	} catch (error) {
		logError('Failed to check victims', 'err', error)
	}
}

main()
setInterval(main, INTERVAL * 60 * 1000)
