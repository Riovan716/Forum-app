import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchThreads, setFilteredCategory } from '../features/threads/threadsSlice';
import Navbar from '../components/Navbar';
import ThreadCard from '../components/ThreadCard';
import CreateThreadForm from '../components/CreateThreadForm';
import '../styles/HomePage.css';

function HomePage() {
  const dispatch = useDispatch();
  const { threads, loading, filteredCategory } = useSelector((state) => state.threads);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    dispatch(fetchThreads());
  }, [dispatch]);

  const categories = Array.from(new Set(threads.map((thread) => thread.category)));
  const filteredThreads = filteredCategory
    ? threads.filter((thread) => thread.category === filteredCategory)
    : threads;

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="btn btn-primary create-thread-btn"
          >
            {showCreateForm ? 'Cancel' : 'Create New Thread'}
          </button>
        )}

        {showCreateForm && <CreateThreadForm onSuccess={() => setShowCreateForm(false)} />}

        <div className="filters">
          <button
            type="button"
            className={`filter-btn ${filteredCategory === '' ? 'active' : ''}`}
            onClick={() => dispatch(setFilteredCategory(''))}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn ${filteredCategory === category ? 'active' : ''}`}
              onClick={() => dispatch(setFilteredCategory(category))}
            >
              {category}
            </button>
          ))}
        </div>

        {loading && <div className="loading" />}
        {!loading && (
          <div className="threads-list">
            {filteredThreads.map((thread) => (
              <ThreadCard key={thread.id} thread={thread} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
