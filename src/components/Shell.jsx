import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GradeDash from './GradeDashboard/GradeDash';
import AssessmentsPage from './TeacherDashboard/TeacherDashboard'; // Updated import

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="teacher/:assignment_id/grading" element={<GradeDash />} />
        <Route path="teacher/dash" element={<AssessmentsPage />} /> {/* Updated route */}
        <Route path="student/review" element={<GradeDash />} />
        <Route path="student/dash" element={<AssessmentsPage />} /> {/* Updated route */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;