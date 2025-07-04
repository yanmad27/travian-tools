function getLastRaidTime() {
	const time = this.victim.querySelector('td.lastRaid .lastRaidWrapper .lastRaidReport .value')?.innerHTML
	if (time.includes('yesterday')) return new Date(Date.now() - 24 * 60 * 60 * 1000)
	if (time.includes('.')) {
		const [day, month, year] = time.split('.')
		return new Date(year, month - 1, day)
	}
	if (time.includes(':')) {
		const nowYear = new Date().getFullYear()
		const nowMonth = new Date().getMonth() + 1
		const nowDay = new Date().getDate()
		const [hours, minutes, seconds] = time.split(':')
		return new Date(`${nowYear}-${nowMonth}-${nowDay} ${hours}:${minutes}:${seconds}`)
	}
	return new Date()
}

console.log(getLastRaidTime('16:27:54').toLocaleString())
