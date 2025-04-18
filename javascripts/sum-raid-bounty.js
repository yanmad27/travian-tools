const localStorageKey = "raidHistory";

function saveSumToStorage(sum) {
	chrome.storage.local.get([localStorageKey], (result) => {
		const history = result[localStorageKey] || [];
		const now = new Date();

		const adjustedDate = new Date(now);
		if (now.getHours() < 6) adjustedDate.setDate(adjustedDate.getDate() - 1);

		const today = adjustedDate.toLocaleDateString();

		const todayEntryIndex = history.findIndex((entry) => {
			const entryDate = new Date(entry.timestamp);
			if (entryDate.getHours() < 6) entryDate.setDate(entryDate.getDate() - 1);
			return entryDate.toLocaleDateString() === today;
		});

		if (todayEntryIndex !== -1) {
			history[todayEntryIndex].sum = sum;
			history[todayEntryIndex].timestamp = now.toLocaleString();
		} else {
			const newEntry = {
				sum: sum,
				timestamp: now.toLocaleString(),
			};
			history.unshift(newEntry);
		}

		const trimmedHistory = history.slice(0, 10);
		chrome.storage.local.set({ [localStorageKey]: trimmedHistory }, () => {
			updateHistoryDisplay(trimmedHistory);
		});
	});
}

function updateHistoryDisplay(history) {
	const historyElement = document.getElementById("history");
	if (history.length === 0) {
		historyElement.innerHTML = "<p class='no-history'>No history yet</p>";
		return;
	}

	const historyHTML = history
		.map(
			(entry) => `
        <div class="history-entry">
            <span class="sum">${entry.sum.toLocaleString()}</span>
            <span class="timestamp">${entry.timestamp}</span>
        </div>
    `,
		)
		.join("");

	historyElement.innerHTML = historyHTML;
}

function calculateSumRaidBounty() {
	try {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.scripting.executeScript(
				{
					target: { tabId: tabs[0].id },
					function: () => {
						const res = document.querySelectorAll('[class="averageRaidBounty"] [class="value"]');
						let sum = 0;
						res.forEach((cur) => {
							const value = cur.innerText.replace(/\.|\,|\u202D|\u202C/g, "");
							sum += Number(value);
						});
						return sum;
					},
				},
				(results) => {
					const sum = results[0].result;
					document.getElementById("result").innerHTML = `Total Sum: ${sum.toLocaleString()}`;
					if (sum > 0) {
						saveSumToStorage(sum);
					}
				},
			);
		});
	} catch (error) {
		console.error("Error in calculateSumRaidBounty:", error);
		document.getElementById("result").innerHTML = "Error calculating sum. Please check the console for details.";
	}
}

document.addEventListener("DOMContentLoaded", () => {
	const calculateButton = document.getElementById("calculateButton");
	calculateButton.addEventListener("click", calculateSumRaidBounty);
	calculateSumRaidBounty();

	chrome.storage.local.get([localStorageKey], (result) => {
		updateHistoryDisplay(result[localStorageKey] || []);
	});
});
