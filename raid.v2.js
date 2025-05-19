const style = document.createElement('style')
document.head.appendChild(style)

style.sheet.insertRule(
	`
 #rallyPointFarmList {
    width: 100vw;
    height: 100vh;
    position: fixed;
    top: 0;
    left: 0;
    background: #f4efe4;
    z-index: 10000000000000000;
    display: flex;
    flex-wrap: wrap;

  }
`,
	style.sheet.cssRules.length,
)

style.sheet.insertRule(
	`
  .villageWrapper  {
    margin: 0 !important;
  }
`,
	style.sheet.cssRules.length,
)

style.sheet.insertRule(
	`
  #topBar, #topBarHeroWrapper  {
    display: none !important;
  }
`,
	style.sheet.cssRules.length,
)
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
		this.intervalId = setInterval(async () => {
			await sleep(random(0, 2000))
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
		for (const v of domVictims) {
			const id = Number(v.getAttribute('data-slot-id'))
			if (this.activeVictims.has(id)) continue
			logInfo(`Syncing victim ${id}`)
			this.activateVictim(id, 5)
		}
	}

	initialize(isWaiting = false) {
		logInfo('Initializing farm bot...')
		this.farmLists.forEach(async (farmListData, i) => {
			await sleep(i * 5_000)
			const farmList = new FarmList(farmListData.id, this.farmLists.length * 5)
			this.activeFarmLists.set(farmListData.id, farmList)
			if (farmList.isCollapsed()) farmList.toggleCollapse()
			await sleep(5_000)
			farmList.start()
		})

		this.victims.forEach(async (victimData, i) => {
			if (!victimData.active) return
			await sleep(i * 60_000)
			const victim = new Victim(victimData.id, victimData.interval)
			this.activeVictims.set(victimData.id, victim)

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
		id: 923,
		victims: [
			{ _no: 1, active: true, attackTroops: 1, distance: 11, id: 46828, interval: 5, name: 'Kinyous/sostinė' },
			{ _no: 2, active: true, attackTroops: 1, distance: 24.5, id: 46816, interval: 5, name: 'Puclik`s village' },
			{ _no: 3, active: true, attackTroops: 1, distance: 26, id: 46817, interval: 5, name: '00' },
			{ _no: 4, active: true, attackTroops: 1, distance: 33.2, id: 46818, interval: 5, name: 'iygY6wBV7`s village' },
			{ _no: 5, active: true, attackTroops: 1, distance: 42.5, id: 71507, interval: 5, name: 'Авангард' },
			{ _no: 6, active: true, attackTroops: 1, distance: 43.7, id: 46822, interval: 5, name: 'DKMMWQqxPk`s village' },
			{ _no: 7, active: true, attackTroops: 1, distance: 43.9, id: 71509, interval: 5, name: 'StiflersMom`s villag' },
			{ _no: 8, active: true, attackTroops: 1, distance: 47, id: 71511, interval: 5, name: 'Ok12' },
			{ _no: 9, active: true, attackTroops: 1, distance: 47.9, id: 46824, interval: 5, name: 'Pablo666`s village' },
			{ _no: 10, active: true, attackTroops: 1, distance: 48.6, id: 46826, interval: 5, name: 'Градът на TravianPlayer' },
		],
	},
	{
		_no: 2,
		active: true,
		id: 1885,
		victims: [
			{ _no: 1, active: true, attackTroops: 1, distance: 23.4, id: 49915, interval: 5, name: 'Village de DovahShyv' },
			{ _no: 2, active: true, attackTroops: 1, distance: 24.2, id: 49917, interval: 5, name: 'Vulkan' },
			{ _no: 3, active: true, attackTroops: 1, distance: 25.1, id: 49918, interval: 5, name: 'Деревня boni' },
			{ _no: 4, active: true, attackTroops: 1, distance: 25.1, id: 49919, interval: 5, name: 'Bufeo`s village' },
			{ _no: 5, active: true, attackTroops: 1, distance: 25.3, id: 49920, interval: 5, name: 'Osada: Knight123' },
			{ _no: 6, active: true, attackTroops: 1, distance: 25.8, id: 49921, interval: 5, name: 'searchforblood´s Dorp' },
			{ _no: 7, active: true, attackTroops: 1, distance: 26, id: 49922, interval: 5, name: 'Vesnice: hucyxx' },
			{ _no: 8, active: true, attackTroops: 1, distance: 26.1, id: 49923, interval: 5, name: 'Aldea de desdijo' },
			{ _no: 9, active: true, attackTroops: 1, distance: 27.1, id: 49924, interval: 5, name: 'Aldea de Seknxi' },
			{ _no: 10, active: true, attackTroops: 1, distance: 28, id: 49925, interval: 5, name: 'Làng của nencci' },
			{ _no: 11, active: true, attackTroops: 1, distance: 28.2, id: 49926, interval: 5, name: 'RandomDude`s village' },
		],
	},
]
const bot = new FarmBot(farmLists)
bot.initialize()
