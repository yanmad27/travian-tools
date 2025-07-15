const triggerRaid = async () => {
	try {
		document.querySelector('#stickyWrapper > button.textButtonV2.buttonFramed.startAllFarmLists.rectangle.withText.green').click()
		logSuccess('Raid triggered')
	} catch (error) {
		logError('Failed to trigger raid')
	}
}

setInterval(triggerRaid, 45 * 60 * 1000)
