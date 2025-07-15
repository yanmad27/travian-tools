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

class Victim {
	constructor(victim) {
		this.victim = victim
	}

	async getLastRaidTime() {
		const time = this.victim.querySelector('td.lastRaid .lastRaidWrapper .lastRaidReport .value')?.innerHTML
		if (time?.includes('yesterday')) return new Date(Date.now() - 24 * 60 * 60 * 1000)
		if (time?.includes('.')) {
			const [day, month, year] = time.split('.')
			return new Date(year, month - 1, day)
		}
		if (time?.includes(':')) {
			const nowYear = new Date().getFullYear()
			const nowMonth = new Date().getMonth() + 1
			const nowDay = new Date().getDate()
			const [hours, minutes, seconds] = time.split(':')
			return new Date(`${nowYear}-${nowMonth}-${nowDay} ${hours}:${minutes}:${seconds}`)
		}
		return new Date()
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

	async getName() {
		try {
			const victim = this.victim
			this.name = victim?.querySelector('[class="target"] a span')?.innerHTML || 'Unknown'
			if (this.name.includes('coordinate')) {
				const coordX = victim.querySelector('[class="target"] [class="coordinateX"]').innerHTML
				const coordY = victim.querySelector('[class="target"] [class="coordinateY"]').innerHTML
				this.name = `Oasis ${coordX}|${coordY}`.replace(/\.|\,|\u202D|\u202C/g, '')
			}
			return this.name || 'Unknown'
		} catch {
			return 'Unknown'
		}
	}

	async activate() {
		try {
			this.victim.querySelector('td.openContextMenu a').click()
			await sleep(random(500, 1_000))
			this.victim.querySelector('td.openContextMenu button.activate').click()
			await sleep(random(500, 1_000))
		} catch (error) {
			console.log('LOG ~ activate ~ error:', error)
		}
	}

	async deactivate() {
		try {
			this.victim.querySelector('td.openContextMenu a').click()
			await sleep(random(500, 1_000))
			this.victim.querySelector('td.openContextMenu button.deactivate').click()
			await sleep(random(500, 1_000))
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
		const lastRaidTime = await victim.getLastRaidTime()
		const now = new Date()
		const secondDiff = now - lastRaidTime
		const isReActivateFromUser = secondDiff > 1 * 60 * 60 * 1000
		if (!isDisabled && !isAttackWithoutLosses && !isReActivateFromUser) {
			logWarning('Deactivating victim', 'victim', await victim.getName(), 'reason', 'attack with losses')
			await victim.deactivate()
			await sleep(random(500, 1_000))
		}
	}
}

const main = async () => {
	try {
		await checkVictims()
		await sleep(random(1_000, 15_000))
		await triggerRaid()
	} catch (error) {
		logError('Failed to check victims', 'err', error)
	}
}

// Run the main function in a loop with random intervals
const runWithRandomInterval = async (waiting) => {
	await sleep(waiting * 60 * 1000)
	let iteration = 0
	let previousWaitMinutes = null

	while (true) {
		await main()
		const waitArrs = [4.5, 4.5, 4.6, 4.7, 4.6, 4.5, 4.6, 4.5]
		// average 4.55
		const waitMinutes = waitArrs[iteration % waitArrs.length]

		const waitMs = waitMinutes * 60 * 1000
		logInfo('Waiting', 'minutes', waitMinutes)
		await sleep(waitMs)
		previousWaitMinutes = waitMinutes
		iteration++
	}
}
runWithRandomInterval(2)
