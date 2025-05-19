const duration = 70

function fillTrainList(after) {
	document.querySelector('#build > form > span').click()
	document.querySelector('#TTQat').value = ''
	document.querySelector('#TTQafter').value = after
	document.querySelector('#submitBtn').click()
}

async function main() {
	for (let i = 1; i <= 24; i++) {
		fillTrainList(i * duration)
	}
}

main()
