/**
 * Background Worker
 * 
 * Handles background tasks for the DeepLearn extension.
 */

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "PING") {
    sendResponse({ status: "alive" });
  }
  
  // Placeholder for future complex tasks like full page summarization 
  // or syncing data across tabs if needed.
});
