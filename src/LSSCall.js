import React, { useState, useEffect } from "react";
import ThreeSCall from "./ThreeSCall";
import "./LSSCall.css";

const LSSCall = ({ requestsArray, responsesArray, type="Nuowo" }) => {
  const [activeLSSTab, setActiveLSSTab] = useState("");
  const [lssTabs, setLSSTabs] = useState({});

  useEffect(() => {
    if (!requestsArray || requestsArray.length === 0) {
      return;
    }

    const temp_tabs = {};
    const ordinal_suffix_of = (i) => {
      const j = i % 10,
        k = i % 100;
      if (j === 1 && k !== 11) return i + "st";
      if (j === 2 && k !== 12) return i + "nd";
      if (j === 3 && k !== 13) return i + "rd";
      return i + "th";
    };

    for (let i = 1; i <= requestsArray.length; i++) {
      temp_tabs[`NR_${i}`] = `${ordinal_suffix_of(i)} ${type} Call`;
    }

    setLSSTabs(temp_tabs);
    console.log(temp_tabs);
    setActiveLSSTab(Object.values(temp_tabs)[0]);
  }, [requestsArray, responsesArray]);

  return (
    <div className="lss-container" style={{ height: "100%" }}>
      <div className="lssTabs">
        {Object.values(lssTabs).map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeLSSTab === tab ? "active" : ""}`}
            onClick={() => setActiveLSSTab(tab)}
            style={{
              flex: 1,
              padding: "10px",
              cursor: "pointer",
              backgroundColor: activeLSSTab === tab ? "#f0f0f0" : "#fff",
              border: "none",
              borderBottom: activeLSSTab === tab ? "2px solid #007bff" : "none",
              outline: "none",
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={{ height: "100%" }}>
        {requestsArray.map((request, index) => (
          <div
            key={index}
            className="lsstab-content"
            style={{
              display:
                activeLSSTab === lssTabs[`NR_${index + 1}`] ? "block" : "none",
              width: "100%",
              height: "100%",
            }}
          >
            <ThreeSCall
              responseBody={request}
              responseHeaders={responsesArray[index]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LSSCall;
