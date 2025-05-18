const list = [
	{ x: 11, y: 80, time: '2025/05/18 21:08:00' },
	{ x: 17, y: 90, time: '2025/05/18 21:54:09' },
	{ x: 19, y: 91, time: '2025/05/18 22:52:44' },
	{ x: 19, y: 92, time: '2025/05/18 23:57:29' },
	{ x: 31, y: 83, time: '2025/05/19 1:08:29' },
	{ x: 4, y: 79, time: '2025/05/19 2:32:36' },
	{ x: 30, y: 89, time: '2025/05/19 4:02:53' },
	{ x: 28, y: 92, time: '2025/05/19 5:34:56' },
]

async function fillTroops() {
	document.querySelector('#troops > tbody > tr:nth-child(3) > td.line-last.column-last > input').value = 1
	document.querySelector('#build > div > form > div.option > label:nth-child(5) > input').click()
	await new Promise((resolve) => setTimeout(resolve, 500))
}

async function fillRaidList(x, y, time) {
	document.querySelector('#xCoordInput').value = x
	document.querySelector('#yCoordInput').value = y
	document.querySelector('#build > div > form > span').click()
	document.querySelector('#TTQat').value = time
	document.querySelector('#submitBtn').click()
}

async function main() {
	await fillTroops()
	for (let i = 0; i < list.length; i++) {
		await fillRaidList(list[i].x, list[i].y, list[i].time)
	}
}

main()
