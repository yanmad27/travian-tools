var id = 2291
var farmlist = document.querySelector(`[data-list="${id}"]`).parentElement.parentElement.querySelector('tbody')

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
	var item = {
    no:index+1,
		id: Number(child.querySelector('[class="selection"] input').getAttribute('data-slot-id')),
		interval: 10,
		active: true,
		name: name,
	}
	farms.push(item)
})

console.log(farms)
