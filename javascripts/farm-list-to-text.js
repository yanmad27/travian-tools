document.addEventListener('DOMContentLoaded', function () {
	const farmListInput = document.getElementById('farmListInput')
	const farmListOutput = document.getElementById('farmListOutput')
	const copyButton = document.getElementById('copyButton')

	// Function to clean the text by removing whitespace and specific characters
	function cleanText(text) {
		// Remove all whitespace characters (spaces, tabs, newlines, etc.)
		let cleaned = text.replace(/\s+/g, '')

		// Remove specific characters: periods, commas, and Unicode directional marks
		cleaned = cleaned.replace(/\.|\,|\u202D|\u202C/g, '')
		// Replace Unicode minus sign with regular hyphen
		cleaned = cleaned = cleaned.replace(/\u2212/g, '-')

		return cleaned
	}

	// Process text when input changes
	farmListInput.addEventListener('input', function () {
		const inputText = farmListInput.value

		if (inputText.trim() === '') {
			farmListOutput.value = ''
			copyButton.disabled = true
			return
		}

		const cleanedText = cleanText(inputText)
		farmListOutput.value = cleanedText
		copyButton.disabled = false
	})

	// Handle paste event to immediately process pasted content
	farmListInput.addEventListener('paste', function () {
		// Use setTimeout to allow the paste to complete before processing
		setTimeout(() => {
			const inputText = farmListInput.value
			if (inputText.trim() !== '') {
				const cleanedText = cleanText(inputText)
				farmListOutput.value = cleanedText
				copyButton.disabled = false
			}
		}, 10)
	})

	// Copy to clipboard functionality
	copyButton.addEventListener('click', async function () {
		const textToCopy = farmListOutput.value

		if (!textToCopy) {
			return
		}

		try {
			// Try using the modern Clipboard API
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(textToCopy)
				showCopyFeedback('Copied to clipboard!')
			} else {
				// Fallback for older browsers
				farmListOutput.select()
				farmListOutput.setSelectionRange(0, 99999) // For mobile devices
				document.execCommand('copy')
				showCopyFeedback('Copied to clipboard!')
			}
		} catch (err) {
			console.error('Failed to copy text: ', err)
			showCopyFeedback('Failed to copy', true)
		}
	})

	// Show feedback when copy is successful/failed
	function showCopyFeedback(message, isError = false) {
		const originalText = copyButton.innerHTML
		copyButton.innerHTML = `<span>${isError ? '❌' : '✅'}</span> ${message}`
		copyButton.style.backgroundColor = isError ? '#ff4444' : '#28a745'

		setTimeout(() => {
			copyButton.innerHTML = originalText
			copyButton.style.backgroundColor = ''
		}, 2000)
	}

	// Clear functionality (optional - can be triggered by double-clicking input)
	farmListInput.addEventListener('dblclick', function () {
		farmListInput.value = ''
		farmListOutput.value = ''
		copyButton.disabled = true
	})
})
