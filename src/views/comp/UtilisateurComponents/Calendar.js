import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import moment from "moment";
import { CCard, CCardBody, CCardTitle } from "@coreui/react";
import "react-datepicker/dist/react-datepicker.css";
import "@coreui/coreui/dist/css/coreui.min.css";

const HorlogeCalendrier = () => {
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(moment().format("HH:mm:ss"));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().format("HH:mm:ss"));
    }, 1000);
    
    return () => clearInterval(timer); // Cleanup on component unmount
  }, []);

  return (
    <>  
     <div className="col-12 col-md-6 mb-3">
        <CCard className="text-white bg-secondary">
          <CCardBody>
            <CCardTitle>Calendrier</CCardTitle>
            <DatePicker
              selected={date}
              onChange={date => setDate(date)}
              className="form-control"
              dateFormat="dd/MM/yyyy"
            />
          </CCardBody>
        </CCard>
      </div>
      <div className="col-12 col-md-6 mb-3">
        <CCard className="text-white bg-secondary">
          <CCardBody>
            <CCardTitle>Horloge</CCardTitle>
            <div className="d-block p-2 bg-white text-dark rounded">
              {time}
            </div>
          </CCardBody>
        </CCard>
      </div>
    </>
     
  );
};

export default HorlogeCalendrier;
