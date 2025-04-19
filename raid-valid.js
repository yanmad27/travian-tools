const activeVictims = new Map([
	[
		77022,
		{
			id: 77022,
			name: '',
			interval: 10,
			intervalId: null,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="77022"]',
			},
		},
	],
	[
		62034,
		{
			id: 62034,
			name: '',
			interval: 10,
			intervalId: null,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="62034"]',
			},
		},
	],
	[
		61851,
		{
			id: 61851,
			name: '',
			interval: 10,
			intervalId: null,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="61851"]',
			},
		},
	],
	[
		70221,
		{
			id: 70221,
			name: '',
			interval: 10,
			intervalId: null,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="70221"]',
			},
		},
	],
	[
		55464,
		{
			id: 55464,
			name: '',
			interval: 15,
			intervalId: null,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="55464"]',
			},
		},
	],
	[
		77969,
		{
			id: 77969,
			name: 'KOR1 | Kennametal',
			interval: 10,
			intervalId: 303,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="77969"]',
			},
		},
	],
	[
		62318,
		{
			id: 62318,
			name: '',
			interval: 10,
			intervalId: null,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="62318"]',
			},
		},
	],
	[
		77952,
		{
			id: 77952,
			name: 'GunDummm`s village',
			interval: 10,
			intervalId: 380,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="77952"]',
			},
		},
	],
	[
		77019,
		{
			id: 77019,
			name: '',
			interval: 10,
			intervalId: null,
			attempts: 0,
			maxAttempts: 5,
			baseElement: {
				selector: '[data-slot-id="77019"]',
			},
		},
	],
])
const farmLists = [
	{
		id: 1817,
		victims: [
			{
				id: 62034,
				name: 'Azamat`s village',
				interval: 10,
				active: true,
			},
			{
				id: 61851,
				name: 'Lalala`s F',
				interval: 10,
				active: true,
			},
			{
				id: 70221,
				name: 'Baki',
				interval: 10,
				active: true,
			},
			{
				id: 55464,
				name: 'An nghĩa đường',
				interval: 15,
				active: true,
			},
			{
				id: 62318,
				name: 'shoes19944116',
				interval: 10,
				active: true,
			},
			{
				id: 43830,
				name: 'ab1` F',
				interval: 10,
				active: true,
			},
			{
				id: 65832,
				name: 'Dorf von Djimmy98',
				interval: 10,
				active: true,
			},
			{
				id: 62443,
				name: 'Mr.Piet 01',
				interval: 15,
				active: true,
			},
			{
				id: 62444,
				name: 'Mr.Piet 00',
				interval: 15,
				active: true,
			},
			{
				id: 77006,
				name: 'Vu Thanh',
				interval: 10,
				active: true,
			},
			{
				id: 48393,
				name: 'Ly ly',
				interval: 10,
				active: true,
			},
			{
				id: 70233,
				name: 'harry83820`s village',
				interval: 10,
				active: true,
			},
			{
				id: 69810,
				name: '.',
				interval: 30,
				active: true,
			},
			{
				id: 69807,
				name: 'A',
				interval: 30,
				active: true,
			},
		],
	},
	{
		id: 1732,
		victims: [
			{
				id: 61858,
				name: '02Camap',
				interval: 10,
				active: false,
			},
			{
				id: 51230,
				name: 'Làng của abcd',
				interval: 10,
				active: true,
			},
			{
				id: 46845,
				name: 'Hopeful`s F',
				interval: 10,
				active: true,
			},
		],
	},
]

const victims = farmLists.flatMap((fl) => fl.victims)

console.log('ID'.padEnd(5), 'Name'.padEnd(40), 'RealityInterval'.padEnd(15), 'FileInterval'.padEnd(12), 'Valid'.padEnd(2))
victims.forEach((v) => {
	const baseInterval = activeVictims?.get(v.id)?.interval || 0
	console.log(
		v.id,
		v.name.padEnd(40),
		`${v.interval}`.padStart(15),
		`${baseInterval}`.padStart(12),
		`${baseInterval === v.interval ? '✅' : '❌'}`.padStart(4),
	)
})

activeVictims.forEach((v) => {
	const victim = victims.find((victim) => victim.id === v.id)
	if (!victim) {
		console.log(v.id, v.name.padEnd(40), `${v.interval}`.padStart(15), '0'.padStart(12), '❌'.padStart(4))
	}
})
