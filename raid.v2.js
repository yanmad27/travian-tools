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

class DOMElementHandler {
	constructor(selector) {
		this.selector = selector
		this.getElement = () => document.querySelector(this.selector)
		this.getFreshElement = () => document.querySelector(this.selector)
		this.exists = () => this.getFreshElement() !== null
	}
}

class Victim {
	constructor(id, interval) {
		this.id = id
		this.name = ''
		this.interval = interval
		this.intervalId = null
		this.attempts = 0
		this.maxAttempts = 5
		this.baseElement = new DOMElementHandler(`[data-slot-id="${id}"]`)
	}

	getVictimElement() {
		const base = this.baseElement.getFreshElement()
		return base?.parentNode?.parentNode?.parentNode
	}

	async lastRaidWonWithoutLosses() {
		const victim = this.getVictimElement()
		const lastRaidElm = victim.querySelector('[class~="lastRaidState"]')
		const lastRaidElmClass = lastRaidElm.getAttribute('class')
		return lastRaidElmClass.includes('attack_won_withoutLosses_small')
	}

	async select() {
		try {
			await sleep(random(1000, 5000))
			this.attempts++
			if (this.attempts >= this.maxAttempts) throw new Error('Max attempts reached')

			const victim = this.getVictimElement()
			if (!victim) throw new Error('Victim element not found')

			if (!(await this.lastRaidWonWithoutLosses())) {
				logWarning('Last raid lost, skipping...', 'id', this.id, 'name', this.getName())
				return
			}

			const checkBox = victim.querySelector('[class="selection"] input')
			if (!checkBox) throw new Error('Checkbox not found')

			if (!checkBox.checked) {
				checkBox.click()

				if (!checkBox.checked && this.attempts < this.maxAttempts) {
					logWarning('Retrying to select victim', 'name', this.getName(), 'attempts', this.attempts, 'max', this.maxAttempts)
					await sleep(random(1000, 5000))
					return await this.select()
				}
			}

			this.attempts = 0
			logSuccess('Select victim', 'id', this.id, 'name', this.getName())
		} catch (error) {
			logError('Error selecting victim', 'id', this.id, 'err', error)
			if (this.attempts >= this.maxAttempts) {
				this.attempts = 0
				this.stop()
			}
		}
	}

	getName() {
		try {
			const victim = this.getVictimElement()
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

	isRaiding() {
		try {
			const victim = this.getVictimElement()
			return victim?.querySelector('[class="state"]')?.children?.length !== 0
		} catch {
			return false
		}
	}

	isNotEnoughTroops() {
		try {
			const victim = this.getVictimElement()
			return victim?.querySelector('[class="state"]')?.children?.length === 2
		} catch {
			return false
		}
	}

	start() {
		this.stop()
		this.intervalId = setInterval(async () => {
			await this.select()
		}, this.interval * 60_000)
	}

	stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId)
			this.intervalId = null
		}
	}
}

class FarmList {
	constructor(id, interval) {
		this.id = id
		this.interval = interval
		this.intervalId = null
		this.baseElement = new DOMElementHandler(`[data-list="${id}"]`)
	}

	getListElement() {
		const base = this.baseElement.getFreshElement()
		return base?.parentNode
	}

	getName() {
		try {
			const list = this.getListElement()
			return list?.querySelector('[class="farmListName"] [class="name"]')?.innerHTML || 'Unknown'
		} catch {
			return 'Unknown'
		}
	}

	isCollapsed() {
		try {
			const list = this.getListElement()
			return list?.parentNode?.className?.includes('collapsed') || false
		} catch {
			return false
		}
	}

	toggleCollapse() {
		try {
			const list = this.getListElement()
			list?.querySelector('[class="expandCollapse"]')?.click()
		} catch (error) {
			logError('Error toggling farm list', 'name', this.getName(), 'err', error)
		}
	}

	hasAtLeastOneActiveVictim() {
		try {
			const victims = document.querySelectorAll(`tbody [data-farm-list-id="${this.id}"]`)
			return Array.from(victims).some((v) => v.checked)
		} catch {
			return false
		}
	}

