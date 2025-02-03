
import React from 'react';

import { IoDocumentText } from "react-icons/io5";
import { CgInsights } from "react-icons/cg";

import './SideBar.css';

export default function SideBar() {

    const [expanded, setExpanded] = React.useState(false);
    
    const toggleExpansion = () => {
        setExpanded(!expanded);
    };

    return (
        <div className={`sidebar ${expanded ? 'expanded' : ''}`}>
              <nav>
                <ul>
                  <li className={expanded ? 'active expanded' : 'active'} onClick={toggleExpansion}>
                    <IoDocumentText /> 
                    {expanded && (
                      <span> 
                      Assessments
                      </span>
                    )}
                  </li>
                  <li className={expanded ? 'expanded' : ''}>
                    <CgInsights /> 
                    {expanded && (
                      <span>
                        Insights
                      </span>
                    )}
                  </li>
                </ul>
              </nav>
            </div>
    );

      
}