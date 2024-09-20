import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import Clock from 'react-live-clock';
import 'react-datepicker/dist/react-datepicker.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const HorlogeCalendrier = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className="row">
      <div className="col-md-12 mb-4 ">
        <div className="card text-white bg-secondary">
          <div className="card-body">
            <h5 className="card-title">Calendrier</h5>
            <DatePicker
              selected={date}
              onChange={date => setDate(date)}
              className="form-control"
            />
          </div>
        </div>
      </div>
      <div className="col-md-12 mb-4">
        <div className="card text-white bg-secondary">
          <div className="card-body">
            <h5 className="card-title">Horloge</h5>
            <Clock
              format={'HH:mm:ss'}
              ticking={true}
              timezone={'Africa/Porto-Novo'}
              className="d-block p-2 bg-white text-dark rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HorlogeCalendrier;
