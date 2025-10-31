import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createThread } from '../features/threads/threadsSlice';
import '../styles/CreateThreadForm.css';

function CreateThreadForm({ onSuccess }) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await dispatch(createThread({ title, body, category }));
    setLoading(false);
    if (!result.error) {
      setTitle('');
      setBody('');
      setCategory('General');
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="create-thread-form">
      <h2>Create New Thread</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="General">General</option>
            <option value="Technology">Technology</option>
            <option value="Science">Science</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Sports">Sports</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="body">Body</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Thread'}
        </button>
      </form>
    </div>
  );
}

export default CreateThreadForm;
