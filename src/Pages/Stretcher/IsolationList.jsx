import React, { useEffect, useRef, useState } from "react";
import Pagination from "../../component/Pagination";
import ReactTable from "../../component/ReactTable";
import IsolationApi from "../../Apis/IsolationApi";

export default function AddmissionList({
  searchPatientId,
  searchPatientNm,
  type,
  setType,
}) {
  const searchPatientIsolation = useRef();
  const [paginationObj, setPaginationObj] = useState({
    currentPageNo: 1,
    pageSize: 10,
    recordCountPerPage: 15,
  });
  const [totalPageCount, setTotalPageCount] = useState(null);
  const [isolationTableData, setIsolationTableData] = useState([]);
  const [activeStatus, setActiveStatus] = useState();
  // 정렬
  // By: 정렬 컬럼명
  // Div: 정렬 방식 ('' || asc || desc)
  const [sortedOrder, setSortedOrder] = useState({ By: "", Dir: "" });

  const isolationApi = new IsolationApi(
    searchPatientId,
    searchPatientNm,
    activeStatus,
    searchPatientIsolation,
    paginationObj,
    sortedOrder
  );

  useEffect(() => {
    getIsolationList();
  }, [sortedOrder, paginationObj.currentPageNo]);

  useEffect(() => {
    setActiveStatus("1");
  }, []);

  const setPaginationAndAdmissionTableData = (data) => {
    setPaginationObj((prevState) => ({
      ...prevState,
      prevPaginationExists: data.result.paginationInfoVO.prevPaginationExists,
      nextPaginationExists: data.result.paginationInfoVO.nextPaginationExists,
      firstPageNoOnPageList: data.result.paginationInfoVO.firstPageNoOnPageList,
      lastPageNoOnPageList: data.result.paginationInfoVO.lastPageNoOnPageList,
    }));
    setTotalPageCount(data.result.paginationInfoVO.totalPageCount);
    setIsolationTableData(data.result.admissionByQuarantineVOList);
  };
  //라디오버튼
  const handledActiveStatus = (e) => {
    setActiveStatus(e.target.value);
    handledOnSearch(e);
  };

  // 자가격리자 리스트 조회
  const getIsolationList = (activeStatus) => {
    isolationApi.select(activeStatus).then(({ data }) => {
      selectedIsolationId.current = "";
      setPaginationAndAdmissionTableData(data);
    });
  };

  // 정렬 검색 이벤트
  const handledSearchWithSort = (orderBy, orderDir) => {
    setSortedOrder(() => ({ By: orderBy, Dir: orderDir }));
  };
  const selectedIsolationId = useRef("");

  const getSelectedIsolationId = (patientId, { admissionId }) => {
    selectedIsolationId.current = admissionId;
  };

  const isolationTableColumn = [
    /* {Header: 'test', accessor: 'admissionId', sortedYn:true, orderBy:sortedOrder.By, orderDiv:sortedOrder.Dir, sortedEvent:handledSearchWithSort},*/
    {
      Header: "환자ID",
      accessor: "patientId",
      sortedYn: true,
      orderBy: sortedOrder.By,
      orderDiv: sortedOrder.Dir,
      sortedEvent: handledSearchWithSort,
    },
    {
      Header: "환자명",
      accessor: "patientNm",
      sortedYn: true,
      orderBy: sortedOrder.By,
      orderDiv: sortedOrder.Dir,
      sortedEvent: handledSearchWithSort,
    },
    {
      Header: "격리시작일",
      accessor: "admissionDate",
      sortedYn: true,
      orderBy: sortedOrder.By,
      orderDiv: sortedOrder.Dir,
      sortedEvent: handledSearchWithSort,
    },
    {
      Header: "격리일수",
      accessor: "qantnDay",
      sortedYn: true,
      orderBy: sortedOrder.By,
      orderDiv: sortedOrder.Dir,
      sortedEvent: handledSearchWithSort,
    },
    { Header: "혈압", accessor: "bp", vital: true },
    { Header: "심박수", accessor: "prResult", vital: true },
    { Header: "호흡수", accessor: "rrResult", vital: true },
    { Header: "체온", accessor: "btResult", vital: true },
    { Header: "산소포화도", accessor: "spResult", vital: true },
    {
      Header: "격리상태",
      accessor: "qantnStatus",
      editElementType: "Isolation",
    },
  ];
  // 검색 Input Enter 이벤트
  const handledOnSearch = (e) => {
    if (
      e.keyCode === 13 ||
      e.target.tagName === "BUTTON" ||
      e.target.tagName === "SELECT"
    ) {
      if (paginationObj.currentPageNo === 1) {
        getIsolationList();
      } else {
        setPaginationObj({
          currentPageNo: 1,
          pageSize: 10,
          recordCountPerPage: 15,
        });
      }
    }
    if (e.target.tagName === "INPUT") {
      if (paginationObj.currentPageNo === 1) {
        getIsolationList(e.target.value);
      } else {
        setPaginationObj({
          currentPageNo: 1,
          pageSize: 10,
          recordCountPerPage: 15,
        });
      }
    }
  };
  return (
    <>
      <main className="flex_layout_1row">
        <div className="row">
          <div className="col col-lg-12">
            <div className="card indiv">
              <div className="card-content">
                <div className="table-responsive">
                  <div className="table-header">
                    <form>
                      <div className="d-flex">
                        <div className="tbl_title">자택격리 환자 리스트</div>
                        <div className="me-3 d-flex">
                          <span className="stit">목록타입</span>
                          <div style={{ alignSelf: "center" }}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="type"
                              id="isolation-type"
                              defaultChecked={type === "isolation"}
                              value="isolation"
                              onClick={(e) => setType(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="isolation-type"
                            >
                              자가격리자
                            </label>

                            <input
                              className="form-check-input"
                              type="radio"
                              name="type"
                              id="adimission-type"
                              defaultChecked={type === "admission"}
                              value="admission"
                              onClick={(e) => setType(e.target.value)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="adimission-type"
                            >
                              생활치료센터
                            </label>
                          </div>
                        </div>
                        <div className="me-3 d-flex">
                          <span className="stit">환자ID</span>
                          <input
                            className="form-control w160"
                            type="text"
                            defaultValue=""
                            onKeyUp={handledOnSearch}
                            ref={searchPatientId}
                          />
                        </div>
                        <div className="me-3 d-flex">
                          <span className="stit">환자명</span>
                          <input
                            className="form-control w160"
                            type="text"
                            defaultValue=""
                            onKeyUp={handledOnSearch}
                            ref={searchPatientNm}
                          />
                        </div>
                        <div className="me-3 d-flex">
                          <span className="stit">격리상태</span>
                          <select
                            className="form-select"
                            defaultValue={"1"}
                            ref={searchPatientIsolation}
                            onChange={(e) => handledOnSearch(e)}
                          >
                            <option value={""}>전체</option>
                            <option value={"1"}>격리중</option>
                            <option value={"2"}>격리해제</option>
                            <option value={"3"}>격리해제 30일 이하</option>
                            <option value={"4"}>격리해제 30일 이상</option>
                          </select>
                        </div>
                        <div className="me-3 d-flex">
                          <span className="stit">환자상태</span>
                          <div style={{ alignSelf: "center" }}>
                            <input
                              className="form-check-input"
                              type="radio"
                              name="active"
                              id="active"
                              defaultChecked={
                                activeStatus && activeStatus === "1"
                              }
                              value="1"
                              onClick={(e) => handledActiveStatus(e)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="active"
                            >
                              ACTIVE
                            </label>

                            <input
                              className="form-check-input"
                              type="radio"
                              name="active"
                              id="inActive"
                              defaultChecked={
                                activeStatus && activeStatus === "2"
                              }
                              value="2"
                              onClick={(e) => handledActiveStatus(e)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="inActive"
                            >
                              INACTIVE
                            </label>
                          </div>
                        </div>
                        <div className="ms-auto">
                          <div className="btn_wrap d-flex">
                            <button
                              type="button"
                              className="btn btn-gray"
                              onClick={handledOnSearch}
                            >
                              검색
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div className="table-body">
                    <ReactTable
                      tableHeader={isolationTableColumn}
                      tableBody={isolationTableData}
                      sorted={true}
                      customTableStyle={
                        "table table-striped table-hover text-expert"
                      }
                      trOnclick={getSelectedIsolationId}
                      trDbOnclicke={getSelectedIsolationId}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*페이징 start*/}
        <Pagination
          paginationObj={paginationObj}
          totalPageCount={totalPageCount}
          handledList={setPaginationObj}
        />
        {/*페이징 end*/}
      </main>
    </>
  );
}
