import React, { useState } from "react";
import "./UserInput.css";
import axios from "axios";

function UserInput({
  keysList,
  setKeysList,
  showEditor,
  setDiff,
  setShowEditor,
  setErrorMessage,
  setErrorModalVisible,
  requestBody,
  onInputChange,
  placeholder="Request Body",
}) {
  const [loading, setLoading] = useState(false);

  const prettifyRequestBody = () => {
    try {
      const parsedBody = JSON.parse(requestBody);
      return JSON.stringify(parsedBody, null, 2);
    } catch (error) {
      return requestBody; // Return the original string if it can't be parsed
    }
  };

  const prettifiedRequestBody = prettifyRequestBody();

  const handleTextareaChange = (event) => {
    onInputChange(event.target.value);
  };

  const handleCloseClick = () => {
    onInputChange("");
  };

  const onSubmit = async () => {
    setLoading(true);
    console.log("Came to this block!");
    try {
      const response = await axios.post(
        "https://outlook.office.com/search/api/v2/query?setflight=ShouldLogLssDiagnosticData,StopSkipSlowLssProvider,MaxTargetCountForLssRequestResponseDiagnostics100,EnableLSSRequestResponseInDiagnosticsFlight,EnableSensitiveInfoCollector,DisableEnableMsgPackForIQ,FanoutDisableMessagePackForLssSearchRequest,AddUserShardRequestResponseInDiagnosticsFlight,EnableUserTokenLogs&debug=1",
        requestBody,
        {
          headers: {
            "Connection": "keep-alive",
            "Content-Length": requestBody.length,
            "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Microsoft Edge";v="128"',
            "x-search-griffin-version": "GWSv2",
            "x-owa-sessionid": "ec8c75b2-4e4a-490e-9f9d-0d3ae7a4bbfc",
            "DNT": "1",
            "scenariotag": "1stPg_cv",
            "x-ms-appname": "owa-reactmail",
            "accept-language": "en-US",
            "authorization": "Bearer eyJ0eXAiOiJKV1QiLCJub25jZSI6IlNSQUpuTENJLWN3b1h3NmVBeTJ5NEtFVDJFSUwxQm1KcVVmc3FUSVZudU0iLCJyaCI6IjAuQW84RHY0ajVjdkdHcjBHUnF5MTgwQkhiUjFlSHFHYU1KWEpNaVR3LWktMU5hSmthQU4wLiIsImFsZyI6IlJTMjU2IiwieDV0IjoiSDluajVBT1Nzd01waGcxU0Z4N2phVi1sQjl3Iiwia2lkIjoiSDluajVBT1Nzd01waGcxU0Z4N2phVi1sQjl3In0.eyJhdWQiOiJodHRwczovL291dGxvb2sub2ZmaWNlLmNvbS9zZWFyY2giLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC83MmY5ODhiZi04NmYxLTQxYWYtOTFhYi0yZDdjZDAxMWRiNDcvIiwiaWF0IjoxNzI2NjMzMzUyLCJuYmYiOjE3MjY2MzMzNTIsImV4cCI6MTcyNjYzODM1MCwiYWNjdCI6MCwiYWNyIjoiMSIsImFjcnMiOlsidXJuOnVzZXI6cmVnaXN0ZXJzZWN1cml0eWluZm8iLCJjMiIsImMzIiwiYzEwIl0sImFpbyI6IkFaUUFhLzhYQUFBQVhFZmt3K1lvbFNHaHdoTnh0LytWQS93bnl6Y285dFQvZWdXa3Z3NS8vSVN4emRhR2RQckgvQWVJOVpkdGJmY2M0TEJaS25vVERtM3FDU1EwNXBCSGpCbTdzdTJiOHBrU1MxeUJvZ0FyVHlCU21FNnllM2tadjNTMGg0OXRZVVNiZW42ZTVMd1FzMkFIbENoUUlEVmtWVjJWR1FVaHJRSnMyYk1uaTRLazFmQUJYaVVsWmRLK3hyd3VBRGczTDUzLyIsImFtciI6WyJyc2EiLCJtZmEiXSwiYXBwaWQiOiI5MTk5YmYyMC1hMTNmLTQxMDctODVkYy0wMjExNDc4N2VmNDgiLCJhcHBpZGFjciI6IjAiLCJjb250cm9scyI6WyJhcHBfcmVzIl0sImNvbnRyb2xzX2F1ZHMiOlsiOTE5OWJmMjAtYTEzZi00MTA3LTg1ZGMtMDIxMTQ3ODdlZjQ4IiwiNjZhODg3NTctMjU4Yy00YzcyLTg5M2MtM2U4YmVkNGQ2ODk5IiwiMDAwMDAwMDMtMDAwMC0wZmYxLWNlMDAtMDAwMDAwMDAwMDAwIl0sImRldmljZWlkIjoiN2IyMWIyYTgtZmExNS00OWRhLTk5NjMtN2NkMzkwN2M4YTk3IiwiZmFtaWx5X25hbWUiOiJDaG91cmFzaXlhIiwiZ2l2ZW5fbmFtZSI6IkFtYW4iLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIyNDA0OmY4MDE6ODAyODozOmRjMjQ6ZDgxMzpiMTQ1OjliNjIiLCJuYW1lIjoiQW1hbiBDaG91cmFzaXlhIiwib2lkIjoiYjE5OTU0ZmMtNDdmYS00ODg1LThmMWUtOWZiMGYyYWQyYWFkIiwib25wcmVtX3NpZCI6IlMtMS01LTIxLTIxMjc1MjExODQtMTYwNDAxMjkyMC0xODg3OTI3NTI3LTY5NjgzNDExIiwicHVpZCI6IjEwMDMyMDAyQzZDOEM3MzIiLCJyaCI6IkkiLCJzY3AiOiJTdWJzdHJhdGVTZWFyY2gtSW50ZXJuYWwuUmVhZFdyaXRlIiwic2lnbmluX3N0YXRlIjpbImR2Y19tbmdkIiwiZHZjX2NtcCIsImlua25vd25udHdrIiwia21zaSJdLCJzdWIiOiJkX01Mcl9zYlZ3UWxrMlVrbjdPLWF2S2V0TVdrbGJFVjd1ZXFUYmI1amZJIiwidGlkIjoiNzJmOTg4YmYtODZmMS00MWFmLTkxYWItMmQ3Y2QwMTFkYjQ3IiwidW5pcXVlX25hbWUiOiJhY2hvdXJhc2l5YUBtaWNyb3NvZnQuY29tIiwidXBuIjoiYWNob3VyYXNpeWFAbWljcm9zb2Z0LmNvbSIsInV0aSI6ImhjV3owVjdlc1V1RTg5N1UzUW9TQUEiLCJ2ZXIiOiIxLjAiLCJ4bXNfaWRyZWwiOiIxMiAxIn0.F68YH8G1ksl1aoyYX2mDlp4Ytarx6101AdSytYERlGF4b2zcIx4YGJh5rOjrY1lRkv3s5LVwVYXPtGSwqLPf6yUvQKs16jPC-X2riDU-MhG82EZnOrz0-8QGqdOkL-2h32kOXeNOigVQBw0LlRb-dVdXLHomIvwAVVaIaxh-jckA_dxCVc_43vH9pc9AFw3VBflk28MZVzJ_CQudPfWBPDmo7qWZHj0P3mxqUNM6v4OP5XgQgct_oxogLmnenaL24LnmcsRCfWY-qweVjSv8GqNTNwSdbyo3dBR2UXVK9IU2Jnl4endKzm6zrM3Z9DgOutMfpF_KHZ_gPe8Ansbs4w",
            "client-request-id": "8f59f25d-175e-61c1-d94e-9856ed5071ad",
            "x-client-localtime": new Date().toISOString(),
            "ms-cv": "ie5pTL9ZMkvBGi40Kp/4Or.71",
            "owaappid": "9199bf20-a13f-4107-85dc-02114787ef48",
            "sec-ch-ua-platform": '"Windows"',
            "prefer": 'IdType="ImmutableId", exchange.behavior="IncludeThirdPartyOnlineMeetingProviders", exchange.behavior="IncludeThirdPartyOnlineMeetingProviders"',
            "x-anchormailbox": "PUID:10032002C6C8C732@72f988bf-86f1-41af-91ab-2d7cd011db47",
            "x-client-flights": "OWA_BestMatch_V15,CalendarInsightsFlight,OWA_HasArchiveMailbox,EESForEmailConv,EESForEmailConvSsa,EnableTidBits,EnableTidBits2,PopulateTidBits,PopulateTidBits2,CalendarAnswerFlight,CalendarAnswerWithQas,CalendarAnswerConflicts,CalendarInsightsFlight,ConflictsInCalendarInsights,bfbfileansoff,WprPromoteFileAnswer,FetchFileArtifacts",
            "x-clientid": "3B5D698E8AC8473CB81EF4E6F975A8EF",
            "x-owa-canary": "X-OWA-CANARY_cookie_is_null_or_empty, X-OWA-CANARY_cookie_is_null_or_empty",
            "x-req-source": "Mail",
            "sec-ch-ua-mobile": "?0",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Edg/128.0.0.0",
            "requestBody-type": "application/json",
            "x-routingparameter-sessionkey": "PUID:10032002C6C8C732@72f988bf-86f1-41af-91ab-2d7cd011db47",
            "client-session-id": "a7f5ab0f-8ebb-d5c5-6e8f-ac6c055f319f",
            "x-owa-hosted-ux": "false",
            "Accept": "*/*",
            "Origin": "https://outlook.office.com",
            "X-Edge-Shopping-Flag": "1",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Dest": "empty",
            "Accept-Encoding": "gzip, deflate, br, zstd",
            "DebugOptions": "Full"
          }
        }
      );
      console.log(response.data);
    } catch (error) {
      setErrorMessage(error.message);
      setErrorModalVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="request-body">
      {loading ? (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      ) : (
        <div className="userInput">
          <div className="inputs">
            <div className="left-textarea">
              <span
                className="close-icon-userInput"
                onClick={() => handleCloseClick()}
              >
                &#10006;
              </span>
              <textarea
                placeholder={placeholder}
                onChange={handleTextareaChange}
                spellCheck="false"
                value={prettifiedRequestBody}
              ></textarea>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserInput;
