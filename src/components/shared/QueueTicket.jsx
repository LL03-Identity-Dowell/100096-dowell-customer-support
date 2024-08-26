import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const socket = io.connect("https://www.dowellchat.uxlivinglab.online");

const QueueUpdate = ({workspaceId, apiKey}) => {
    const [ticketCount, setTicketCount] = useState(0);
    // const [waitingTime, setWaitingTime] = useState('00:00');
    const [waitingTime, setWaitingTime] = useState(() => {
        const storedWaitingTime = localStorage.getItem("chatEndTime");
        return storedWaitingTime ? parseInt(storedWaitingTime, 10) : 0;
      });
    const [loading, setLoading] = useState(true);
    


    useEffect(() => {
        const queueData = {
            workspace_id: workspaceId,
            api_key: apiKey,
        };
        socket.emit('queue_update', queueData);
        socket.on('queue_update', (response) => {
            if (response && response.data) {
                const { ticket_count, waiting_time } = response.data;
                setTicketCount(ticket_count);
                setWaitingTime(waiting_time);
                setLoading(false); 
                console.log('res data ', response);
                
            } else {
                console.error('Invalid response:', response);
            }
        });
        socket.on('connect_error', (error) => {
            console.error('Connection Error:', error);
            setLoading(false);
        });
        return () => {
            socket.off('queue_update'); 
        };
    }, []);



    useEffect(() => {
        const endTime = Number(localStorage.getItem("chatEndTime"));
        let intervalId;
        if (!endTime) {
          //setShowLoading(false);
          //setIsChatOpen(true);
          //setLoading(false);
          return;
        }
    
        const checkAndSetChatBox = (endTime) => {
          const updateRemainingTime = () => {
            const currentTime = Number(Date.now());
            const remainingTime = endTime - currentTime;
            if (remainingTime <= 0) {
              clearInterval(intervalId);
              setIsChatOpen(true);
              setLoading(false);
              setShowLoading(false);
              localStorage.setItem("chatEndTime", remainingTime);
              return;
            } else {
              const ticketFound =
                localStorage.getItem("create_ticket_detail") && true;
              if (ticketFound) {
                const remainingMinutes = Math.ceil(remainingTime / 60000);
                localStorage.setItem("chatEndTime", remainingTime + currentTime);
                setWaitingTime(remainingMinutes);
                setLoading(true);
                setShowLoading(true);
              }
            }
          };
    
          // Initial check
          updateRemainingTime();
    
          // Update the remaining time every minute (60000 milliseconds)
          intervalId = setInterval(updateRemainingTime, 60000);
    
          // Cleanup interval on component unmount
          return () => clearInterval(intervalId);
        };
    
        checkAndSetChatBox(endTime);
      }, [waitingTime]);

    const navigate = useNavigate();

    const handleClick = () => {
        navigate('/');
    };

    return (
        <div className="fixed z-10 top-[50%] duration-1000 left-1/2 transform -translate-x-1/2  -translate-y-1/2 w-[90%] md:w-[70%]  max-w-[100%] min-w-[360px]  max-h-[95%] min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 relative rounded-lg shadow-lg text-center max-w-lg w-full">
                <button onClick={handleClick}><FaTimes className='absolute top-4 right-4 bg-orange-500 text-3xl rounded-full text-white' /></button>
                <p className='text-2 py-2 font-bold'>Queue Ticket</p>
                <h1 className="text-2xl font-bold text-green-600">DoWell Digital Q</h1>
                <p className="text-xl text-orange-600 mb-2 font-bold">Welcome</p>

                {loading ? (
                    <p>Loading queue information...</p>
                ) : (
                    <>
                        <p className='font-semibold text-black'>There are</p>
                        <p className="text-6xl font-bold text-orange-600 mb-4">{ticketCount}</p>
                        <p className="text-black font-semibold mb-6">People ahead of you</p>
                        <div className="bg-orange-500 text-white p-4 font-semibold mb-6 leading-6">
                            <p>Approximate waiting time will be <br /> <span className="font-bold">&lt;{waitingTime}&gt;</span></p>
                            <p>Do you want to join the queue?</p>
                        </div>
                        <div className="sm:flex text-white text-sm justify-between sm:space-x-5 space-y-1">
                            <button className="bg-[#A9A9A8] px-4 py-4 w-full">No</button>
                            <button className="bg-[#039788] px-4 py-4 w-full">I am in rush</button>
                            <button className="bg-green-500 px-4 py-4 w-full">Join the Queue</button>
                        </div>
                        <div className='font-semibold text-sm mt-6'>
                            <p>This app updates in real time</p>
                            <p>Last updated - {new Date().toLocaleTimeString()}</p>
                        </div>
                    </>
                )}

                <div className="font-semibold text-xs mt-2">
                    <p>(About) (Privacy Policy) (Terms of service)</p>
                </div>
            </div>
        </div>
    );
};

export default QueueUpdate;
