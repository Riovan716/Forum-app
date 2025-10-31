import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLeaderboards } from '../features/leaderboards/leaderboardsSlice';
import Navbar from '../components/Navbar';
import '../styles/LeaderboardPage.css';

function LeaderboardPage() {
  const dispatch = useDispatch();
  const { leaderboards, loading } = useSelector((state) => state.leaderboards);

  useEffect(() => {
    dispatch(fetchLeaderboards());
  }, [dispatch]);

  return (
    <div className="app">
      <Navbar />
      <div className="container">
        <h1 className="page-title">Leaderboard</h1>
        {loading && <div className="loading" />}
        {!loading && (
          <div className="leaderboard">
            {leaderboards.map((entry, index) => (
              <div key={entry.user.id} className="leaderboard-item">
                <div className="rank">{index + 1}</div>
                <div className="user-info">
                  {entry.user.avatar && (
                    <img src={entry.user.avatar} alt={entry.user.name} className="user-avatar" />
                  )}
                  <div>
                    <p className="user-name">{entry.user.name}</p>
                    <p className="user-email">{entry.user.email}</p>
                  </div>
                </div>
                <div className="score">{entry.score}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LeaderboardPage;
