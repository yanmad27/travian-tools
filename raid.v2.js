const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const random = (min, max) => min + Math.floor(Math.random() * max)
const logInfo = (message) => console.log(`${new Date().toLocaleString()} ~ %c${message}`, 'color: blue; font-weight: bold;')
const logError = (message) => console.log(`${new Date().toLocaleString()} ~ %c${message}`, 'color: red; font-weight: bold;')
const logSuccess = (message) => console.log(`${new Date().toLocaleString()} ~ %c${message}`, 'color: #5a9a0a; font-weight: bold;')
const logWarning = (message) => console.log(`${new Date().toLocaleString()} ~ %c${message}`, 'color: orange; font-weight: bold;')

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

	async select() {
		try {
			await sleep(random(1000, 5000))
			this.attempts++
			if (this.attempts >= this.maxAttempts) throw new Error('Max attempts reached')

			const victim = this.getVictimElement()
			if (!victim) throw new Error('Victim element not found')

			const checkBox = victim.querySelector('[class="selection"] input')
			if (!checkBox) throw new Error('Checkbox not found')

			if (!checkBox.checked) {
				checkBox.click()

				if (!checkBox.checked && this.attempts < this.maxAttempts) {
					logWarning(`Retrying to select victim ${this.getName()} (${this.attempts}/${this.maxAttempts})`)
					await sleep(random(1000, 5000))
					return await this.select()
				}
			}

			this.attempts = 0
			logSuccess(`Selected victim ${this.getName()}`)
		} catch (error) {
			logError(`Error selecting victim ${this.getName()}:`, error)
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
			return this.name
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
		this.intervalId = setInterval(
			async () => {
				await this.select()
			},
			this.interval * 60 * 1000,
		)
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
			logError(`Error toggling farm list ${this.getName()}`, error)
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
		} catch (error) {
			logError(`Error triggering raid for farm list ${this.id}-${this.getName()}:`, error)
		}
	}

	start() {
		this.stop()
		this.intervalId = setInterval(
			() => {
				if (this.isCollapsed()) this.toggleCollapse()
				if (this.hasAtLeastOneActiveVictim()) this.triggerRaid()
			},
			this.interval * 60 * 1000,
		)
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
		this.victims = farmLists.flatMap((fl) => fl.victims)
		this.activeFarmLists = new Map()
		this.activeVictims = new Map()
		this.healthCheckInterval = null
	}

	initialize() {
		logInfo('Initializing farm bot...')
		this.farmLists.forEach(async (farmListData, i) => {
			await sleep(i * 5000)
			const farmList = new FarmList(farmListData.id, 15)
			this.activeFarmLists.set(farmListData.id, farmList)
			if (farmList.isCollapsed()) farmList.toggleCollapse()
			await sleep(5000)
			farmList.start()
		})

		this.victims.forEach(async (victimData, i) => {
			if (!victimData.active) return
			await sleep(i * 5 * 1000)
			const victim = new Victim(victimData.id, victimData.interval)
			this.activeVictims.set(victimData.id, victim)

			// Wait if currently raiding
			let waitTime = 0
			while (victim.isRaiding() && waitTime < victim.interval * 60 * 1000) {
				await sleep(5000)
				waitTime += 5000
			}

			await victim.select()
			victim.start()
		})

		this.startHealthCheck()
	}

	async activateVictim(id, interval) {
		try {
			const victim = new Victim(id, interval)
			this.activeVictims.set(id, victim)

			let waitTime = 0
			while (victim.isRaiding() && waitTime < victim.interval * 60 * 1000) {
				await sleep(5000)
				waitTime += 5000
			}

			logInfo(`Activated victim ${id} ${victim.getName()}`)
			await victim.select()
			victim.start()
		} catch (error) {
			logError(`Error activating victim ${id}:`, error)
		}
	}

	async deactivateVictim(id) {
		try {
			const victim = this.activeVictims.get(id)
			if (!victim) throw new Error('Victim not found')
			victim.stop()
			this.activeVictims.delete(id)
			logInfo(`Deactivated victim ${id} ${victim.getName()}`)
		} catch (error) {
			logError(`Error deactivating victim ${id}:`, error)
		}
	}

	startHealthCheck() {
		this.healthCheckInterval = setInterval(() => {
			logInfo('Running health check...')

			this.activeFarmLists.forEach((farmList) => {
				if (!farmList.baseElement.exists()) {
					logWarning(`Farm list ${farmList.id} element missing, restarting...`)
					farmList.stop()
					farmList.start()
				}
			})

			this.activeVictims.forEach((victim) => {
				if (!victim.baseElement.exists()) {
					logWarning(`Victim ${victim.id} element missing, restarting...`)
					victim.stop()
					victim.start()
				}
			})
		}, 600000)
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
		id: 1817,
		victims: [
			{ id: 77022, interval: 10, active: true, name: 'Deli`s village' },
			{ id: 62034, interval: 10, active: true, name: 'Azamat`s village' },
			{ id: 61851, interval: 10, active: true, name: 'Lalala`s F' },
			{ id: 70221, interval: 10, active: true, name: 'Baki' },
			{ id: 55464, interval: 10, active: true, name: 'An nghĩa đường' },
			{ id: 77969, interval: 10, active: true, name: 'KOR1 | Kennametal' },
			{ id: 62318, interval: 10, active: true, name: 'shoes19944116' },
			{ id: 79225, interval: 10, active: true, name: '01.SharkTank' },
			{ id: 77952, interval: 10, active: true, name: 'GunDummm`s village' },
			{ id: 77019, interval: 10, active: true, name: 'Athena`s village' },
			{ id: 78863, interval: 10, active: true, name: 'New village' },
			{ id: 81112, interval: 10, active: true, name: '02.SharkTank' },
			{ id: 43830, interval: 10, active: true, name: 'ab1` F' },
			{ id: 65832, interval: 10, active: true, name: 'Dorf von Djimmy98' },
			{ id: 62443, interval: 10, active: true, name: 'Mr.Piet 01' },
			{ id: 62444, interval: 10, active: true, name: 'Mr.Piet 00' },
			{ id: 62081, interval: 10, active: true, name: '01.Caheo' },
			{ id: 77006, interval: 10, active: true, name: 'vuthanh16`s village' },
			{ id: 48393, interval: 10, active: true, name: 'Lyly 01' },
			{ id: 80219, interval: 10, active: true, name: 'ngentod' },
			{ id: 77012, interval: 10, active: true, name: '00' },
			{ id: 70233, interval: 10, active: true, name: 'harry83820`s village' },
			{ id: 77024, interval: 10, active: true, name: '01. Em ne' },
			{ id: 77912, interval: 10, active: true, name: '1' },
			{ id: 77023, interval: 10, active: true, name: 'İNEK' },
			{ id: 77016, interval: 10, active: true, name: 'Làng của SkyOne' },
			{ id: 69810, interval: 10, active: true, name: '.' },
			{ id: 78862, interval: 10, active: true, name: 'TEA' },
			{ id: 80220, interval: 10, active: true, name: 'Desa binbin' },
			{ id: 69807, interval: 10, active: true, name: 'A' },
		],
	},
	{
		id: 1732,
		victims: [
			{ id: 61858, interval: 10, active: true, name: '02Camap' },
			{ id: 51230, interval: 10, active: true, name: 'Làng của abcd' },
			{ id: 46845, interval: 10, active: true, name: 'Hopeful`s F' },
		],
	},
	{
		id: 2291,
		victims: [],
	},
]

const bot = new FarmBot(farmLists)
bot.initialize()
