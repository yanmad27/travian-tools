const list = [
	{ x: 11, y: 80, time: '2025/05/18 20:35:00' },
	{ x: 17, y: 90, time: '2025/05/18 21:21:09' },
	{ x: 9, y: 86, time: '2025/05/18 22:19:44' },
]

async function fillRaidList(x, y, time) {
	document.querySelector('#xCoordInput').value = x
	document.querySelector('#yCoordInput').value = y
	document.querySelector('#build > div > form > span').click()
	await new Promise((resolve) => setTimeout(resolve, 500))
	document.querySelector('#TTQat').value = time
	document.querySelector('#submitBtn').click()
}

async function main() {
	for (let i = 0; i < list.length; i++) {
		await fillRaidList(list[i].x, list[i].y, list[i].time)
	}
}

main()