	triggerRaid() {
		try {
			const list = this.getListElement()
			list?.querySelector('[class="farmListName"] [class="name"]')?.click()
			list?.querySelector('button')?.click()
			logSuccess('🚀 Raiding...', 'id', this.id, 'name', this.getName())
		} catch (error) {
			logError('Error triggering raid for farm list', 'id', this.id, 'name', this.getName(), 'err', error)
		}
	}

	start() {
		this.stop()
		this.intervalId = setInterval(async () => {
			await sleep(random(0, 5000))
			if (this.isCollapsed()) this.toggleCollapse()
			if (this.hasAtLeastOneActiveVictim()) this.triggerRaid()
		}, this.interval * 1000)
	}

	stop() {
		if (this.intervalId) {
			clearInterval(this.intervalId)
			this.intervalId = null
		}
	}
}

class FarmBot {
	constructor(farmLists) {
		this.farmLists = farmLists
		this.victims = farmLists.filter((fl) => fl.active).flatMap((fl) => fl.victims)
		this.activeFarmLists = new Map()
		this.activeVictims = new Map()
		this.healthCheckInterval = null
	}

	syncVictims() {
		const domVictims = document.querySelectorAll('#rallyPointFarmList .slots tr.slot td.selection label.checkbox input')
		let cnt = 0
		for (const v of domVictims) {
			const id = Number(v.getAttribute('data-slot-id'))
			if (this.activeVictims.has(id)) continue
			logInfo('Syncing new victim', 'id', id)
			this.activateVictim(id, 5)
			cnt++
		}
		if (cnt) logInfo('Total new victims synced', 'count', cnt)
	}

	initialize(isWaiting = false) {
		logInfo('Initializing farm bot...')
		this.farmLists.forEach(async (farmListData, i) => {
			const farmListInterval = 10
			const farmList = new FarmList(farmListData.id, this.farmLists.length * farmListInterval)
			this.activeFarmLists.set(farmListData.id, farmList)
			await sleep(i * farmListInterval * 1_000)
			if (farmList.isCollapsed()) farmList.toggleCollapse()
			await sleep(farmListInterval * 1_000)
			farmList.start()
		})

		this.victims.forEach(async (victimData, i) => {
			if (!victimData.active) return
			const victim = new Victim(victimData.id, victimData.interval)
			this.activeVictims.set(victimData.id, victim)
			await sleep(i * 10_000)

			// Wait if currently raiding
			if (isWaiting) {
				let waitTime = 0
				while (victim.isRaiding() && waitTime < victim.interval * 60 * 1000) {
					await sleep(5_000)
					waitTime += 5_000
				}
			}

			await victim.select()
			victim.start()
		})

		this.startHealthCheck()
	}

	async activateVictim(id, interval = 5, isWaiting = false) {
		try {
			const victim = new Victim(id, interval)
			this.activeVictims.set(id, victim)

			if (isWaiting) {
				let waitTime = 0
				while (victim.isRaiding() && waitTime < victim.interval * 60 * 1000) {
					await sleep(5_000)
					waitTime += 5_000
				}
			}

			logInfo('Activated victim', 'id', id, 'name', victim.getName())
			await victim.select()
			victim.start()
		} catch (error) {
			logError('Error activating victim', 'id', id, 'err', error)
		}
	}

	async deactivateVictim(id) {
		try {
			const victim = this.activeVictims.get(id)
			if (!victim) throw new Error('Victim not found')
			victim.stop()
			this.activeVictims.delete(id)
			logInfo('Deactivated victim', 'id', id, 'name', victim.getName())
		} catch (error) {
			logError('Error deactivating victim', 'id', id, 'err', error)
		}
	}

	startHealthCheck() {
		this.healthCheckInterval = setInterval(() => {
			logInfo('Running health check...')

			this.activeFarmLists.forEach((farmList) => {
				if (!farmList.baseElement.exists()) {
					logWarning('Farm list element missing, restarting...', 'id', farmList.id, 'name', farmList.getName())
					farmList.stop()
					farmList.start()
				}
			})

			this.activeVictims.forEach((victim) => {
				if (!victim.baseElement.exists()) {
					logWarning('Victim element missing, restarting...', 'id', victim.id, 'name', victim.getName())
					victim.stop()
					this.activeVictims.delete(victim.id)
				}
			})

			this.syncVictims()
		}, 300000)
	}

