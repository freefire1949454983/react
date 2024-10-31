import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for styling
import onImage from './switch-on.png';
import offImage from './switch-off.png';

function App() {
  const [buses, setBuses] = useState([]);
  const [selectedBus, setSelectedBus] = useState('');
  const [from, setFrom] = useState('');
  const [toDest, setToDest] = useState('');
  const [date, setDate] = useState('');
  const [getIn, setGetIn] = useState([]);
  const [val, setval] = useState('');
  const [lightStates, setLightStates] = useState(Array(20).fill(0));
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [phnbr, setphnbr] = useState('');
  const [name, setname] = useState('');
  const [newname, setnewname] = useState(''); // New input field state
  const [ticketdata, setticketdata] = useState([]); 

  const handleSeatSelect = (seatNumber) => {
    if (lightStates[seatNumber - 1] === 1) {
      alert(`Seat ${seatNumber} is already filled. Unable to proceed.`);
    } else {
      setSelectedSeat(seatNumber);
    }
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  useEffect(() => {
    fetch("http://localhost:8183/book/bus")
      .then(response => response.json())
      .then(data => {
        setBuses(data);
      })
      .catch(error => {
        console.error('Error fetching bus data:', error);
      });
  }, []);

  const changeme = (e) => {
    setnewname(e.target.value); // Update the state for the new name input
  };

  useEffect(() => {
    if (newname) {
      console.log('Fetching ticket data for:', newname);
      const headers = {
        'Content-Type': 'application/json',
      };
      fetch(`http://localhost:8183/book/getmyticket/${newname}`, {
        method: 'GET',
        headers: headers,
      })
        .then(response => response.json())
        .then(fetchedData => {
          setticketdata(fetchedData);
          console.log('Ticket data fetched:', fetchedData);
        })
        .catch(error => {
          console.error('Error fetching ticket data:', error);
        });
    }
  }, [newname]);

  useEffect(() => {
    if (selectedBus && date) {
      const url = `http://localhost:8183/book/getbusdetail/${selectedBus}/${date}`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          setGetIn(data);
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }
  }, [selectedBus, date]);

  useEffect(() => {
    if (getIn) {
      const newLightStates = [
        getIn.one, getIn.two, getIn.three, getIn.four, getIn.five,
        getIn.six, getIn.seven, getIn.eight, getIn.nine, getIn.ten,
        getIn.eleven, getIn.twelve, getIn.thirteen, getIn.fourteen,
        getIn.fifteen, getIn.sixteen, getIn.seventeen, getIn.eighteen,
        getIn.nineteen, getIn.twenty,
      ];
      setLightStates(newLightStates);
      setval(1);
    }
  }, [getIn]);

  const handleSelectChange = (e) => {
    setSelectedBus(e.target.value);
  };

  const handleLogin = async () => {
    const response = await fetch('http://localhost:8183/book/createBus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        from, todes: toDest, selectedBus: parseInt(selectedBus, 10), date, seatNumber: selectedSeat, name, phonenumber: phnbr 
      }),
    });

    if (response.ok) {
      alert("Successfully registered");
    } else {
      alert('Registration failed');
    }
  };

  return (
    <>
      <div className="container">
        <h1>Bus Booking System</h1>
        <div className="form-section">
          {/* Form Section */}
          <div className="input-group">
            <label>From:</label>
            <input
              type="text"
              placeholder="From_address"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>To:</label>
            <input
              type="text"
              placeholder="To_destination"
              value={toDest}
              onChange={(e) => setToDest(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Phone Number:</label>
            <input
              type="text"
              placeholder="Phone number"
              value={phnbr}
              onChange={(e) => setphnbr(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Name:</label>
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Select a Date:</label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
            />
          </div>

          <div className="input-group">
            <label>Select a Bus:</label>
            <select value={selectedBus} onChange={handleSelectChange}>
              <option value="">-- Select a Bus --</option>
              {buses.map((bus) => (
                <option key={bus.buid} value={bus.buid}>
                  {bus.busname} (ID: {bus.buid})
                </option>
              ))}
            </select>
          </div>

          <button onClick={handleLogin} className="book-button">Book Ticket</button>
        </div>

        {/* Seat Selection Section */}
        {val && (
          <div className="seat-selection">
            <h2>Select Seat</h2>
            <div className="seats-grid">
              {lightStates.map((value, index) => (
                <div key={index} className="seat-item">
                  <img
                    src={value === 1 ? onImage : offImage}
                    alt={value === 1 ? 'On' : 'Off'}
                    className="seat-img"
                  />
                  <button
                    className="seat-button"
                    onClick={() => handleSeatSelect(index + 1)}
                  >
                    Seat {index + 1}
                  </button>
                </div>
              ))}
            </div>
            {selectedSeat && <p className="seat-info">Seat {selectedSeat} is selected</p>}
          </div>
        )}
      </div>

      {/* Ticket Data Section */}
      <div className="ticket-data-section">
        <h2>Your Tickets</h2>
        {ticketdata.length === 0 ? (
          <p>No tickets found.</p>
        ) : (
          <div className="tickets-list">
            {ticketdata.map((ticket, index) => (
              <div key={index} className="ticket-item">
                <h3>Ticket {index + 1}</h3>
                <p><strong>Bus ID:</strong> {ticket.selectedBus===1?"SYAM MOULI":"RAJESH TRAVELS"}</p>
                <p><strong>From:</strong> {ticket.from}</p>
                <p><strong>To:</strong> {ticket.todes}</p>
                <p><strong>Seat Number:</strong> {ticket.seatNumber}</p>
                <p><strong>Passenger Name:</strong> {ticket.name}</p>
                <p><strong>Phone Number:</strong> {ticket.phonenumber}</p>
                <p><strong>Date:</strong> {ticket.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <input 
          type="text" 
          placeholder="Enter New Name" 
          value={newname} // Value from newname state
          onChange={changeme} 
        />
        <p>New name entered: {newname}</p>
      </div>
      
    </>
  );
}

export default App;
