# Travian Action Recorder 🎬

A powerful browser extension that records your web actions and allows you to replay them automatically at scheduled intervals. Perfect for automating repetitive tasks on any website.

## Features

### 🎥 Action Recording
- **Smart Recording**: Captures clicks, inputs, form submissions, scrolling, and navigation
- **Intelligent Selectors**: Generates robust CSS selectors for reliable element targeting
- **Visual Feedback**: Real-time recording indicator with action count
- **Session Management**: Named sessions for organizing different automation workflows

### ▶️ Action Playback
- **Faithful Reproduction**: Replays actions with original timing and context
- **Flexible Speed Control**: Adjust playback speed from 0.1x to 10x
- **Error Handling**: Graceful handling of missing elements or changed page structure
- **Background Execution**: Run sessions silently without user interaction

### ⏰ Smart Scheduling
- **Interval-based**: Schedule sessions to run every X minutes/hours
- **Time-based**: Set specific start and end times for automation
- **Persistent**: Schedules survive browser restarts using Chrome alarms
- **One-time or Repeating**: Flexible scheduling options for any use case

### 🎨 User Interface
- **Floating Toggle**: Always-accessible UI toggle button
- **Tabbed Interface**: Organized tabs for Recording, Sessions, and Scheduling
- **Session Management**: View, play, export, and delete recorded sessions
- **Schedule Management**: Create, monitor, and manage automated schedules
- **Real-time Status**: Live updates on recording status and schedule execution

## Installation

1. Clone this repository or download the files
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension icon will appear in your browser toolbar

## Quick Start

### Recording Your First Session

1. **Open the Action Recorder**:
   - Click the extension icon, or
   - Press `Ctrl+Shift+U` on any webpage, or
   - Click the floating 🎬 button (bottom-right corner)

2. **Start Recording**:
   - Go to the "Record" tab
   - Enter a session name (optional - auto-generated if blank)
   - Click "🔴 Start Recording"
   - You'll see a red recording indicator in the top-right corner

3. **Perform Your Actions**:
   - Navigate to your target website
   - Perform the actions you want to automate:
     - Click buttons and links
     - Fill out forms
     - Scroll pages
     - Navigate between pages
   - All actions are captured automatically

4. **Stop Recording**:
   - Click "⏹️ Stop Recording" in the UI, or
   - Press `Ctrl+Shift+R` to toggle recording off
   - Your session is automatically saved

### Playing Back Sessions

1. **View Saved Sessions**:
   - Go to the "Sessions" tab
   - See all your recorded sessions with metadata

2. **Play a Session**:
   - Click the ▶️ button next to any session
   - Watch as your actions are replayed automatically
   - Actions are executed with original timing and context

### Scheduling Automation

1. **Create a Schedule**:
   - Go to the "Schedule" tab
   - Select a recorded session from the dropdown
   - Set your desired interval (in minutes)
   - Optionally set start/end times
   - Choose whether to repeat or run once
   - Click "⏰ Create Schedule"

2. **Monitor Schedules**:
   - View active schedules with next run times
   - See execution history and status
   - Delete schedules when no longer needed

## Keyboard Shortcuts

- `Ctrl+Shift+R`: Toggle recording on/off
- `Ctrl+Shift+U`: Toggle Action Recorder UI

## Use Cases

### 🎮 Gaming Automation
- Automate farming, resource collection, or repetitive tasks
- Schedule routine game maintenance actions
- Create complex multi-step workflows

### 📊 Data Entry & Forms
- Automate repetitive form filling
- Bulk data entry across multiple pages
- Regular data synchronization tasks

### 🧪 Testing & QA
- Record user workflows for regression testing
- Automate UI testing scenarios
- Create reproducible bug reports

### 📈 Web Scraping & Monitoring
- Schedule regular data collection
- Monitor website changes
- Automate report generation

## Advanced Features

### Session Export/Import
- Export sessions as JSON files for backup or sharing
- Import sessions to restore or share workflows
- Bulk export all sessions for data migration

### Smart Element Detection
- Robust CSS selector generation for reliable element targeting
- Fallback strategies for dynamic content
- Handles single-page applications and AJAX content

### Persistent Scheduling
- Uses Chrome's alarm API for reliable background execution
- Schedules survive browser restarts and system reboots
- Automatic cleanup of expired schedules

### Error Handling
- Graceful handling of missing elements
- Retry mechanisms for transient failures
- Detailed logging for troubleshooting

## Technical Details

### Architecture
- **Content Script**: Injected into web pages for action recording/playback
- **Background Service Worker**: Handles persistent scheduling and alarms
- **Popup UI**: Extension popup for quick access and control
- **Storage**: Chrome extension storage for sessions and schedules

### Browser Compatibility
- Chrome 88+ (Manifest V3)
- Edge 88+ (Chromium-based)
- Other Chromium-based browsers

### Permissions Required
- `activeTab`: Access current tab for recording/playback
- `storage`: Save sessions and schedules
- `alarms`: Persistent scheduling
- `scripting`: Inject recording functionality
- Host permissions for target websites

## Privacy & Security

- **Local Storage**: All data stored locally in your browser
- **No External Services**: No data sent to external servers
- **Minimal Permissions**: Only requests necessary browser permissions
- **Open Source**: Fully transparent codebase

## Troubleshooting

### Recording Issues
- **Actions not recorded**: Ensure the recording indicator is visible
- **Missing clicks**: Some elements may require direct clicking (avoid event bubbling)
- **Form data not captured**: Ensure forms are properly submitted

### Playback Issues
- **Elements not found**: Page structure may have changed since recording
- **Timing issues**: Adjust playback speed for better reliability
- **Navigation failures**: Ensure target pages are accessible

### Scheduling Issues
- **Schedules not running**: Check browser permissions and ensure browser is open
- **Missing sessions**: Verify session exists before scheduling
- **Alarm conflicts**: Use the sync function to resolve scheduling conflicts

## Development

### File Structure
```
├── manifest.json                 # Extension manifest
├── background.js                 # Service worker for scheduling
├── content-script.js             # Content script injection
├── index.html                    # Extension popup
├── javascripts/
│   ├── task-queue.js            # Core recording & playback engine
│   └── action-recorder-ui.js    # User interface components
└── README.md                    # This file
```

### Building & Testing
1. Load extension in developer mode
2. Test recording on various websites
3. Verify scheduling functionality
4. Check browser console for debug information

## Contributing

Contributions welcome! Please feel free to submit issues, feature requests, or pull requests.

## License

MIT License - see LICENSE file for details

---

**Happy Automating!** 🚀

For support or questions, please check the browser console for debug information and create an issue with reproduction steps.
