// Function to save sum to storage
function saveSumToStorage(sum) {
    chrome.storage.local.get(['raidHistory'], function (result) {
        const history = result.raidHistory || [];
        const now = new Date();

        // Adjust date to consider 6 AM as start of day
        const adjustedDate = new Date(now);
        if (now.getHours() < 6) {
            adjustedDate.setDate(adjustedDate.getDate() - 1);
        }
        const today = adjustedDate.toLocaleDateString();

        // Check if there's an entry for today
        const todayEntryIndex = history.findIndex((entry) => {
            const entryDate = new Date(entry.timestamp);
            // Adjust entry date to consider 6 AM as start of day
            if (entryDate.getHours() < 6) {
                entryDate.setDate(entryDate.getDate() - 1);
            }
            return entryDate.toLocaleDateString() === today;
        });

        if (todayEntryIndex !== -1) {
            // Update today's entry
            history[todayEntryIndex].sum = sum;
            history[todayEntryIndex].timestamp = now.toLocaleString();
        } else {
            // Create new entry for today
            const newEntry = {
                sum: sum,
                timestamp: now.toLocaleString(),
            };
            history.unshift(newEntry);
        }

        // Keep only last 10 entries
        const trimmedHistory = history.slice(0, 10);
        chrome.storage.local.set({ raidHistory: trimmedHistory }, function () {
            updateHistoryDisplay(trimmedHistory);
        });
    });
}

function saveProductionToStorage(reportIndex, datetime, timestamp, production) {
    chrome.storage.local.get([`reportProduction${reportIndex}`], function (result) {
        const key = `reportProduction${reportIndex}`;
        chrome.storage.local.set({ [key]: { datetime, timestamp, production } }, function () {
            updateReportProduction(reportIndex, { datetime, timestamp, production });
            saveReportProduction();
        });
    });
}

function saveReportProduction() {
    chrome.storage.local.get([`reportProduction1`, `reportProduction2`], function (result) {
        const reportProduction1 = result[`reportProduction1`];
        const reportProduction2 = result[`reportProduction2`];
        if (!reportProduction1 || !reportProduction2) return;
        const production1 = reportProduction1.production;
        const production2 = reportProduction2.production;
        const timestamp1 = reportProduction1.timestamp;
        const timestamp2 = reportProduction2.timestamp;

        const timeDiff = Math.abs(timestamp1 - timestamp2) / 1000;
        const productionDiff = Math.abs(production1 - production2);
        const productionPerHour = (productionDiff / timeDiff) * 3600;

        chrome.storage.local.set({ productionPerHour }, function () {
            document.getElementById(`report-result`).innerText = productionPerHour.toFixed(0);
        });
    });
}
function updateReportProduction(reportIndex, { datetime, production }) {
    document.getElementById(`report${reportIndex}-datetime`).innerText = datetime;
    document.getElementById(`report${reportIndex}-production`).innerText = production;
}

// Function to update history display
function updateHistoryDisplay(history) {
    const historyElement = document.getElementById('history');
    if (history.length === 0) {
        historyElement.innerHTML = '<p>No history yet</p>';
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
        .join('');

    historyElement.innerHTML = historyHTML;
}

// Function to get sum of raid bounties
function getSumRes() {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    function: function () {
                        var res = document.querySelectorAll('[class="averageRaidBounty"] [class="value"]');
                        var sum = 0;
                        res.forEach((cur) => {
                            const value = cur.innerText.replace(/\.|\,|\u202D|\u202C/g, '');
                            sum += Number(value);
                        });
                        return sum;
                    },
                },
                (results) => {
                    const sum = results[0].result;
                    document.getElementById('result').innerHTML = `Total Sum: ${sum.toLocaleString()}`;
                    if (sum > 0) {
                        saveSumToStorage(sum);
                    }
                },
            );
        });
    } catch (error) {
        console.error('Error in getSumRes:', error);
        document.getElementById('result').innerHTML = 'Error calculating sum. Please check the console for details.';
    }
}

function highlightTroops() {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: function () {
                    document.querySelectorAll('[class="unit"]').forEach((el) => {
                        el.style.background = 'green';
                        el.style.color = 'white';
                    });
                },
            });
        });
    } catch (error) {
        console.error('Error in highlightTroops:', error);
    }
}

function getReport(i) {
    try {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript(
                {
                    target: { tabId: tabs[0].id },
                    function: function () {
                        const datetime = document.querySelector('[id="reportWrapper"] [class="header "] [class="time"] [class="text"]').innerText;

                        function getTimestamp(dateString) {
                            const [datePart, timePart] = dateString.split(', ');
                            const [day, month, year] = datePart.split('.');
                            const [hours, minutes, seconds] = timePart.split(':');
                            return new Date(
                                2000 + parseInt(year),
                                parseInt(month) - 1,
                                parseInt(day),
                                parseInt(hours),
                                parseInt(minutes),
                                parseInt(seconds),
                            ).getTime();
                        }

                        const timestamp = getTimestamp(datetime);

                        const production = document.querySelectorAll('[class="additionalInformation"] [class="inlineIconList resourceWrapper"]')[1]
                            .children[1].children[1].innerText;
                        return {
                            datetime,
                            timestamp,
                            production: +production,
                        };
                    },
                },
                (results) => {
                    const report = results[0].result;
                    saveProductionToStorage(i, report.datetime, report.timestamp, report.production);
                },
            );
        });
    } catch (error) {
        console.error('Error in getReport:', error);
    }
}

// Add event listener when the popup loads
document.addEventListener('DOMContentLoaded', function () {
    const calculateButton = document.getElementById('calculateButton');
    calculateButton.addEventListener('click', getSumRes);
    getSumRes();

    const highlightTroopsButton = document.getElementById('highlightTroops');
    highlightTroopsButton.addEventListener('click', highlightTroops);
    highlightTroops();

    const reportButton1 = document.getElementById('reportButton1');
    reportButton1.addEventListener('click', () => getReport(1));

    const reportButton2 = document.getElementById('reportButton2');
    reportButton2.addEventListener('click', () => getReport(2));

    // Load and display history when popup opens
    chrome.storage.local.get(['raidHistory'], function (result) {
        updateHistoryDisplay(result.raidHistory || []);
    });

    chrome.storage.local.get(['reportProduction1', 'reportProduction2', 'productionPerHour'], function (result) {
        if (result.reportProduction1) updateReportProduction(1, result.reportProduction1);
        if (result.reportProduction2) updateReportProduction(2, result.reportProduction2);
        if (result.productionPerHour) document.getElementById(`report-result`).innerText = result.productionPerHour.toFixed(0);
    });
});
