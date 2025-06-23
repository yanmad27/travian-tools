document.addEventListener('DOMContentLoaded', function () {
	// Get all collapse buttons
	const collapseButtons = document.querySelectorAll('.collapse-btn')

	// Initialize collapse state from localStorage
	function initializeCollapseState() {
		collapseButtons.forEach((button) => {
			const section = button.closest('.feature-section')
			const sectionName = Array.from(section.classList).find((cls) => cls !== 'feature-section')
			const isCollapsed = localStorage.getItem(`section-${sectionName}-collapsed`) === 'true'

			if (isCollapsed) {
				collapseSection(section, button)
			}
		})
	}

	// Collapse a section
	function collapseSection(section, button) {
		const content = section.querySelector('.section-content')
		const icon = button.querySelector('.collapse-icon')

		content.style.display = 'none'
		icon.textContent = '+'
		section.classList.add('collapsed')
	}

	// Expand a section
	function expandSection(section, button) {
		const content = section.querySelector('.section-content')
		const icon = button.querySelector('.collapse-icon')

		content.style.display = 'block'
		icon.textContent = '-'
		section.classList.remove('collapsed')
	}

	// Toggle collapse state
	function toggleSection(button) {
		const section = button.closest('.feature-section')
		const content = section.querySelector('.section-content')
		const icon = button.querySelector('.collapse-icon')
		const sectionName = Array.from(section.classList).find((cls) => cls !== 'feature-section')

		if (content.style.display === 'none') {
			expandSection(section, button)
			localStorage.setItem(`section-${sectionName}-collapsed`, 'false')
		} else {
			collapseSection(section, button)
			localStorage.setItem(`section-${sectionName}-collapsed`, 'true')
		}
	}

	// Add click event listeners to all collapse buttons
	collapseButtons.forEach((button) => {
		button.addEventListener('click', function () {
			toggleSection(button)
		})
	})

	// Initialize collapse state on page load
	initializeCollapseState()
})
