const list = [
	{ x: 11, y: 80, time: '2025/05/18 20:35:00' },
	{ x: 17, y: 90, time: '2025/05/18 21:21:09' },
	{ x: 9, y: 86, time: '2025/05/18 22:19:44' },
]

function fillTroops() {
	document.querySelector('#troops > tbody > tr:nth-child(3) > td.line-last.column-last > input').value = 1
	document.querySelector('#build > div > form > div.option > label:nth-child(5) > input').click()
}

function fillRaidList(x, y, time) {
	document.querySelector('#xCoordInput').value = x
	document.querySelector('#yCoordInput').value = y
	document.querySelector('#build > div > form > span').click()
	document.querySelector('#TTQat').value = time
	document.querySelector('#submitBtn').click()
}

function main() {
	fillTroops()
	for (let i = 0; i < list.length; i++) {
		fillRaidList(list[i].x, list[i].y, list[i].time)
	}
}

main()
