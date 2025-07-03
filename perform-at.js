var time = '3:11:29'

const performAt = async (selector, targetTime) => {
	const element = document.querySelector(selector)

	// First, sync to the next second boundary
	const syncToSecond = async () => {
		const now = new Date()
		const msToNextSecond = 1000 - now.getMilliseconds()
		await new Promise((resolve) => setTimeout(resolve, msToNextSecond))
	}

	// Sync to second boundary first
	await syncToSecond()

	while (true) {
		const currentTime = document.querySelector('#at').innerHTML

		// Check if we're at the target time
		if (currentTime === targetTime) {
			element.click()
			break
		}

		// Check if we're getting close (within 2 seconds)
		const targetDate = new Date(`2000 ${targetTime}`)
		const currentDate = new Date(`2000 ${currentTime}`)
		const timeDiff = targetDate - currentDate

		if (timeDiff > 0 && timeDiff <= 2000) {
			// We're close, check more frequently (every 10ms)
			await new Promise((resolve) => setTimeout(resolve, 10))
		} else {
			// Still far away, check at the start of each second
			await new Promise((resolve) => setTimeout(resolve, 1000))
		}
	}
}

performAt('#confirmSendTroops','20:07:30')