	stop() {
		this.activeFarmLists.forEach((farmList) => farmList.stop())
		this.activeVictims.forEach((victim) => victim.stop())

		if (this.healthCheckInterval) clearInterval(this.healthCheckInterval)

		this.activeFarmLists.clear()
		this.activeVictims.clear()
	}
}

const farmLists = [
	{
		_no: 1,
		active: true,
		id: 1045,
		victims: [
			{ _no: 1, active: true, attackTroops: 1, distance: 13, id: 30684, interval: 5, name: '1' },
			{ _no: 2, active: true, attackTroops: 1, distance: 13.5, id: 31601, interval: 5, name: 'toppydoppy`s village' },
			{ _no: 3, active: true, attackTroops: 1, distance: 18.4, id: 31562, interval: 5, name: 'Sloth' },
			{ _no: 4, active: true, attackTroops: 1, distance: 20, id: 30780, interval: 5, name: 'Aldeia do Tempo' },
			{ _no: 5, active: true, attackTroops: 1, distance: 22, id: 36187, interval: 5, name: 'northern的村莊' },
			{ _no: 6, active: true, attackTroops: 1, distance: 31.1, id: 46730, interval: 5, name: 'Pilat`s village' },
			{ _no: 7, active: true, attackTroops: 1, distance: 32.3, id: 32202, interval: 5, name: 'Satul lui Winnetou' },
			{ _no: 8, active: true, attackTroops: 1, distance: 37.2, id: 46738, interval: 5, name: 'rzK9mz7YD`s village' },
			{ _no: 9, active: true, attackTroops: 1, distance: 41.2, id: 47862, interval: 5, name: 'Aldea de Panrro' },
			{ _no: 10, active: true, attackTroops: 1, distance: 43.4, id: 47864, interval: 5, name: 'Aldea de licha22' },
		],
	},
	{
		_no: 2,
		active: true,
		id: 1436,
		victims: [
			{ _no: 1, active: true, attackTroops: 1, distance: 2, id: 46440, interval: 5, name: 'Oasis (40|−62)' },
			{ _no: 2, active: true, attackTroops: 1, distance: 3, id: 46441, interval: 5, name: 'Oasis (40|−67)' },
			{ _no: 3, active: true, attackTroops: 1, distance: 3.2, id: 46442, interval: 5, name: 'Oasis (41|−67)' },
			{ _no: 4, active: true, attackTroops: 1, distance: 3.6, id: 46443, interval: 5, name: 'Oasis (42|−67)' },
			{ _no: 5, active: true, attackTroops: 1, distance: 3.6, id: 46444, interval: 5, name: 'Oasis (37|−66)' },
			{ _no: 6, active: true, attackTroops: 1, distance: 4.1, id: 46445, interval: 5, name: 'Oasis (41|−60)' },
			{ _no: 7, active: true, attackTroops: 1, distance: 4.5, id: 46446, interval: 5, name: 'Oasis (38|−68)' },
			{ _no: 8, active: true, attackTroops: 1, distance: 5, id: 46447, interval: 5, name: 'Oasis (35|−64)' },
			{ _no: 9, active: true, attackTroops: 1, distance: 5.4, id: 49771, interval: 5, name: 'Oasis (38|−69)' },
			{ _no: 10, active: true, attackTroops: 1, distance: 5.8, id: 47703, interval: 5, name: 'Oasis (37|−59)' },
			{ _no: 11, active: true, attackTroops: 1, distance: 5.8, id: 49647, interval: 5, name: 'Oasis (45|−61)' },
			{ _no: 12, active: true, attackTroops: 1, distance: 6.4, id: 46783, interval: 5, name: 'Oasis (35|−68)' },
			{ _no: 13, active: false, attackTroops: 1, distance: 7.1, id: 49648, interval: 5, name: 'Oasis (47|−63)' },
		],
	},
]
const bot = new FarmBot(farmLists)
bot.initialize()
