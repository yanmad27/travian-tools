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

	async activateVictim(id, interval = 5, isWaiting = false) {
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
		id: 1817,
		victims: [
			{ _no: 1, active: true, attackTroops: 6, id: 104725, interval: 5, name: '01. ThienTuCutHeo' },
			{ _no: 2, active: false, attackTroops: 100, id: 106622, interval: 5, name: 'UTOPIA KUTA RAJA' },
			{ _no: 3, active: true, attackTroops: 4, id: 62443, interval: 5, name: 'Mr.Piet 01' },
			{ _no: 4, active: true, attackTroops: 2, id: 62444, interval: 5, name: 'Mr.Piet 00' },
			{ _no: 5, active: true, attackTroops: 4, id: 77006, interval: 5, name: 'vuthanh16`s village' },
			{ _no: 6, active: true, attackTroops: 8, id: 104724, interval: 5, name: 'HaMBa003' },
			{ _no: 7, active: true, attackTroops: 5, id: 93755, interval: 5, name: 'Oasis (−51|7)' },
			{ _no: 8, active: true, attackTroops: 5, id: 107757, interval: 5, name: 'HaMBa002_15C' },
			{ _no: 9, active: true, attackTroops: 4, id: 48393, interval: 5, name: 'Lyly 01' },
			{ _no: 10, active: true, attackTroops: 8, id: 103293, interval: 5, name: 'HaMBa001' },
			{ _no: 11, active: true, attackTroops: 1, id: 77012, interval: 5, name: '00' },
			{ _no: 12, active: true, attackTroops: 3, id: 70233, interval: 5, name: 'harry83820`s village' },
			{ _no: 13, active: true, attackTroops: 2, id: 87903, interval: 5, name: 'Ruacon`s village' },
			{ _no: 14, active: true, attackTroops: 7, id: 103133, interval: 5, name: 'Oasis (−39|−67)' },
			{ _no: 15, active: true, attackTroops: 2, id: 77024, interval: 5, name: '01. Em ne' },
			{ _no: 16, active: true, attackTroops: 2, id: 77912, interval: 5, name: '1' },
			{ _no: 17, active: true, attackTroops: 10, id: 107739, interval: 5, name: 'Oasis (−14|−34)' },
			{ _no: 18, active: true, attackTroops: 2, id: 77023, interval: 5, name: 'İNEK' },
			{ _no: 19, active: true, attackTroops: 4, id: 87892, interval: 5, name: 'Eragon' },
			{ _no: 20, active: true, attackTroops: 3, id: 77016, interval: 5, name: 'Làng của SkyOne' },
			{ _no: 21, active: true, attackTroops: 5, id: 69810, interval: 5, name: '.' },
			{ _no: 22, active: true, attackTroops: 5, id: 78862, interval: 5, name: 'TEA' },
			{ _no: 23, active: false, attackTroops: 100, id: 107763, interval: 5, name: 'Oasis (−6|−58)' },
			{ _no: 24, active: true, attackTroops: 7, id: 69807, interval: 5, name: 'A' },
			{ _no: 25, active: true, attackTroops: 3, id: 106630, interval: 5, name: 'Ardea' },
			{ _no: 26, active: true, attackTroops: 5, id: 80226, interval: 5, name: '32' },
			{ _no: 27, active: true, attackTroops: 15, id: 103136, interval: 5, name: 'Oasis (−43|64)' },
			{ _no: 28, active: true, attackTroops: 2, id: 106486, interval: 5, name: 'А2' },
			{ _no: 29, active: true, attackTroops: 3, id: 106497, interval: 5, name: 'ineffanle' },
		],
	},
	{
		_no: 2,
		active: true,
		id: 2291,
		victims: [
			{ _no: 1, active: true, attackTroops: 2, id: 87914, interval: 5, name: 'Deli`s village' },
			{ _no: 2, active: true, attackTroops: 3, id: 91945, interval: 5, name: 'EazyJJ的村莊' },
			{ _no: 3, active: true, attackTroops: 5, id: 87915, interval: 5, name: 'Azamat`s village' },
			{ _no: 4, active: true, attackTroops: 7, id: 103452, interval: 5, name: 'Natars -68|-20' },
			{ _no: 5, active: true, attackTroops: 7, id: 102592, interval: 5, name: 'Let的村莊' },
			{ _no: 6, active: true, attackTroops: 6, id: 87916, interval: 5, name: 'Lalala`s F' },
			{ _no: 7, active: true, attackTroops: 7, id: 87918, interval: 5, name: 'An Nghĩa Đường' },
			{ _no: 8, active: true, attackTroops: 4, id: 87917, interval: 5, name: 'หมู่บ้านของBAKI' },
			{ _no: 9, active: true, attackTroops: 5, id: 80221, interval: 5, name: '123' },
			{ _no: 10, active: true, attackTroops: 2, id: 99371, interval: 5, name: 'KOR1 | Kennametal' },
			{ _no: 11, active: true, attackTroops: 5, id: 106334, interval: 5, name: 'CmoTz`s village' },
			{ _no: 12, active: true, attackTroops: 2, id: 99372, interval: 5, name: 'shoes19944116的村莊' },
			{ _no: 13, active: true, attackTroops: 7, id: 92374, interval: 5, name: 'Làng của abcd' },
			{ _no: 14, active: true, attackTroops: 8, id: 103425, interval: 5, name: 'Natars -52|-22' },
			{ _no: 15, active: true, attackTroops: 3, id: 89961, interval: 5, name: 'Suri`s village' },
			{ _no: 16, active: true, attackTroops: 2, id: 105962, interval: 5, name: '風のAPiau的村莊' },
			{ _no: 17, active: true, attackTroops: 2, id: 99373, interval: 5, name: 'Athena`s village' },
			{ _no: 18, active: true, attackTroops: 12, id: 101908, interval: 5, name: 'Natars -84|-59' },
			{ _no: 19, active: true, attackTroops: 3, id: 99374, interval: 5, name: 'New village' },
			{ _no: 20, active: true, attackTroops: 5, id: 99376, interval: 5, name: 'Dorf von Djimmy98' },
			{ _no: 21, active: true, attackTroops: 6, id: 99375, interval: 5, name: 'ab1` F' },
			{ _no: 22, active: true, attackTroops: 3, id: 99370, interval: 5, name: 'Badwolf`s village' },
			{ _no: 23, active: true, attackTroops: 8, id: 96621, interval: 5, name: 'Oasis (−51|6)' },
			{ _no: 24, active: true, attackTroops: 2, id: 105960, interval: 5, name: 'Moon`s village' },
			{ _no: 25, active: true, attackTroops: 5, id: 104059, interval: 5, name: 'Natars -41|7' },
			{ _no: 26, active: true, attackTroops: 2, id: 105959, interval: 5, name: 'Làng của Gái già' },
			{ _no: 27, active: true, attackTroops: 6, id: 101541, interval: 5, name: 'Buffalo' },
			{ _no: 28, active: true, attackTroops: 15, id: 107740, interval: 5, name: 'Oasis (−84|−80)' },
			{ _no: 29, active: true, attackTroops: 5, id: 97081, interval: 5, name: 'Oasis (−59|−80)' },
			{ _no: 30, active: true, attackTroops: 15, id: 107547, interval: 5, name: '2.B' },
			{ _no: 31, active: true, attackTroops: 4, id: 103134, interval: 5, name: 'Oasis (−38|−68)' },
			{ _no: 32, active: true, attackTroops: 2, id: 106495, interval: 5, name: 'Oasis (−76|44)' },
			{ _no: 33, active: true, attackTroops: 2, id: 105961, interval: 5, name: 'taukiss Köyü' },
			{ _no: 34, active: true, attackTroops: 15, id: 107738, interval: 5, name: 'Oasis (−12|−34)' },
			{ _no: 35, active: true, attackTroops: 2, id: 91725, interval: 5, name: 'Lim Han Byul' },
			{ _no: 36, active: true, attackTroops: 7, id: 93022, interval: 5, name: 'Shin Yong Jae' },
		],
	},
	{
		_no: 3,
		active: true,
		id: 2573,
		victims: [
			{ _no: 1, active: true, attackTroops: 1, id: 107732, interval: 5, name: 'jebray`s village' },
			{ _no: 2, active: true, attackTroops: 1, id: 107733, interval: 5, name: 'La comarca' },
			{ _no: 3, active: true, attackTroops: 2, id: 107734, interval: 5, name: 'GB I' },
			{ _no: 4, active: true, attackTroops: 3, id: 87899, interval: 5, name: 'Centras' },
			{ _no: 5, active: false, attackTroops: 100, id: 104745, interval: 5, name: 'prof 3' },
		],
	},
]
const bot = new FarmBot(farmLists)
bot.initialize()
