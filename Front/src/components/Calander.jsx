import React, { useState } from 'react'
import { Button } from './ui/button';

const Calander = ({ date, setDate }) => {
    const [showCalendar, setShowCalendar] = useState(false); // toggle calendar
    return (
        <div className="">
            <Button className='cursor-pointer' onClick={() => setShowCalendar(prev => !prev)}>{showCalendar ? 'Close Calendar' : 'Select Date'}</Button>
            {showCalendar && (
                <div className="mt-4 w-full max-w-sm space-y-2">
                    <div className="text-sm font-medium">Selected Date: {date.toDateString()}</div>
                    <div className="border rounded-lg p-4 shadow">
                        <div className="flex justify-between mb-2 items-center">
                            <button
                                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() - 1))}
                                className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                Prev
                            </button>
                            <div className="text-md font-semibold">
                                {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                            </div>
                            <button
                                onClick={() => setDate(new Date(date.getFullYear(), date.getMonth() + 1))}
                                className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
                            >
                                Next
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-1">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="font-medium">{day}</div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center">
                            {(() => {
                                const year = date.getFullYear();
                                const month = date.getMonth();
                                const firstDay = new Date(year, month, 1).getDay();
                                const daysInMonth = new Date(year, month + 1, 0).getDate();

                                const calendar = [];

                                // Empty boxes before the 1st
                                for (let i = 0; i < firstDay; i++) {
                                    calendar.push(<div key={`empty-${i}`}></div>);
                                }

                                // Days of the month
                                for (let day = 1; day <= daysInMonth; day++) {
                                    const fullDate = new Date(year, month, day);
                                    const isSelected =
                                        date.getDate() === day &&
                                        date.getMonth() === month &&
                                        date.getFullYear() === year;

                                    calendar.push(
                                        <button
                                            key={day}
                                            onClick={() => {
                                                setDate(fullDate);
                                                setShowCalendar(false); // Auto-close on date select
                                            }}
                                            className={`p-1 rounded-full w-8 h-8 ${isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-200'}`}
                                        >
                                            {day}
                                        </button>
                                    );
                                }

                                return calendar;
                            })()}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Calander
