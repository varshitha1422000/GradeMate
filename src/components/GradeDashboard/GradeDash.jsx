import React, { useState, useEffect } from "react";
import './GradeDash.css';
import { useParams } from 'react-router-dom';

import search from '../../img/icons8-search.svg';

const students = [
  "Abhay Desali",
  "Matthew Martinez",
  "Elizabeth Hall",
  "Maria White",
  "Elizabeth Watson",
  "Elizabeth Allen",
  "Caleb Jones",
];

const Dashboard = () => {
  const [selectedStudent, setSelectedStudent] = useState(students[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQst, setCurrentQst] = useState(1);
  const [feedback, setFeedbackData] = useState({});
  const params = useParams();
  const assignment_id = params.assignment_id || 1; // Default to 1 if not provided
  const [question, setQuestion] = useState("");
  const [questionFeedback, setQuestionFeedback] = useState({});
  const [submission_id, setSubmissionId] = useState(1);
  const [pdf_url, setPdfUrl] = useState(`http://127.0.0.1:5000/submission/${submission_id}/answer_sheet`);
  const defaultQuestion = 1;

  const handleQuestionClick = async (questionNumber) => {
    setCurrentQst(questionNumber); // Update the current question state
    try {
      const response = await fetch(`http://127.0.0.1:5000/assignment/${assignment_id}/question/${questionNumber}`);
      const data = await response.json();
      setQuestion(data.question);
      if (feedback.questions && feedback.questions[questionNumber - 1]) {
        setQuestionFeedback(feedback.questions[questionNumber - 1]);
      }
      setPdfUrl(`http://127.0.0.1:5000/submission/${submission_id}/question/${questionNumber}/answer`);
    } catch (error) {
      console.error("Error fetching question data:", error);
    }
  };

  const fetchFeedback = async () => {
    setCurrentQst(currentQst); 
    try {
      const response = await fetch(`http://127.0.0.1:5000/submission/${submission_id}/feedback`);
      const data = await response.json();
      setFeedbackData(data);
      console.log(`current question is ${currentQst}`);
      console.log(data.questions[currentQst-1]);
      setQuestionFeedback(data.questions[currentQst-1]);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  useEffect(() => {
    // fetch overall feedback only when assignment changes
    fetchFeedback();
  }, [assignment_id, currentQst]);
  
  useEffect(() => {
    // fetch or set question-specific details when user clicks on a new question
    handleQuestionClick(currentQst);
  }, [currentQst]);
  

  const handleSendChat = async () => {
    if (chatInput.trim() === "") return;
    const newChat = [...chatHistory, { text: chatInput, isSystem: "system" }];
    setChatHistory(newChat);
    setChatInput("");
    setTimeout(() => {
      const systemresp = { text: "Yes, you are right, let me regrade this question", isSystem: "user" };
      setChatHistory(prev => [...prev, systemresp]);
    }, 1000);

    await fetch(`http://127.0.0.1:5000/submission/${submission_id}/regrade`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    await fetchFeedback();
    await handleQuestionClick(currentQst);
  };

  const handleSelect = (student) => {
    setSelectedStudent(student);
  };

  const filteredStudents = students.filter((student) =>
    student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h2>Data Structures 101</h2>
        <aside className="selectStudent">
          <select
            value={selectedStudent}
            onChange={(e) => handleSelect(e.target.value)}
            className="search-input"
          >
            {filteredStudents.map((student) => (
              <option className="student-item" key={student} value={student}>
                {student}
              </option>
            ))}
          </select>
        </aside>
      </div>
      
      <div className="dashboard-container">
        {/* Main Content */}
        <main className="mainContent">
          <div className="questions">
            <button className="prev" style={{ border: "none" }}>{'<'}</button>
            {[...Array(8).keys()].map((num) => (
              <button
                key={num + 1}
                className={num + 1 === currentQst ? "active" : ""}
                onClick={() => handleQuestionClick(num + 1)}
              >
                {num + 1}
              </button>
            ))}
            <button className="next" style={{ border: "none" }}>{'>'}</button>
          </div>
          <h2 className={`question-title ${question ? 'selected' : ''}`}>
            {question}
          </h2>
          <div className="answer-card">
            <div className="answer-content">
              <embed
                src={pdf_url}
                type="application/pdf"
                width="100%"
                height="700vh"
              />
            </div>
          </div>
        </main>

        {/* Right Panels */}
        <div className="right-panels-container">
          {/* Main Score Panel */}
          <div className="score-panel">
            <div className="score-panel-header">
              <h2>Test Score: {feedback.overall_score}/10</h2>
              <button className="approve-button">Approve</button>
            </div><br></br>
            <div className="tags">
              <span className="tag">Strong Argument</span>
              <span className="tag">Concise</span>
            </div>
          </div>

          {Object.keys(questionFeedback).length !== 0 && (
            <div className="sub-question-panel">
              <div className="score-card">
                <div className="score-header">
                  <h3>Score for Q{questionFeedback.question_number}</h3>
                  <span><h3>{questionFeedback.total_score}/5</h3></span>
                </div>
                <p className="score-description">
                  {questionFeedback.question_feedback}
                </p>
                {questionFeedback.criteria && questionFeedback.criteria.map((c, index) => (
                  <div key={index} className="score-item">
                    <div className="score-item-content">
                      <div>
                        <h5>{c.criterion_name}</h5> <br></br>
                        <p>{c.feedback}</p>
                      </div>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div className="progress" style={{ width: `${(c.score_awarded / c.max_score) * 100}%` }}></div>
                        </div>
                        <span>{c.score_awarded}/{c.max_score}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
        {/* Chat Panel */}
        <div className="chat-panel">
          <div className="chat-header">
            <h3>I'm Valli, What can I help with?</h3>
          </div>
          <div className="chat-history">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.isSystem}`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <div className="comment-section">
            <input
              type="text"
              value={chatInput}
              onSubmit={handleSendChat}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendChat();
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;