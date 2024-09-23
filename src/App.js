import React from "react";
import "./App.css";
import Navbar from "./NavBar";
import { useState } from "react";
import Composer from "./Composer";
import ThreeSCall from "./ThreeSCall";
import LSSCall from "./LSSCall";

function App() {
  const [dateDifferences, setDateDifferences] = React.useState(true);
  const [IDDifferences, setIDDifferences] = React.useState(false);

  const [diff, setDiff] = React.useState(null);
  const [errorModalVisible, setErrorModalVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [sessionId, setSessionId] = React.useState(null);
  const [detectCircular] = React.useState(true);
  const [recursiveEqual] = React.useState(true);
  const [maxDepth, setMaxDepth] = React.useState(Infinity);
  const [showEditor, setshowEditor] = React.useState(true);
  const [showModifications, setShowModifications] = React.useState(true);
  const [arrayDiffMethod, setArrayDiffMethod] = React.useState("unorder-lcs");
  const [ignoreCase, setIgnoreCase] = React.useState(false);
  const [ignoreCaseForKey, setIgnoreCaseForKey] = React.useState(false);
  const [indent, setIndent] = React.useState(4);
  const [highlightInlineDiff, setHighlightInlineDiff] = React.useState(true);
  const [inlineDiffMode, setInlineDiffMode] = React.useState("char");
  const [inlineDiffSeparator, setInlineDiffSeparator] = React.useState("");
  const [hideUnchangedLines, setHideUnchangedLines] = React.useState(true);
  const [syntaxHighlight, setSyntaxHighlight] = React.useState(false);

  const [url, setUrl] = useState(
    "https://outlook.office.com/search/api/v2/query"
  );
  const [requestBody, setRequestBody] = useState(
    `{"Cvid":"5d36b5ee-d367-6d8e-7718-93448e606901","Scenario":{"Name":"owa.react"},"TimeZone":"India Standard Time","TextDecorations":"Off","EntityRequests":[{"EntityType":"Conversation","ContentSources":["Exchange","ExchangeArchive"],"Filter":{"Or":[{"Term":{"DistinguishedFolderName":"msgfolderroot"}},{"Term":{"DistinguishedFolderName":"DeletedItems"}}]},"From":0,"Query":{"QueryString":"hello"},"RefiningQueries":null,"Size":25,"Sort":[{"Field":"Score","SortDirection":"Desc","Count":3},{"Field":"Time","SortDirection":"Desc"}],"EnableTopResults":true,"TopResultsCount":3}],"AnswerEntityRequests":[{"Query":{"QueryString":"hello"},"EntityTypes":["Acronym","Bookmark","Event","File"],"From":0,"Size":10,"EnableAsyncResolution":true}],"WholePageRankingOptions":{"EntityResultTypeRankingOptions":[{"ResultType":"Answer","MaxEntitySetCount":6}],"DedupeBehaviorHint":1},"QueryAlterationOptions":{"EnableSuggestion":true,"EnableAlteration":true,"SupportedRecourseDisplayTypes":["Suggestion","NoResultModification","NoResultFolderRefinerModification","NoRequeryModification","Modification"]},"LogicalId":"3121b8a0-0a2d-9e22-26b8-8849cd90c86f"}`
  );

  const defaultHeadersDict = {
    0: { Connection: "keep-alive" },
    1: { "Content-Length": requestBody.length },
    2: {
      "sec-ch-ua":
        '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
    },
    3: { "x-search-griffin-version": "GWSv2" },
    4: { "x-owa-sessionid": "ec8c75b2-4e4a-490e-9f9d-0d3ae7a4bbfc" },
    5: { DNT: "1" },
    6: { scenariotag: "1stPg_cv" },
    7: { "x-ms-appname": "owa-reactmail" },
    8: { "accept-language": "en-US" },
    9: { "client-request-id": "8f59f25d-175e-61c1-d94e-9856ed5071ad" },
    10: { "x-client-localtime": `${new Date().toISOString()}` },
    11: { "ms-cv": "ie5pTL9ZMkvBGi40Kp/4Or.71" },
    12: { owaappid: "9199bf20-a13f-4107-85dc-02114787ef48" },
    13: { "sec-ch-ua-platform": '"Windows"' },
    14: {
      prefer:
        'IdType="ImmutableId", exchange.behavior="IncludeThirdPartyOnlineMeetingProviders", exchange.behavior="IncludeThirdPartyOnlineMeetingProviders"',
    },
    15: {
      "x-anchormailbox":
        "PUID:10032002C6C8C732@72f988bf-86f1-41af-91ab-2d7cd011db47",
    },
    16: {
      "x-search-client-session-id": "8f59f25d-175e-61c1-d94e-9856ed5071ad",
    },
    17: { "x-client-flt-reqid": "62de24d7-2f91-47e1-ace1-d162607d5f9d" },
    18: {
      traceparent: "00-0c8abcf55460db9bb899bfc074a3c2b5-2e105fcbe50c980c-00",
    },
    19: { "content-type": "application/json" },
    20: { "DebugOptions": "Full" },
  };

  const [defaultHeaders, setDefaultHeaders] = useState(defaultHeadersDict);
  const [requiredHeaders, setRequiredHeaders] = useState({
    0: {
      Authorization: "Bearer ",
    },
  });

  const closeModal = () => {
    setErrorModalVisible(false);
  };

  const inlineDiffOptions = React.useMemo(
    () => ({
      mode: inlineDiffMode,
      wordSeparator: inlineDiffSeparator,
    }),
    [inlineDiffMode, inlineDiffSeparator]
  );

  const differOptions = React.useMemo(
    () => ({
      detectCircular,
      maxDepth,
      showModifications,
      arrayDiffMethod,
      ignoreCase,
      ignoreCaseForKey,
      recursiveEqual,
    }),
    [
      detectCircular,
      maxDepth,
      showModifications,
      arrayDiffMethod,
      ignoreCase,
      ignoreCaseForKey,
      recursiveEqual,
    ]
  );

  const [responseBody, setResponseBody] = useState("");

  const [responseHeaders, setResponseHeaders] = useState("");

  const viewerOptions = React.useMemo(
    () => ({
      indent,
      lineNumbers: true,
      highlightInlineDiff,
      inlineDiffOptions,
      hideUnchangedLines,
      syntaxHighlight: syntaxHighlight
        ? {
            theme: "monokai",
          }
        : false,
    }),
    [
      indent,
      highlightInlineDiff,
      inlineDiffOptions,
      hideUnchangedLines,
      syntaxHighlight,
    ]
  );

  const TABS = {
    COMPOSER: "Composer",
    THREE_S_CALL: "3S Call",
    LSS_CALL: "LSS Call",
    IQ_CALL: "IQ Call",
  };

  const [nuowoRequests, setNuowoRequests] = React.useState([]);
  const [nuowoResponses, setNuowoResponses] = React.useState([]);

  const [IQRequests, setIQRequests] = React.useState([]);
  const [IQResponses, setIQResponses] = React.useState([]);

  const IQCall = () => <div>IQ Call Content</div>;
  const [activeTab, setActiveTab] = useState(TABS.COMPOSER);
  const [logs, setLogs] = useState([]);

  const renderTabContent = (activeTab) => {
    switch (activeTab) {
      case TABS.COMPOSER:
        return (
          <Composer
            setResponseBody={setResponseBody}
            setResponseHeaders={setResponseHeaders}
            setActiveTab={setActiveTab}
            TABS={TABS}
            setNuowoRequests={setNuowoRequests}
            setNuowoResponses={setNuowoResponses}
            setIQRequests={setIQRequests}
            setIQResponses={setIQResponses}
            requestBody={requestBody}
            setRequestBody={setRequestBody}
            url={url}
            setUrl={setUrl}
            defaultHeaders={defaultHeaders}
            setDefaultHeaders={setDefaultHeaders}
            requiredHeaders={requiredHeaders}
            setRequiredHeaders={setRequiredHeaders}
          />
        );
      case TABS.THREE_S_CALL:
        return (
          <ThreeSCall
            responseBody={responseBody}
            responseHeaders={responseHeaders}
          />
        );
      case TABS.LSS_CALL:
        return (
          <LSSCall
            requestsArray={nuowoRequests}
            responsesArray={nuowoResponses}
            type="Nuowo"
          />
        );
      case TABS.IQ_CALL:
        return (
          <LSSCall
            requestsArray={IQRequests}
            responsesArray={IQResponses}
            type="IQ"
          />
        );
      default:
        return null;
    }
  };

  const [sidebarWidth, setSidebarWidth] = React.useState(300);
  const [isResizing, setIsResizing] = React.useState(false);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      setSidebarWidth(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="App" style={{ display: "flex" }}>
      <div className="sidebar" style={{ width: sidebarWidth }}>
        <Navbar />
        <div className="instructions">
          <h3>Instructions</h3>
          <ul>
            <li>Avoid adding debug flights.</li>
            <li>
              For 3S Call, input the token in the Composer tab and click
              Execute.
            </li>
            <li>Ensure the token is input before clicking Execute.</li>
            <li>
              Wait after clicking Execute - loading screen functionality will be
              added soon.
            </li>
            <li>Stay tuned for more updates!</li>
          </ul>
        </div>
      </div>
      <div
        className="resizer"
        onMouseDown={handleMouseDown}
        style={{
          width: "10px",
          cursor: "col-resize",
          backgroundColor: "#ddd",
          height: "100vh",
        }}
      />
      <div className="main-layout" style={{ display: "flex", flex: 1 }}>
        <div className="tabs">
          {Object.values(TABS).map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1,
                padding: "10px",
                cursor: "pointer",
                backgroundColor: activeTab === tab ? "#f0f0f0" : "#fff",
                border: "none",
                borderBottom: activeTab === tab ? "2px solid #007bff" : "none",
                outline: "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="tab-content">{renderTabContent(activeTab)}</div>
      </div>
      {errorModalVisible && (
        <div className="modal-backdrop">
          <div className="error-modal">
            <div className="modal-content">
              <button className="close" onClick={closeModal}>
                Close
              </button>
              <p className="modal-text">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
