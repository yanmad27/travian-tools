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
			await sleep(i * 10_000)
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
		id: 76,
		victims: [
			{ _no: 1, active: true, attackTroops: 1, distance: 1, id: 2292, interval: 30, name: 'Oasis (22|43)' },
			{ _no: 2, active: true, attackTroops: 1, distance: 1.4, id: 843, interval: 21, name: 'Oasis (23|43)' },
			{ _no: 3, active: true, attackTroops: 1, distance: 2, id: 841, interval: 15, name: 'Oasis (22|42)' },
			{ _no: 4, active: true, attackTroops: 3, distance: 2.2, id: 842, interval: 14, name: 'Oasis (24|43)' },
			{ _no: 5, active: true, attackTroops: 1, distance: 2.2, id: 846, interval: 14, name: 'Oasis (20|45)' },
			{ _no: 6, active: true, attackTroops: 1, distance: 2.8, id: 847, interval: 11, name: 'Oasis (20|46)' },
			{ _no: 7, active: true, attackTroops: 1, distance: 3, id: 845, interval: 10, name: 'Oasis (19|44)' },
			{ _no: 8, active: true, attackTroops: 1, distance: 4.1, id: 5198, interval: 7, name: 'Oasis (21|40)' },
			{ _no: 9, active: true, attackTroops: 1, distance: 4.5, id: 5197, interval: 7, name: 'Oasis (18|42)' },
			{ _no: 10, active: true, attackTroops: 1, distance: 4.5, id: 5663, interval: 7, name: 'Oasis (20|48)' },
			{ _no: 11, active: true, attackTroops: 1, distance: 5, id: 5199, interval: 6, name: 'Oasis (22|39)' },
			{ _no: 12, active: true, attackTroops: 1, distance: 6.1, id: 848, interval: 5, name: 'Oasis (28|43)' },
			{ _no: 13, active: true, attackTroops: 1, distance: 6.3, id: 5202, interval: 5, name: 'Oasis (24|50)' },
			{ _no: 14, active: true, attackTroops: 1, distance: 7, id: 5203, interval: 4, name: 'Oasis (22|51)' },
			{ _no: 15, active: true, attackTroops: 1, distance: 7.1, id: 5204, interval: 4, name: 'Oasis (21|51)' },
			{ _no: 16, active: true, attackTroops: 1, distance: 7.2, id: 5201, interval: 4, name: 'Oasis (28|48)' },
			{ _no: 17, active: true, attackTroops: 1, distance: 7.8, id: 5206, interval: 4, name: 'Oasis (17|50)' },
			{ _no: 18, active: false, attackTroops: 1, distance: 8.1, id: 5665, interval: 4, name: 'Oasis (26|37)' },
			{ _no: 19, active: false, attackTroops: 1, distance: 8.1, id: 5670, interval: 4, name: 'Oasis (18|51)' },
			{ _no: 20, active: false, attackTroops: 1, distance: 8.6, id: 5207, interval: 3, name: 'Oasis (15|49)' },
			{ _no: 21, active: false, attackTroops: 1, distance: 8.6, id: 5208, interval: 3, name: 'Oasis (17|51)' },
			{ _no: 22, active: false, attackTroops: 1, distance: 8.9, id: 5209, interval: 3, name: 'Oasis (18|52)' },
			{ _no: 23, active: false, attackTroops: 1, distance: 8.9, id: 5674, interval: 3, name: 'Oasis (26|52)' },
			{ _no: 24, active: false, attackTroops: 1, distance: 9.9, id: 5715, interval: 3, name: 'Oasis (29|37)' },
			{ _no: 25, active: false, attackTroops: 1, distance: 10.3, id: 5210, interval: 3, name: 'Oasis (17|53)' },
			{ _no: 26, active: false, attackTroops: 1, distance: 10.8, id: 5671, interval: 3, name: 'Oasis (18|54)' },
			{ _no: 27, active: false, attackTroops: 1, distance: 10.8, id: 5676, interval: 3, name: 'Oasis (26|54)' },
		],
	},
]
const bot = new FarmBot(farmLists)
bot.initialize()
