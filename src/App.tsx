import './App.css'
import Layout from './components/Layout'
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import EventFormPage from './pages/EventFormPage';
import EventPage from './pages/EventPage';
import TaskFormPage from './pages/TaskFormPage';
import ParticipantsPage from './pages/ParticipantsPage';
import NotificationsPage from './pages/NotificationsPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<Navigate to="/events" replace />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout/>}>
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/new" element={<EventFormPage />} />
          <Route path="/events/:eventId" element={<EventPage />} />
          <Route path="/events/:eventId/edit" element={<EventFormPage />} />
          <Route path="/events/:eventId/tasks/new" element={<TaskFormPage />} />
          <Route path="/tasks/:taskId/edit" element={<TaskFormPage />} />
          <Route path="/events/:eventId/participants" element={<ParticipantsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>

  );

}

export default App
