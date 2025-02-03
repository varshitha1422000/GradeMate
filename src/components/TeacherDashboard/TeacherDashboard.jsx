import React from "react";

import { IoDocumentText } from "react-icons/io5";
import { CgInsights } from "react-icons/cg";
import { PiMathOperationsFill } from "react-icons/pi";
import { BiSolidNetworkChart } from "react-icons/bi";
import { PiMathOperationsLight } from "react-icons/pi";
import { FaAngleDown } from 'react-icons/fa';

import './TeacherDashboard.css';
import { Link } from "react-router-dom";

const assessments = [
  {
    title: "Maths",
    code: "M001",
    department: "Engineering 1st year",
    semester: "Semester 2",
    icon: <PiMathOperationsFill />,
  },
  {
    title: "Maths M002",
    code: "M002",
    department: "Engineering 1st year",
    semester: "Semester 2",
    icon: <PiMathOperationsLight />,
  },
  {
    title: "Neural Networks",
    code: "NN001",
    department: "Engineering 1st year",
    semester: "Semester 2",
    icon: <BiSolidNetworkChart />
  },
];

export default function AssessmentsPage() {

  const [selectedFilter, setSelectedFilter] = React.useState("Past Assessments");
  
  return (
    <div className="container">
      {/* Sidebar */}
      {/* <div className="sidebar">
        <nav>
          <ul>
            <li className="active"><IoDocumentText />Assessments</li>
            <li><CgInsights />Insights</li>
          </ul>
        </nav>
      </div> */}

    
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
                <Link to = "/gradedash" style={{ textDecoration: 'none' }}>
              <div className="icon">{assessment.icon}</div>
              <div className="title">
                <h3>{assessment.title}</h3>
                <h3>{assessment.code}</h3>
              </div>
              <div className="card-footer">
                <p className="department">{assessment.department}</p>
                <p className="semester">{assessment.semester}</p>
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
}
