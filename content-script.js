// content-script.js
const data = {
	url: window.location.href,
	title: document.title,
	// Extract specific data (e.g., text, elements)
	content: document.querySelector('.content')?.innerText,
}

// Send to background script
chrome.runtime.sendMessage({ type: 'data', payload: data })
