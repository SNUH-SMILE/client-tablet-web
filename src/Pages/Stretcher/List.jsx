import React, { useCallback, useEffect, useRef, useState } from "react";
import Pagination from "../../component/Pagination";
import ReactTable from "../../component/ReactTable";
import IsolationApi from "../../Apis/IsolationApi";
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import IsolationList from "./IsolationList";
import AddmissionList from "./AdmissionList";

function StretcherList() {
  UseSetPageTitle("격리자 리스트");
  const searchPatientId = useRef("");
  const searchPatientNm = useRef("");
  const [type, setType] = useState("isolation");
  return (
    <>
      {type === "isolation" && (
        <IsolationList
          searchPatientId={searchPatientId}
          searchPatientNm={searchPatientNm}
          type={type}
          setType={setType}
        />
      )}

      {type === "admission" && (
        <AddmissionList
          searchAdmissionId={searchPatientId}
          searchAdmissionNm={searchPatientNm}
          type={type}
          setType={setType}
        />
      )}
    </>
  );
}

export default StretcherList;
