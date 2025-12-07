# DeepLearn Sidebar

A Chrome extension designed to enhance learning from YouTube, Bilibili, and X (Twitter) by providing an interactive sidebar for note-taking, AI-powered insights, and Zettelkasten-style organization.

## Features

*   **Contextual Sidebar:** A persistent sidebar that appears on supported platforms (YouTube, Bilibili, X).
*   **Smart Note-Taking:** Capture notes with timestamps, titles, tags, and optional screenshots directly from the video player.
*   **AI-Powered Insights:** Generate "Mechanical Intuition" explanations and step-by-step execution "Traces" using the Gemini API.
*   **Zettelkasten Principles:** Organize notes with types (Log, Question, Insight, Bridge, Definition, Map of Content) and link them together.
*   **Transcript Integration:** Easily quote from the video transcript.
*   **Knowledge Graph:** Visualize connections between your notes.
*   **Playlist Tracking:** Monitor progress within YouTube playlists.
*   **Focus Mode:** Distraction guard to maintain concentration.
*   **Flexible Export:** Export notes in Markdown, JSON, or Anki-compatible CSV formats.

## Installation

1.  **Clone or Download:** Clone this repository or download the source code as a ZIP file and extract it.
2.  **Open Chrome Extensions:** Navigate to `chrome://extensions/` in your Chrome browser.
3.  **Enable Developer Mode:** Toggle the "Developer mode" switch in the top right corner.
4.  **Load Unpacked Extension:** Click the "Load unpacked" button and select the extracted project folder.
5.  **Set API Key:** Click the export/download icon in the sidebar and select "Set API Key". Enter your [Google Gemini API Key](https://aistudio.google.com/app/apikey).

## Usage

*   **Open Sidebar:** The sidebar is open by default. Use the toggle button on the right side of the page to close/reopen it if needed.
*   **Take Notes:**
    *   Enter your note in the main text area.
    *   Add tags separated by commas.
    *   Use the type selector (Log, Question, etc.) to categorize your note.
    *   Click "Snap" (Alt+S) to capture a screenshot along with your note.
    *   Click "Log" (Alt+L) to save a text-only note.
    *   Click "Quote Transcript" to insert the current transcript line.
    *   Click "Paste Selection" to insert selected text from the webpage.
    *   Use `[[` in the note text to link to previous notes.
*   **AI Features:**
    *   Click "Intuition" (Alt+T) to generate a conceptual explanation.
    *   Click "Trace" to generate a mechanical step-by-step trace.
*   **View Knowledge Graph:** Click the graph icon in the header to visualize note connections.
*   **Export Notes:** Click the download icon in the header and choose your preferred format.

## Project Structure

*   `manifest.json`: Defines the extension's metadata, permissions, and entry points.
*   `content/content.js`: Injects the sidebar UI and handles user interactions on the web page.
*   `background/background.js`: Handles background tasks (currently minimal).
*   `util/storage.js`: Manages saving and loading notes using Chrome's local storage.
*   `assets/`: (Placeholder) For icons and other static assets (e.g., `icon16.png`, `icon48.png`, `icon128.png`).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. Ensure your code adheres to standard JavaScript practices and includes relevant comments.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Notes

*   This extension requires a Google Gemini API key for AI features.
*   It has been tested primarily on YouTube. Compatibility with Bilibili and X might vary.
*   The knowledge graph visualization is a basic implementation.
