import React, { useState } from 'react';
import MoodSelector from './MoodSelector';

const JournalEntry = ({ onEntryAdded }) => {
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content || !selectedMood) return;
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      // Instead of calling the blockchain, just pass the data to parent component
      onEntryAdded({
        content,
        mood: selectedMood
      });
      
      // Reset form after successful submission
      setContent('');
      setSelectedMood(null);
    } catch (error) {
      console.error('Failed to add journal entry:', error);
      setError('Failed to save your entry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="journal-entry-form">
      <h2>How are you feeling today?</h2>
      
      <MoodSelector 
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
        
        {error && <div className="error-message">{error}</div>}
        
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

export default JournalEntry;