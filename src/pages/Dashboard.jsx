import { useState, useEffect } from 'react';
import './Dashboard.css';
import '../components/components.css';
import Notes from '../components/Notes';
import Todo from '../components/Todo';
import Calendar from '../components/Calendar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Timer from '../components/Timer';
import PocketBase from 'pocketbase';

const pb = new PocketBase(import.meta.env.VITE_PB_URL);

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notes, setNotes] = useState([]);
  const [todos, setTodos] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Update notes count when component mounts
    const fetchNotes = async () => {
      try {
        if (pb.authStore.isValid) {
          const records = await pb.collection('notes').getFullList({
            filter: `user = "${pb.authStore.model.id}"`
          });
          setNotes(records);
        }
      } catch (err) {
        console.error('Failed to fetch notes:', err);
      }
    };
    fetchNotes();
  }, []);

  const renderMainContent = () => {
    switch (activeSection) {
      case 'notes':
        return <Notes notes={notes} setNotes={setNotes} />;
      case 'tasks':
        return <Todo todos={todos} setTodos={setTodos} />;
      case 'calendar':
        return <Calendar events={events} setEvents={setEvents} />;
      default:
        return (
          <>
            <Notes notes={notes} setNotes={setNotes} />
            <Todo todos={todos} setTodos={setTodos} />
          </>
        );
    }
  };

  return (
    <div className="dashboard-container">
      <Header username={pb.authStore.model?.name || 'User'} />
      <div className={`dashboard ${activeSection !== 'dashboard' ? 'no-right-panel' : ''}`}>
      {/* Left Sidebar */}
      <div className="sidebar">
        <div className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveSection('dashboard')}>📊 Dashboard</div>
        <div className={`nav-item ${activeSection === 'notes' ? 'active' : ''}`} onClick={() => setActiveSection('notes')}>📝 Notes</div>
        <div className={`nav-item ${activeSection === 'tasks' ? 'active' : ''}`} onClick={() => setActiveSection('tasks')}>✓ Tasks</div>
        <div className={`nav-item ${activeSection === 'calendar' ? 'active' : ''}`} onClick={() => setActiveSection('calendar')}>📅 Calendar</div>
        
        <Timer />
      </div>

      {/* Main Content */}
      <div className="main-content">
        {renderMainContent()}
      </div>

      {/* Right Panel - Only shown in dashboard view */}
      {activeSection === 'dashboard' && (
        <div className="right-panel">
          <h2>Today's Overview</h2>
          
          <div className="stats-container">
            <div className="stats-card">
              <div className="stats-number">{notes.length}</div>
              <div>Notes</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{todos.length}</div>
              <div>Tasks</div>
            </div>
            <div className="stats-card">
              <div className="stats-number">{todos.filter(todo => todo.completed).length}</div>
              <div>Completed</div>
            </div>
          </div>

          <Calendar events={events} setEvents={setEvents} />
        </div>
      )}
    </div>
      <Footer />
    </div>
  );
};

  
  export default Dashboard;
  