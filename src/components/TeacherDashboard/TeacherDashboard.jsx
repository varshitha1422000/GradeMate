import React, { useEffect, useState } from "react";
import { IoDocumentText } from "react-icons/io5";
import { CgInsights } from "react-icons/cg";
import { PiMathOperationsFill, PiMathOperationsLight } from "react-icons/pi";
import { BiSolidNetworkChart } from "react-icons/bi";
import { FaAngleDown } from 'react-icons/fa';

import send from "../../img/send.png";
import mic from "../../img/mic.png";

import './TeacherDashboard.css';
import { Link } from "react-router-dom";

const AssessmentsPage = () => {
  const [assessments, setAssessments] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("Past Assessments");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chat-related states
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  // We add a mini-state machine for assignment creation
  // "idle" -> "submitting" -> "done" or "error"
  const [createStatus, setCreateStatus] = useState("idle");

  // -------------------------------------------
  // Fetch Assessments
  // -------------------------------------------
  const fetchAssessments = async () => {
    console.log('Fetching assessments...');
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/teacher/1/assignments'); 
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

      setAssessments(data.assignments || []);
      setError(null);
    } catch (err) {
      console.error('Error details:', err);
      setError('Failed to load assessments');
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []); 

  // -------------------------------------------
  // Handle Chat Send
  // -------------------------------------------
  const handleSendChat = async () => {
    if (chatInput.trim() === "") return;

    // Add user's message to chat
    setChatHistory((prev) => [
      ...prev,
      { text: chatInput, isSystem: "system" }
    ]);
    const userMessage = chatInput.trim();
    setChatInput("");

    // Provide a short delay to simulate "thinking"
    setTimeout(async () => {
      // If user says "yes, looks good", we will create the assignment
      if (userMessage.toLowerCase() === "yes, looks good") {
        // 1) Show something like "Creating assignment..."
        setCreateStatus("submitting");

        // Also post a message to chat so the user sees what's happening
        setChatHistory((prev) => [
          ...prev,
          { text: "Okay, I'm creating your assignment now...", isSystem: true }
        ]);

        // Prepare form data (since the server uses request.form)
        const assignmentData = {
          assignment_name: "Phys 201",
          subject: "Physics",
          description: "Assignment for 2nd semester covering chapters 1 and 2",
          teacher_id: 1, // Replace with the actual teacher ID if needed
          class_name: "2nd Semester"
        };

        // Convert the object to FormData
        const formData = new FormData();
        Object.keys(assignmentData).forEach((key) => {
          formData.append(key, assignmentData[key]);
        });

        try {
          const response = await fetch('http://127.0.0.1:5000/assignment/create', {
            method: 'POST',
            body: formData
            // Don't set the Content-Type header to JSON!
            // fetch will set it to multipart/form-data automatically
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const result = await response.json();
          console.log('Assignment created:', result);

          // 2) Refresh the assignments array
          await fetchAssessments();

          // 3) Update chat with success
          setCreateStatus("done");
          setChatHistory((prev) => [
            ...prev,
            {
              text: "Great news! I've created the assessment. Let me know if you need anything else.",
              isSystem: true
            }
          ]);
        } catch (err) {
          console.error('Error creating assignment:', err);
          setCreateStatus("error");
          setChatHistory((prev) => [
            ...prev,
            {
              text: "Failed to create the assignment. Please try again or contact support.",
              isSystem: true
            }
          ]);
        }
      } else {
        // If user typed something else, respond with the sample questions
        const systemresp = {
          text: `
            Okay sure, I can help you with that! Here are the assessment questions:<br/><br/>
            <strong>Engineering Physics – 2nd Semester Assignment (20 Marks)</strong><br/>
            <em>अध्याय 1 और 2 से चार प्रश्न (Chapter 1 & 2 - Four Questions)</em><br/><br/>
            <strong>(5 अंक)</strong> क्वांटम यांत्रिकी में डी ब्रॉग्ली तरंगधैर्य (de Broglie wavelength) की अवधारणा को समझाइए। इसका सूत्र गतिक ऊर्जा के संदर्भ में व्युत्पन्न कीजिए।<br/>
            <em>(Explain the concept of de Broglie wavelength in quantum mechanics. Derive its formula in terms of kinetic energy.)</em><br/><br/>
            <strong>(5 अंक)</strong> हाइजेनबर्ग अनिश्चितता सिद्धांत (Heisenberg Uncertainty Principle) क्या है? इसका व्यावहारिक महत्व क्या है?<br/>
            <em>(What is Heisenberg’s Uncertainty Principle? Discuss its practical significance.)</em><br/><br/>
            <strong>(5 अंक)</strong> ठोस अवस्था भौतिकी में बंधन ऊर्जा (Binding Energy) का महत्व क्या है? इसे वर्णक्रमीय विश्लेषण के परिप्रेक्ष्य में समझाइए।<br/>
            <em>(What is the significance of binding energy in solid-state physics? Explain it in the context of spectral analysis.)</em><br/><br/>
            <strong>(5 अंक)</strong> विद्युत चुम्बकीय तरंगों (Electromagnetic Waves) के गुणों का वर्णन कीजिए और मैक्सवेल समीकरणों (Maxwell’s Equations) के माध्यम से उनकी उत्पत्ति को समझाइए।<br/>
            <em>(Describe the properties of electromagnetic waves and explain their origin using Maxwell’s Equations.)</em><br/><br/>
            Does this look good to you? Let me know if you’d like any modifications!
          `,
          isSystem: true
        };
        setChatHistory((prev) => [...prev, systemresp]);
      }
    }, 2000);
  };

  // -------------------------------------------
  // Render
  // -------------------------------------------
  if (loading) return <div>Loading assessments...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <div className="main">
        {/* Main Content */}
        <div className="main-content">
          <h2 className="main-title">Assessments</h2>

          {/* Dropdown Filter */}
          <div className="filter">
            <select value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value)}>
              <option>Past Assessments</option>
              <option>Upcoming Assessments</option>
            </select>
          </div>

          <div className="assessment-header">
            <h3 className="managed-assessments">Managed Assessments</h3>
            <hr size="2" width="100%" color="#ccc"></hr>
          </div>

          {/* Assessment Cards */}
          <div className="assessments-grid">
            {assessments.map((assessment, index) => (
              <div key={index} className="card">
                <Link to={`/teacher/${assessment.id}/grading`} style={{ textDecoration: 'none' }}>
                  <div className="icon">
                    <PiMathOperationsLight />
                  </div>
                  <div className="title">
                    <h3>{assessment.name}</h3>
                  </div>
                  <div className="card-footer">
                    <p className="department">{assessment.subject}</p>
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

      {/* Chat Panel */}
      <div className="chat-panel">
        <div className="chat-header">
          <h3>I'm Valli, what can I help with?</h3>
        </div>
        <div className="chat-history">
          {chatHistory.map((message, index) => (
            <div key={index} className={`chat-message ${message.isSystem}`}>
              {/* Using dangerouslySetInnerHTML to render any HTML in the message */}
              <span dangerouslySetInnerHTML={{ __html: message.text }} />
            </div>
          ))}
        </div>

        {/* If you want to show the "Creating assignment..." or "Failed" 
            in the chat itself, you can rely on chatHistory. 
            If you want a separate status, you can do so as well. */}

        <div className="chat-input-section">
          <div className="chat-input">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendChat();
                }
              }}
            />
            <div className="input-icons" onClick={handleSendChat} style={{ cursor: "pointer" }}>
              <img src={mic} alt="mic-icon" />
              <img src={send} alt="send-icon" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentsPage;
