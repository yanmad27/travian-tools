var farmlist = document.querySelector('#rallyPointFarmList > div:nth-child(1) > div.dropContainer > div > div.slotsWrapper.formV2 > table > tbody')

var farms = []
farmlist.childNodes.forEach((child, index) => {
	if (index === farmlist.childNodes.length - 1) return
	var name = child.querySelector('[class="target"] span').innerHTML
	if (name.includes('coordinate')) {
		name =
			'Oasis ' +
			child.querySelector('[class="target"] [class="coordinateX"]').innerHTML +
			'|' +
			child.querySelector('[class="target"] [class="coordinateY"]').innerHTML 
	}
	console.log(x, y)
	var item = {
    no:index+1
		id: Number(child.querySelector('[class="selection"] input').getAttribute('data-slot-id')),
		interval: 10,
		active: true,
		name: name,
	}
	farms.push(item)
})

console.log(farms)
