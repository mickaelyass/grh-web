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
     <div className="col-12 col-md-12 mb-2 bg-secondary py-1">
     
      </div>
      <div className="col-12 col-md-12 mb-2 bg-info py-1">
     
      </div>
    
    </>
     
  );
};

export default HorlogeCalendrier;
