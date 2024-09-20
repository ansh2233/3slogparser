import React, { useState } from "react";
import "./Composer.css";
import UserInput from "./UserInput";
import KeyValueInput from "./KeyValueInput";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import axios from "axios";
import base64 from "base-64";

const decode = (encodedString) => {
  encodedString = encodedString.replace(/"/g, "");

  if (encodedString.startsWith("77u/")) {
    encodedString = encodedString.slice(4);
  }

  // Decode the Base64 encoded string
  const decodedBytes = base64.decode(encodedString);

  // Convert bytes to a string
  return decodedBytes;
};

const findKey = (obj, key) => {
  // Implement the findKey function to search for the key in the object
  for (const k in obj) {
    if (k === key) return obj[k];
    if (typeof obj[k] === "object") {
      const result = findKey(obj[k], key);
      if (result) return result;
    }
  }
  return null;
};

const updateUrl = (url) => {
  const setFlightParams =
    "setflight=ShouldLogLssDiagnosticData,StopSkipSlowLssProvider,MaxTargetCountForLssRequestResponseDiagnostics100,EnableLSSRequestResponseInDiagnosticsFlight,EnableSensitiveInfoCollector,DisableEnableMsgPackForIQ,FanoutDisableMessagePackForLssSearchRequest,AddUserShardRequestResponseInDiagnosticsFlight,EnableUserTokenLogs&debug=1";

  if (url.includes("search/api/v2/query?")) {
    return `${url}&${setFlightParams}`;
  } else if (url.includes("search/api/v2/query")) {
    return `${url}?${setFlightParams}`;
  } else if (url.includes("searchservice/api/v2/query?")) {
    return `${url}&${setFlightParams}`;
  } else if (url.includes("searchservice/api/v2/query")) {
    return `${url}?${setFlightParams}`;
  }

  return url;
};

const nuowoResponsesToIQCalls = (nuowoResponses) => {
  const IQRequests = [];
  const IQResponses = [];

  nuowoResponses.forEach((response) => {
    const parsedResponse = JSON.parse(response);
    const sensitiveInfos =
      parsedResponse.DiagnosticData.SensitiveDiagnosticInfos;

    console.log("Sensitive Infos: ", sensitiveInfos);

    try {
      sensitiveInfos.forEach((info) => {
        if (info.Key === "ItemQueryRequest") {
          IQRequests.push(decode(info.Value.requestJson));
        } else if (info.Key === "ItemQueryResponse") {
          IQResponses.push(decode(info.Value.ResponseInBase64));
        }
      });
    } catch (error) {
      console.error("Error processing sensitiveInfos: ", error);
    }
  });

  return { IQRequests, IQResponses };
};

const responseToNuowoCalls = (response) => {
  const logs = response.data.Logs;
  const str_xap_logs = logs[0];
  const xap_logs = JSON.parse(str_xap_logs);

  let numNuowoRequests = 0;
  let numNuowoResponses = 0;
  const nuowoRequestsTemp = [];
  const nuowoResponsesTemp = [];
  const nuowoCodes = [];

  // Find nuowo Requests
  try {
    for (const item of xap_logs["XapDebug"]) {
      const key = Object.keys(item)[0];
      if (key.endsWith("HttpRequestBody.SearchStep")) {
        const value = item[key];
        numNuowoRequests += 1;
        nuowoCodes.push(key.substring(12, key.indexOf(".")));
        nuowoRequestsTemp.push(decode(value));
      } else if (key.endsWith("HttpResponseBody.SearchStep")) {
        numNuowoResponses += 1;
      }
    }
  } catch (error) {
    console.error("Error processing XapDebug logs: ", error);
  }

  for (const code of nuowoCodes) {
    const response = findKey(
      xap_logs,
      "HttpResponse_" + code + ".HttpResponseBody.SearchStep"
    );
    nuowoResponsesTemp.push(decode(response));
  }

  return { nuowoRequestsTemp, nuowoResponsesTemp };
};

const mergeHeaders = (defaultHeaders, requiredHeaders) => {
  const mergedHeaders = {};

  const addHeaders = (headers) => {
    Object.values(headers).forEach((header) => {
      Object.entries(header).forEach(([key, value]) => {
        mergedHeaders[key] = value;
      });
    });
  };

  addHeaders(defaultHeaders);
  addHeaders(requiredHeaders);

  return mergedHeaders;
};

const Composer = ({
  setResponseBody,
  setResponseHeaders,
  setActiveTab,
  TABS,
  setNuowoRequests,
  setNuowoResponses,
  setIQRequests,
  setIQResponses,
  requestBody,
  setRequestBody,
  url,
  setUrl,
  defaultHeaders,
  setDefaultHeaders,
  requiredHeaders,
  setRequiredHeaders,
}) => {
  const [showHeaders, setShowHeaders] = useState(false);
  const [showRequiredHeaders, setRequiredShowHeaders] = useState(true);

  const toggleHeaders = () => {
    setShowHeaders(!showHeaders);
  };

  const toggleRequiredHeaders = () => {
    setRequiredShowHeaders(!showRequiredHeaders);
  };

  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const onHeaderChange = (index, key, value, type) => {
    if (type == "default") {
      setDefaultHeaders({
        ...defaultHeaders,
        [index]: { [key]: value },
      });
    } else {
      setRequiredHeaders({
        ...requiredHeaders,
        [index]: { [key]: value },
      });
    }
  };

  const onAddHeader = () => {
    const len = Object.keys(requiredHeaders).length;
    setRequiredHeaders({ ...requiredHeaders, [len]: { "": "" } });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(mergeHeaders(defaultHeaders, requiredHeaders));
    var response = null;
    try{
      response = await axios.post(updateUrl(url), requestBody, {
        headers: mergeHeaders(requiredHeaders, defaultHeaders),
      });      
    } catch(error){
      console.error("Error executing the search request: ", error);
      return;
    }

    setResponseBody(response.data);
    setResponseHeaders(response.headers);
    setActiveTab(TABS.THREE_S_CALL);

    const { nuowoRequestsTemp, nuowoResponsesTemp } =
      responseToNuowoCalls(response);
    const { IQRequests, IQResponses } =
      nuowoResponsesToIQCalls(nuowoResponsesTemp);

    setNuowoRequests(nuowoRequestsTemp);
    setNuowoResponses(nuowoResponsesTemp);

    setIQRequests(IQRequests);
    setIQResponses(IQResponses);

    console.log("Response: ", response);
    console.log("Logs: ", response.data.Logs);
  };

  return (
    <form onSubmit={handleSubmit} className="submit3SRequest">
      <div className="composer">
        <div className="url-input">
          <input
            type="text"
            value={url}
            onChange={handleUrlChange}
            placeholder="Enter URL"
            className="url-input-box"
          />
          <button type="submit" className="send-button">
            Execute
          </button>
        </div>
        <div className="request-headers">
          <UserInput onInputChange={setRequestBody} requestBody={requestBody} />
          <div className="headers" style={{ overflow: "auto", flex: 1 }}>
            <button
              type="button"
              onClick={onAddHeader}
              style={{ marginBottom: "10px" }}
            >
              Add Header
            </button>
            <div
              className="default-headers-toggle"
              onClick={toggleRequiredHeaders}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showRequiredHeaders ? <FaChevronDown /> : <FaChevronRight />}
              <span style={{ marginLeft: "5px" }}>Required Headers</span>
            </div>
            {showRequiredHeaders && (
              <div className="headers-list">
                {Object.entries(requiredHeaders).map(([key, value]) => (
                  <KeyValueInput
                    key={key}
                    index={key}
                    defaultDict={value}
                    onHeaderChange={onHeaderChange}
                    type={"required"}
                  />
                ))}
              </div>
            )}
            <div
              className="default-headers-toggle"
              onClick={toggleHeaders}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              {showHeaders ? <FaChevronDown /> : <FaChevronRight />}
              <span style={{ marginLeft: "5px" }}>Default Headers</span>
            </div>
            {showHeaders && (
              <div className="headers-list">
                {Object.entries(defaultHeaders).map(([key, value]) => (
                  <KeyValueInput
                    key={key}
                    index={key}
                    defaultDict={value}
                    onHeaderChange={onHeaderChange}
                    type={"default"}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default Composer;
