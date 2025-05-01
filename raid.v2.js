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
				this.name = `Oasis ${coordX}|${coordY}`
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
		this.intervalId = setInterval(() => {
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
			if (isWaiting) {
				let waitTime = 0
				while (victim.isRaiding() && waitTime < victim.interval * 60 * 1000) {
					await sleep(5000)
					waitTime += 5000
				}
			}

			await victim.select()
			victim.start()
		})

		this.startHealthCheck()
	}

	async activateVictim(id, interval = 10, isWaiting = false) {
		try {
			const victim = new Victim(id, interval)
			this.activeVictims.set(id, victim)

			if (isWaiting) {
				let waitTime = 0
				while (victim.isRaiding() && waitTime < victim.interval * 60 * 1000) {
					await sleep(5000)
					waitTime += 5000
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
		_id: 1817,
		active: true,
		victims: [
			{ _no: 1, active: true, id: 62443, interval: 10, name: 'Mr.Piet 01' },
			{ _no: 2, active: true, id: 62444, interval: 10, name: 'Mr.Piet 00' },
			{ _no: 3, active: true, id: 77006, interval: 10, name: 'vuthanh16`s village' },
			{ _no: 4, active: true, id: 96619, interval: 10, name: 'Oasis (‭−‭42‬‬|‭−‭5‬‬)' },
			{ _no: 5, active: true, id: 93755, interval: 10, name: 'Oasis (‭−‭51‬‬|‭7‬)' },
			{ _no: 6, active: true, id: 96620, interval: 10, name: 'Oasis (‭−‭43‬‬|‭−‭3‬‬)' },
			{ _no: 7, active: true, id: 48393, interval: 10, name: 'Lyly 01' },
			{ _no: 8, active: true, id: 80219, interval: 10, name: 'ngentod' },
			{ _no: 9, active: true, id: 77012, interval: 10, name: '00' },
			{ _no: 10, active: true, id: 70233, interval: 10, name: 'harry83820`s village' },
			{ _no: 11, active: true, id: 87903, interval: 10, name: 'Ruacon`s village' },
			{ _no: 12, active: true, id: 97871, interval: 10, name: '02' },
			{ _no: 13, active: true, id: 77024, interval: 10, name: '01. Em ne' },
			{ _no: 14, active: true, id: 77912, interval: 10, name: '1' },
			{ _no: 15, active: true, id: 77023, interval: 10, name: 'İNEK' },
			{ _no: 16, active: true, id: 87892, interval: 10, name: 'Eragon' },
			{ _no: 17, active: true, id: 77016, interval: 10, name: 'Làng của SkyOne' },
			{ _no: 18, active: true, id: 69810, interval: 10, name: '.' },
			{ _no: 19, active: true, id: 87899, interval: 10, name: 'Centras' },
			{ _no: 20, active: true, id: 78862, interval: 10, name: 'TEA' },
			{ _no: 21, active: true, id: 69807, interval: 10, name: 'A' },
			{ _no: 22, active: true, id: 92376, interval: 10, name: '01 - Galadriel' },
			{ _no: 23, active: true, id: 80226, interval: 10, name: '32' },
		],
	},
	{
		_id: 2291,
		active: true,
		victims: [
			{ _no: 1, active: true, id: 87914, interval: 10, name: 'Deli`s village' },
			{ _no: 2, active: true, id: 91945, interval: 10, name: 'EazyJJ的村莊' },
			{ _no: 3, active: true, id: 87915, interval: 10, name: 'Azamat`s village' },
			{ _no: 4, active: true, id: 87916, interval: 10, name: 'Lalala`s F' },
			{ _no: 5, active: true, id: 87918, interval: 10, name: 'An Nghĩa Đường' },
			{ _no: 6, active: true, id: 87917, interval: 10, name: 'หมู่บ้านของBAKI' },
			{ _no: 7, active: true, id: 80221, interval: 10, name: '123' },
			{ _no: 8, active: true, id: 99371, interval: 10, name: 'KOR1 | Kennametal' },
			{ _no: 9, active: true, id: 99372, interval: 10, name: 'shoes19944116的村莊' },
			{ _no: 10, active: true, id: 92374, interval: 10, name: 'Làng của abcd' },
			{ _no: 11, active: true, id: 89961, interval: 10, name: 'Suri`s village' },
			{ _no: 12, active: true, id: 99373, interval: 10, name: 'Athena`s village' },
			{ _no: 13, active: true, id: 101908, interval: 10, name: '01' },
			{ _no: 14, active: true, id: 99374, interval: 10, name: 'New village' },
			{ _no: 15, active: true, id: 99376, interval: 10, name: 'Dorf von Djimmy98' },
			{ _no: 16, active: true, id: 99375, interval: 10, name: 'ab1` F' },
			{ _no: 17, active: true, id: 99370, interval: 10, name: 'Badwolf`s village' },
			{ _no: 18, active: true, id: 96621, interval: 10, name: 'Oasis (‭−‭51‬‬|‭6‬)' },
			{ _no: 19, active: true, id: 93033, interval: 10, name: 'Oasis (‭−‭35‬‬|‭−‭6‬‬)' },
			{ _no: 20, active: true, id: 101541, interval: 10, name: 'Buffalo' },
			{ _no: 21, active: true, id: 97081, interval: 10, name: 'Oasis (‭−‭59‬‬|‭−‭80‬‬)' },
			{ _no: 22, active: true, id: 92367, interval: 10, name: 'Стол' },
			{ _no: 23, active: true, id: 90253, interval: 10, name: '3алупа' },
			{ _no: 24, active: true, id: 91725, interval: 10, name: 'Lim Han Byul' },
			{ _no: 25, active: true, id: 93022, interval: 10, name: 'Shin Yong Jae' },
		],
	},
	{ _id: 2541, active: true, victims: [] },
]

const bot = new FarmBot(farmLists)
bot.initialize()
