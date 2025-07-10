document.addEventListener('DOMContentLoaded', function() {
  const autoReloadBtn = document.getElementById('autoReloadBtn');
  const intervalInput = document.getElementById('reloadInterval');
  const elementSelector = document.getElementById('elementSelector');
  const statusDiv = document.getElementById('autoReloadStatus');
  
  let reloadInterval = null;
  let isReloading = false;

  if (autoReloadBtn) {
    autoReloadBtn.addEventListener('click', function() {
      if (isReloading) {
        stopAutoReload();
      } else {
        startAutoReload();
      }
    });
  }

  function startAutoReload() {
    const interval = parseInt(intervalInput.value) * 1000;
    const selector = elementSelector.value.trim();
    
    if (interval < 1000) {
      updateStatus('Interval must be at least 1 second', 'error');
      return;
    }

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      const tabId = tabs[0].id;
      
      reloadInterval = setInterval(() => {
        chrome.tabs.reload(tabId, {}, () => {
          if (selector) {
            setTimeout(() => {
              checkElement(tabId, selector);
            }, 1000);
          }
        });
      }, interval);
      
      isReloading = true;
      autoReloadBtn.textContent = 'Stop Auto Reload';
      autoReloadBtn.classList.add('active');
      updateStatus(`Auto reload started (${interval/1000}s interval)`, 'success');
    });
  }

  function stopAutoReload() {
    if (reloadInterval) {
      clearInterval(reloadInterval);
      reloadInterval = null;
    }
    
    isReloading = false;
    autoReloadBtn.textContent = 'Start Auto Reload';
    autoReloadBtn.classList.remove('active');
    updateStatus('Auto reload stopped', 'info');
  }

  function checkElement(tabId, selector) {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: (selector) => {
        const element = document.querySelector(selector);
        return {
          found: !!element,
          text: element ? element.textContent.trim() : null,
          visible: element ? element.offsetParent !== null : false
        };
      },
      args: [selector]
    }, (results) => {
      if (results && results[0]) {
        const result = results[0].result;
        if (result.found && result.visible) {
          updateStatus(`Element found: "${result.text}"`, 'success');
        } else if (result.found) {
          updateStatus('Element found but not visible', 'warning');
        } else {
          updateStatus('Element not found', 'warning');
        }
      }
    });
  }

  function updateStatus(message, type = 'info') {
    if (statusDiv) {
      statusDiv.textContent = message;
      statusDiv.className = `status ${type}`;
      
      setTimeout(() => {
        statusDiv.textContent = '';
        statusDiv.className = 'status';
      }, 5000);
    }
  }

  window.addEventListener('beforeunload', function() {
    if (isReloading) {
      stopAutoReload();
    }
  });
});