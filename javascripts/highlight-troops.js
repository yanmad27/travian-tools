function highlightTroops() {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript({
				target: { tabId: tabs[0].id },
				function: () => {
					document.querySelectorAll('[class="unit"]').forEach((el) => {
						el.style.background = "green";
						el.style.color = "white";
					});
				},
			});
		});
	} catch (error) {
		console.error("Error in highlightTroops:", error);
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const highlightTroopsButton = document.getElementById("highlightTroops");
	highlightTroopsButton.addEventListener("click", highlightTroops);
	highlightTroops();
});
