import React, { useState } from 'react';
import MockMoodSelector from './MoodSelector';

const MockJournalEntry = ({ onEntryAdded }) => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content || !selectedMood) return;
    
    setIsSubmitting(true);
    
    // Simulate a small delay to show loading state
    setTimeout(() => {
      onEntryAdded({
        content,
        mood: selectedMood
      });
      
      // Reset form
      setContent('');
      setSelectedMood(null);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="journal-entry-form">
      <h2>How are you feeling today?</h2>
      
      <MockMoodSelector 
        selectedMood={selectedMood} 
        onMoodSelect={setSelectedMood} 
      />
      
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your thoughts here..."
          maxLength={250}
          rows={4}
          disabled={isSubmitting}
        />
        
        <div className="char-count">{content.length}/250</div>
        
        <button 
          type="submit" 
          className="connect-button"
          disabled={!content || !selectedMood || isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Entry'}
        </button>
      </form>
    </div>
  );
};

export default MockJournalEntry;