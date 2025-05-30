const list = [
	{ x: 18, y: 80, time: '2025/05/19 6:04:00' },
	{ x: 18, y: 79, time: '2025/05/19 6:12:15' },
	{ x: 16, y: 73, time: '2025/05/19 6:26:45' },
	{ x: 7, y: 79, time: '2025/05/19 7:20:16' },
	{ x: 9, y: 91, time: '2025/05/19 8:32:05' },
	{ x: 28, y: 92, time: '2025/05/19 9:58:04' },
	{ x: 3, y: 84, time: '2025/05/19 11:32:55' },
	{ x: 31, y: 89, time: '2025/05/19 13:10:27' },
	{ x: 8, y: 68, time: '2025/05/19 14:47:45' },
	{ x: 5, y: 92, time: '2025/05/19 16:32:09' },
	{ x: 4, y: 70, time: '2025/05/19 18:20:29' },
]

async function fillRaidList(x, y, time) {
	document.querySelector('#xCoordInput').value = x
	document.querySelector('#yCoordInput').value = y
	document.querySelector('#build > div > form > span').click()
	document.querySelector('#TTQat').value = time
	document.querySelector('#submitBtn').click()
}

async function main() {
	for (let i = 0; i < list.length; i++) {
		await fillRaidList(list[i].x, list[i].y, list[i].time)
	}
}

main()
