import React, { useState } from "react";
import './GradeDash.css';

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

  // State to store scores and feedback for each question
  const [questionData, setQuestionData] = useState({
    score: 9,
    totalScore: 10,
    subQuestions: [
      {
        score: 3,
        totalScore: 4,
        feedback: "The student correctly described a stack and the push operation but omitted the pop operation which was expected.",
      },
    ],
  });

  const handleSendChat = () => {
    if(chatInput.trim()==="") return;
    const newChat = [...chatHistory, {text:chatInput,isSystem:"system"}];
    setChatHistory(newChat);
    setChatInput("");
    setTimeout(() => {
        const systemresp = {text: "Yes, you are right, let me regrade this question",isSystem:"user"};
        setChatHistory(prev => [...prev,systemresp]);
      }, 1000);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
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
            <h2>Maths M001</h2>
            <aside className="selectStudent">
                <select
                    value={selectedStudent}
                    onChange={(e) => handleSelect(e.target.value)}
                    className="search-input"
                 >
                {filteredStudents.map((student) => (
                <option className= "student-item" key={student} value={student}>
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
                <button className="prev" style={{border: "none"}}>{'<'}</button>
                {[...Array(10).keys()].map((num) => (
                    <button
                        key={num + 1}
                        className={num + 1 === currentQst ? "active" : ""}
                        onClick={() => setCurrentQst(num + 1)}
                    >
                        {num + 1}
                    </button>
                ))}
                <button className="next" style={{border: "none"}}>{'>'}</button>
                </div>
                <h2 className="question-title">
                Define a queue and describe one real-life application of queues?
                </h2>
                <div className="answer-card">
                    <div className="answer-content">
                        <embed
                            src={process.env.PUBLIC_URL + "/pdf/cat.pdf#toolbar=0&navpanes=0&page=1&&navpanes=0&zoom=59"}
                            type="application/pdf"
                            width="100%"
                            height="476vh"
                        />
                    </div>
                </div>
            </main>


            {/* Right Panels */}
            <div className="right-panels-container">
                {/* Main Score Panel */}
                <div className="score-panel">
                    <div className="score-panel-header">
                        <h3>Score: {questionData.score}/{questionData.totalScore}</h3>
                        <button className="approve-button">Approve</button>
                    </div>
                    <div className="tags">
                        <span className="tag">Strong Argument</span>
                        <span className="tag">Concise</span>
                    </div>
                </div>

                {/* Sub Questions Panel */}
                {questionData.subQuestions.map((sub, index) => (
                <div className="sub-question-panel" key={index}>
                    <div className="score-card">
                        <div className="score-header">
                            <h2>Score for Q1.</h2>
                            <span><h3>Score: {sub.score}/{sub.totalScore}</h3></span>
                        </div>
                        <p className="score-description">
                          {sub.feedback}
                        </p>
                        {[...Array(4)].map((_, index) => (
                            <div key={index} className="score-item">
                                <div className="score-item-content">
                                    <div>
                                        <h3>Tempor dolor deserunt</h3>
                                        <ul>
                                            <li>Tempor dolor deserunt anim qui</li>
                                            <li>duis elit ea laboris Lorem.</li>
                                        </ul>
                                    </div>
                                    <div className="progress-container">
                                        <div className="progress-bar">
                                        <div className="progress"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
                ))}
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
                    onSubmit={ handleSendChat}   
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