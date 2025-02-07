import React, { useState, useEffect } from "react";
import "./GradeDash.css";
import { useParams } from "react-router-dom";

import bot from "../../img/bot.png";
import user from "../../img/user.png";
import send from "../../img/send.png";
import mic from "../../img/mic.png";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [currentQst, setCurrentQst] = useState(1);

  // We’ll replace "isLoading" with a multi-step approach:
  // "idle"  => normal UI
  // "regrading" => show "Regrading screen..." message
  // "done" => done regrading, show the final updated data
  const [regradeStep, setRegradeStep] = useState("idle");

  const [feedback, setFeedbackData] = useState({});
  const [question, setQuestion] = useState("");
  const [questionFeedback, setQuestionFeedback] = useState({});

  // Hard-coded for demo
  const [submission_id] = useState(1);

  const params = useParams();
  const assignment_id = params.assignment_id || 1;

  const [pdfUrl, setPdfUrl] = useState(
    `http://127.0.0.1:5000/submission/${submission_id}/answer_sheet`
  );

  // ----------------------------------------------
  // Fetch overall feedback for the submission
  // ----------------------------------------------
  const fetchFeedback = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/submission/${submission_id}/feedback`
      );
      const data = await response.json();
      setFeedbackData(data);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, [assignment_id, submission_id]);

  // ----------------------------------------------
  // Whenever feedback or currentQst changes,
  // fetch the question text and set sub-feedback
  // ----------------------------------------------
  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:5000/assignment/${assignment_id}/question/${currentQst}`
        );
        const data = await response.json();
        setQuestion(data.question);

        setPdfUrl(
          `http://127.0.0.1:5000/submission/${submission_id}/question/${currentQst}/answer`
        );
      } catch (error) {
        console.error("Error fetching question data:", error);
      }
    };

    if (feedback.questions && feedback.questions[currentQst - 1]) {
      setQuestionFeedback(feedback.questions[currentQst - 1]);
    } else {
      setQuestionFeedback({});
    }

    fetchQuestion();
  }, [assignment_id, submission_id, currentQst, feedback]);

  // ----------------------------------------------
  // Handle question number click
  // ----------------------------------------------
  const handleQuestionClick = (questionNumber) => {
    setCurrentQst(questionNumber);
  };

  // ----------------------------------------------
  // Multi-stage regrading UI
  // 1) Immediately show "Egrading..."
  // 2) After 1s, show "Regrading screen..."
  // 3) After the server calls finish, set to "done" => updated UI
  // ----------------------------------------------
  const handleSendChat = async () => {
    if (chatInput.trim() === "") return;

    // Add chat to history
    setChatHistory((prev) => [
      ...prev,
      { text: chatInput, isSystem: "system" },
    ]);
    setChatInput("");

    // Simulate a system response
    setTimeout(() => {
      const systemresp = {
        text: "Yes, you are right, let me regrade this question",
        isSystem: "user",
      };
      setChatHistory((prev) => [...prev, systemresp]);
    }, 1000);

    // Step 2) After 1 second, show "Regrading screen..."
    setTimeout(() => {
      setRegradeStep("regrading");
    }, 2000);

    // Perform the actual regrade
    await fetch(`http://127.0.0.1:5000/submission/${submission_id}/regrade`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Re-fetch feedback
    await fetchFeedback();

    // Step 3) Once we’re done, show final updated data
    setTimeout(() => {
      setRegradeStep("done");
    }, 3000);
  };

  // ----------------------------------------------
  // Student select
  // ----------------------------------------------
  const handleSelect = (student) => {
    setSelectedStudent(student);
    // If needed, update submission_id here
  };

  const filteredStudents = students.filter((student) =>
    student.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ----------------------------------------------
  // Decide what to render based on regradeStep
  // ----------------------------------------------
  // If you want to show only partial changes (e.g., question panel)
  // you can conditionally render just that panel based on `regradeStep`
  // and keep the rest of the UI visible.
  // For simplicity, let's do a small inline approach:
  const renderQuestionPanel = () => {
    return (
      <>
        <h2 className={`question-title ${question ? "selected" : ""}`}>
          {question}
        </h2>
        <div className="answer-card">
          <div className="answer-content">
            <embed
              src={pdfUrl}
              type="application/pdf"
              width="100%"
              height="675px"
            />
          </div>
        </div>
      </>
    );
  };

  // Same logic for Score Panel
  const renderScorePanel = () => {
    if (regradeStep === "regrading") {
      return (
        <div className="score-panel">
          <h2 style={{ textAlign: "center" }}>Updating Score...</h2>
        </div>
      );
    }
    return (
      <div className="score-panel">
        <div className="score-panel-header">
          <h2>Test Score: {feedback.overall_score}/10</h2>
          <button className="approve-button">Approve</button>
        </div>
        <br />
        <div className="tags">
          <span className="tag">Strong Argument</span>
          <span className="tag">Concise</span>
        </div>
      </div>
    );
  };

  // And the sub-question panel
  const renderSubQuestionPanel = () => {
    if (regradeStep === "regrading") {
      return (
        <div className="sub-question-panel">
          <h4 style={{ textAlign: "center" }}>Regrading Q{currentQst}...</h4>
        </div>
      );
    }

    if (Object.keys(questionFeedback).length === 0) {
      return null;
    }

    return (
      <div className="sub-question-panel">
        <div className="score-card">
          <div className="score-header">
            <h3>Score for Q{questionFeedback.question_number}</h3>
            <span>
              <h3>{questionFeedback.total_score}/5</h3>
            </span>
          </div>
          <p className="score-description">
            {questionFeedback.question_feedback}
          </p>
          {questionFeedback.criteria &&
            questionFeedback.criteria.map((c, index) => (
              <div key={index} className="score-item">
                <div className="score-item-content">
                  <div>
                    <h4>{c.criterion_name}</h4> <br />
                    <p>{c.feedback}</p>
                  </div>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className="progress"
                        style={{
                          width: `${(c.score_awarded / c.max_score) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span>
                      {c.score_awarded}/{c.max_score}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  };

  // ----------------------------------------------
  // Final Render
  // ----------------------------------------------
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
            <button
              className="prev"
              style={{ border: "none", background: "none", fontWeight: "bold" }}
            >
              {"<"}
            </button>
            {[...Array(8).keys()].map((num) => (
              <button
                key={num + 1}
                className={num + 1 === currentQst ? "active" : ""}
                onClick={() => handleQuestionClick(num + 1)}
              >
                {num + 1}
              </button>
            ))}
            <button
              className="next"
              style={{ border: "none", background: "none", fontWeight: "bold" }}
            >
              {">"}
            </button>
          </div>
          {renderQuestionPanel()}
        </main>

        {/* Right Panels */}
        <div className="right-panels-container">
          {renderScorePanel()}
          {renderSubQuestionPanel()}
        </div>

        {/* Chat Panel */}
        <div className="chat-panel">
          <div className="chat-header">
            <h3>I'm Valli, what can I help with?</h3>
          </div>
          <div className="chat-history">
            {chatHistory.map((message, index) => (
              <div key={index} className={`chat-message ${message.isSystem}`}>
                {message.isSystem === "system" ? (
                  <img className="bot-icon" src={bot} alt="app-icon" />
                ) : (
                  <img className="human-icon" src={user} alt="app-icon" />
                )}
                <span>{message.text}</span>
              </div>
            ))}
          </div>
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
              <div className="input-icons">
                <img src={send} alt="app-icon" />
                <img src={mic} alt="app-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
