import React, { useEffect, useState } from "react";

import { IoDocumentText } from "react-icons/io5";
import { CgInsights } from "react-icons/cg";
import { PiMathOperationsFill } from "react-icons/pi";
import { BiSolidNetworkChart } from "react-icons/bi";
import { PiMathOperationsLight } from "react-icons/pi";
import { FaAngleDown } from 'react-icons/fa';

import './TeacherDashboard.css';
import { Link } from "react-router-dom";

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Past Assessments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessments = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://127.0.0.1:5000/teacher/1/assignments'); // Update with dynamic ID if needed
        console.log('Response status:', response);
        const contentType = response.headers.get('content-type');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Received non-JSON response");
        }
        const data = await response.json();
        console.log('Received data:', data);

        setAssessments(data.assignments); // Access the assignments array
        setError(null);
      } catch (error) {
        console.error('Error details:', error);
        setError('Failed to load assessments');
        setAssessments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssessments();
  }, []);

  if (loading) return <div>Loading assessments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="main">
        {/* Main Content */}
        <div className="main-content">
          <h2>Assessments</h2>

          {/* Dropdown Filter */}
          <div className="filter">
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option>Past Assessments</option>
              <option>Upcoming Assessments</option>
            </select>
          </div>

          <div className="assessment-header">
            <div className="managed-assessments">Managed Assessments</div>
            <hr size="2" width="80%" color="#ccc"></hr>
          </div>

          {/* Assessment Cards */}
          <div className="assessments-grid">
            {assessments.map((assessment, index) => (
              <div key={index} className="card">
                <Link to={`/teacher/${assessment.id}/grading`} style={{ textDecoration: 'none' }}>
                  <div className="icon"><PiMathOperationsLight /></div>
                  <div className="title">
                    <h3>{assessment.name}</h3>
                    {/* <h3>DS102</h3> */}
                  </div>
                  <div className="card-footer">
                    <p className="department">Computer Science</p>
                    <p className="semester">2nd Semester</p>
                  </div>
                </Link>
              </div>
            ))}
            {/* Add New Card */}
            <div className="add-card">+</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
