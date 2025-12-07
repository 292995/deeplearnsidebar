// storage.js - Utility functions for data management
// This could be integrated into other files, but kept separate for modularity

class NoteStorage {
  static async getAllNotes() {
    const result = await chrome.storage.local.get(['notes']);
    return result.notes || [];
  }

  static async saveNote(note) {
    const allNotes = await this.getAllNotes();
    allNotes.push(note);
    await chrome.storage.local.set({ notes: allNotes });
    return note;
  }

  static async deleteNote(noteId) {
    const allNotes = await this.getAllNotes();
    const filtered = allNotes.filter(note => note.id !== noteId);
    await chrome.storage.local.set({ notes: filtered });
  }

  static async clearAllNotes() {
    await chrome.storage.local.clear();
  }

  static async exportNotes() {
    const allNotes = await this.getAllNotes();
    return this.formatAsMarkdown(allNotes);
  }

  static formatAsMarkdown(notes) {
    // Group by video and format as markdown
    const grouped = {};
    notes.forEach(note => {
      const key = `${note.videoTitle} | ${note.channel}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(note);
    });

    let markdown = `# YouTube Learning Notes - Generated on ${new Date().toLocaleDateString()}\n\n`;
    
    for (const [videoKey, notes] of Object.entries(grouped)) {
      markdown += `## ${videoKey}\n\n`;
      
      notes.sort((a, b) => a.timestamp - b.timestamp).forEach(note => {
        const timeStr = this.formatTime(note.timestamp);
        const timestampLink = `${note.url}?t=${note.timestamp}`;
        
        markdown += `- 🕒 [${timeStr}](${timestampLink}):  \n`;
        markdown += `  ${note.note}\n`;
        
        if (note.mechanicalNote) {
          markdown += `  💡 *Mechanical:* ${note.mechanicalNote}\n`;
        }
        
        if (note.tags.length > 0) {
          markdown += `  🏷️ Tags: ${note.tags.map(t => `#${t}`).join(', ')}\n`;
        }
        
        markdown += `\n`;
      });
      
      markdown += `\n`;
    }

    return markdown;
  }

  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

// Export for use in other modules if needed
if (typeof module !== 'undefined') {
  module.exports = NoteStorage;
}
