import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GradeDash from './GradeDashboard/GradeDash';
import TeacherDashboard from './TeacherDashboard/TeacherDashboard';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/gradedash" element={<GradeDash />} />
        <Route path="/" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;