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
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="col-12 col-md-12 mb-4">
      <CCard className="shadow-sm">
        <CCardBody>
          <CCardTitle className="text-center mb-3 fw-bold text-primary">
            Horloge 
          </CCardTitle>
          
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h5 className="text-dark">Heure actuelle :</h5>
              <p className="fs-4 text-success mb-0">{time}</p>
            </div>
            <div>
              <h5 className="text-dark">Date :</h5>
              <DatePicker
                selected={date}
                onChange={(newDate) => setDate(newDate)}
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
            </div>
          </div>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default HorlogeCalendrier;
