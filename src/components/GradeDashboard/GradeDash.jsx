import React, { useState } from "react";
import './GradeDash.css';

import  icon  from '../../img/icons8-logo-50.png';
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
    feedback: "The student has provided a basic understanding of stacks and queues, including their operations and real-life applications.",
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
            <img src={icon} alt="submit-icon" />
            <button className="primary-button dashboard-button">Dashboard</button>
        </div>
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <input
                type="text"
                placeholder="Search Student"
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
                style={{
                    backgroundImage: `url(${search})`,
                    backgroundPosition: '10px',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '20px',
                    padding: '10px 20px 10px 40px',
                  }}
                />
                <ul className="student-list">
                    {filteredStudents.map((student) => (
                    <li
                    key={student}
                    className={`student-item ${selectedStudent === student ? "selected" : ""}`}
                    onClick={()=>handleSelect(student)}
                    >
                    {student}
                    </li>
                    ))}
                </ul>
            </aside>

            {/* Main Content */}
            <main className="main-content">
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
                            height="380"
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
                    <div className="feedback main">{questionData.feedback}</div>
                    <div className="tags">
                        <span className="tag">Strong Argument</span>
                        <span className="tag">Concise</span>
                    </div>
                </div>

                {/* Sub Questions Panel */}
                {questionData.subQuestions.map((sub, index) => (
                <div className="sub-question-panel" key={index}>
                    <div>
                        <h3>Score: {sub.score}/{sub.totalScore}</h3>
                        <div className="feedback sub">{sub.feedback}</div>
                    </div>
                    <div className="chat-container">
                        <div className="chat-box">
                            {chatHistory.map((chat, index) => (
                                <div key={index} className= {`chat-message ${chat.isSystem}`}>{chat.text}</div>
                            ))}
                        </div>
                        <div className="comment-section">
                            <input 
                            type="text" 
                            placeholder="Add a comment..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            onKeyPress={(e)=>e.key === 'Enter' && handleSendChat()} />
                            <button className="primary-button" onClick={handleSendChat}>Send</button>
                        </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
                <div className="footer">
                    <button className="primary-button next">Next</button>
                </div>
            </div>
  );
};

export default Dashboard;