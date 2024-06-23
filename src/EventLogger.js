import React, { useState, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const secondsDegrees = time.getSeconds() * 6;
  const minutesDegrees = time.getMinutes() * 6 + time.getSeconds() * 0.1;
  const hoursDegrees = time.getHours() * 30 + time.getMinutes() * 0.5;

  return (
    <div className="relative w-32 h-32 rounded-full border-4 border-gray-200">
      <div className="absolute inset-0 flex items-center justify-center">
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div 
        className="absolute top-1/2 left-1/2 w-1 h-16 bg-black origin-bottom"
        style={{ transform: `translate(-50%, -100%) rotate(${hoursDegrees}deg)` }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-black origin-bottom"
        style={{ transform: `translate(-50%, -100%) rotate(${minutesDegrees}deg)` }}
      />
      <div 
        className="absolute top-1/2 left-1/2 w-0.5 h-20 bg-red-500 origin-bottom"
        style={{ transform: `translate(-50%, -100%) rotate(${secondsDegrees}deg)` }}
      />
    </div>
  );
};

const EventLogger = () => {
  const [events, setEvents] = useState([]);
  const [eventType, setEventType] = useState('');
  const [note, setNote] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');

  const addEvent = () => {
    if (!eventType || !startTime || !duration) return;
    const newEvent = {
      id: Date.now(),
      type: eventType,
      note,
      startTime,
      duration,
      endTime: calculateEndTime(startTime, duration),
    };
    setEvents([newEvent, ...events]);
    resetForm();
  };

  const resetForm = () => {
    setEventType('');
    setNote('');
    setStartTime('');
    setDuration('');
  };

  const calculateEndTime = (start, duration) => {
    const [hours, minutes] = start.split(':');
    const durationMinutes = parseInt(duration);
    const endDate = new Date();
    endDate.setHours(parseInt(hours));
    endDate.setMinutes(parseInt(minutes) + durationMinutes);
    return endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const updateEventEndTime = (id, newEndTime) => {
    setEvents(events.map(event => 
      event.id === id ? { ...event, endTime: newEndTime } : event
    ));
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="flex flex-col items-center mb-6">
        <AnalogClock />
      </div>

      <div className="space-y-4">
        <select 
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">选择事件类型</option>
          <option value="工作">工作</option>
          <option value="学习">学习</option>
          <option value="娱乐">娱乐</option>
          <option value="其他">其他</option>
        </select>

        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="事件备注"
          className="w-full p-2 border rounded"
        />

        <div className="flex space-x-2">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-1/2 p-2 border rounded"
          />
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="持续时间(分钟)"
            className="w-1/2 p-2 border rounded"
          />
        </div>

        <button
          onClick={addEvent}
          className="w-full bg-blue-500 text-white p-2 rounded flex items-center justify-center"
        >
          <PlusCircle className="mr-2" />
          添加事件
        </button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">事件历史</h2>
        {events.map(event => (
          <div key={event.id} className="bg-gray-100 p-4 rounded mb-2">
            <div className="font-bold">{event.type}</div>
            <div>{event.note}</div>
            <div>开始时间: {event.startTime}</div>
            <div>持续时间: {event.duration} 分钟</div>
            <div className="flex items-center">
              <span className="mr-2">结束时间:</span>
              <input
                type="time"
                value={event.endTime}
                onChange={(e) => updateEventEndTime(event.id, e.target.value)}
                className="border rounded p-1"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventLogger;