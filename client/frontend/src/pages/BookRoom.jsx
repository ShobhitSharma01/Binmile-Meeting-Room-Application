import { useEffect, useState, forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useUserContext } from '../context/context';
import { MdEvent, MdFilterList } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Select from 'react-select';

const CustomInput = forwardRef(({ value, onClick }, ref) => (
  <input
    readOnly
    value={value}
    onClick={onClick}
    ref={ref}
    className="w-full md:w-[70%] border border-gray-300 p-3 bg-white rounded-xl cursor-pointer"
  />
));

export default function BookRoom() {
  const { roomBooking, bookings, rooms, fetchRooms, fetchBookings, user } = useUserContext();

  const roundToNextFive = (date) => {
    const newDate = new Date(date);
    const minutes = newDate.getMinutes();
    const remainder = minutes % 30;
    if (remainder !== 0) newDate.setMinutes(minutes + (30 - remainder));
    newDate.setSeconds(0);
    newDate.setMilliseconds(0);
    return newDate;
  };

  const now = roundToNextFive(new Date());
  const ahead = new Date(now.getTime() + 30 * 60 * 1000);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [startTime, setStartTime] = useState(now);
  const [endTime, setEndTime] = useState(ahead);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const [filterRoom, setFilterRoom] = useState(() => localStorage.getItem('filterRoom') || 'all');
  const [filterMode, setFilterMode] = useState(
    () => localStorage.getItem('filterMode') || 'upcoming',
  );
  const [fromDate, setFromDate] = useState(() => {
    const stored = localStorage.getItem('fromDate');
    return stored ? new Date(stored) : null;
  });
  const [toDate, setToDate] = useState(() => {
    const stored = localStorage.getItem('toDate');
    return stored ? new Date(stored) : null;
  });

  const [showFilters, setShowFilters] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const roomOptions = rooms.map((r) => ({ value: r.id, label: r.name }));

  const customStyles = {
    control: (provided) => ({ ...provided, borderRadius: '0.5rem' }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? '#7A5C45' : 'white',
      color: state.isFocused ? 'white' : '#333',
      '&:hover': { backgroundColor: '#7A5C45', color: 'white' },
    }),
  };
  const filteredBookings = bookings
    .map((room) => ({
      ...room,
      bookings: room.bookings.filter((slot) => {
        const start = new Date(slot.start_time);
        const end = new Date(slot.end_time);

        if (filterMode === 'today') {
          return start.toDateString() === new Date().toDateString();
        }
        if (filterMode === 'upcoming') {
          return end >= new Date();
        }
        if (fromDate && end < fromDate) return false;
        if (toDate && start > toDate) return false;

        return true;
      }),
    }))
    .filter((room) => room.bookings.length > 0);

  useEffect(() => {
    if (!user) return;
    fetchRooms();
  }, [user]);
  useEffect(() => {
    setCurrentPage(1);
  }, [filterRoom, filterMode, fromDate, toDate]);

  const loadBookings = async (page = 1) => {
    if (!user) return;
    try {
      const { bookings: data, totalPages } = await fetchBookings({
        page,
        roomId: filterRoom !== 'all' ? filterRoom : undefined,
        filterMode,
        fromDate,
        toDate,
      });

      setTotalPages(totalPages);
    } catch (err) {
      toast.error('Failed to fetch bookings');
    }
  };

  useEffect(() => {
    loadBookings(currentPage);
  }, [currentPage, user, filterRoom, filterMode, fromDate, toDate]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = roundToNextFive(new Date());
      setStartTime(now);
    }, 60 * 1000);
    setStartTime(roundToNextFive(new Date()));
    return () => clearInterval(interval);
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (buttonDisabled) return;
    setButtonDisabled(true);
    setTimeout(() => setButtonDisabled(false), 1500);

    if (!selectedRoom || !startTime || !endTime) {
      toast.error('All fields are required');
      return;
    }

    try {
      await roomBooking({
        room_id: String(selectedRoom),
        employee_id: String(user.id),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });
      loadBookings(currentPage);
    } catch (err) {
      toast.error('Booking failed');
    }
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const firstname = user.name.split(' ')[0];



  return (
    <div className="h-full flex justify-center items-start py-4 px-4 sm:px-6 lg:px-8">
      <div className="bg-white/70 backdrop-blur-xl shadow-xl shadow-[#C4B6A6]/40 rounded-3xl w-full h-screen md:max-h-[85vh] overflow-y-auto mb-4 scrollbar-hide p-4 sm:p-8 lg:p-8 border border-[#E0D4C7]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Booking Form (same as before) */}
          <form onSubmit={handleBooking} className="space-y-4 sm:space-y-5">
            {/* User Info */}
            <div className="flex items-center gap-3 mt-2">
              <div className="w-10 h-10 bg-[#7A5C45] text-white flex items-center justify-center rounded-full shadow-md">
                <MdEvent className="text-xl" />
              </div>
              <div className="flex flex-col">
                <span className="text-md font-semibold text-[#3C2F2F]">{firstname}</span>
                <span className="text-sm text-gray-500">Booking done by</span>
              </div>
            </div>

            {/* Room Selection */}
            <div>
              <h2 className="text-sm font-medium mb-2 text-gray-700">Select a Room</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    onClick={() => {
                      setFilterRoom(room.id);
                      setSelectedRoom(room.id);
                    }}
                    className={`cursor-pointer p-2 rounded-xl border shadow-md transition-all ${filterRoom === room.id
                        ? 'bg-[#7A5C45] text-white border-[#7A5C45]'
                        : 'bg-white hover:bg-gray-100 border-gray-300'
                      }`}
                  >
                    <h3 className="text-md text-center">{room.name}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Date & Time Pickers */}
            <div className="flex flex-col md:flex-row gap-4 items-start mt-6">
              {/* Date */}
              <div className="flex flex-col w-[60%] sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <DatePicker
                  selected={startTime}
                  onChange={(date) => {
                    const newDate = new Date(date);
                    newDate.setHours(startTime.getHours(), startTime.getMinutes());
                    setStartTime(newDate);

                    const newEnd = new Date(date);
                    newEnd.setHours(endTime.getHours(), endTime.getMinutes());
                    setEndTime(newEnd);
                  }}
                  dateFormat="d-MMM-yyyy"
                  placeholderText="Select Booking Date"
                  customInput={<CustomInput />}
                />
              </div>

              {/* Start Time */}
              <div className="flex flex-col w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                <DatePicker
                  selected={startTime}
                  onChange={(time) => {
                    const newStart = new Date(startTime);
                    newStart.setHours(time.getHours(), time.getMinutes());
                    setStartTime(newStart);

                    const newEnd = new Date(newStart);
                    newEnd.setMinutes(newEnd.getMinutes() + 30);
                    setEndTime(newEnd);
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="hh:mm aa"
                  minTime={
                    startTime.toDateString() === new Date().toDateString()
                      ? new Date()
                      : new Date().setHours(0, 0, 0)
                  }
                  maxTime={new Date().setHours(23, 45)}
                  customInput={<CustomInput />}
                />
              </div>

              {/* End Time */}
              <div className="flex flex-col w-full sm:w-1/3">
                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                <DatePicker
                  selected={endTime}
                  onChange={(time) => {
                    const newEnd = new Date(endTime);
                    newEnd.setHours(time.getHours(), time.getMinutes());
                    setEndTime(newEnd);
                  }}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  dateFormat="hh:mm aa"
                  minTime={startTime}
                  maxTime={new Date().setHours(23, 45)}
                  customInput={<CustomInput />}
                />
              </div>
            </div>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.95 }}
              disabled={buttonDisabled}
              className={`w-full px-4 py-3 sm:py-2 rounded-xl transition-all cursor-pointer mt-4 ${buttonDisabled
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#7A5C45] text-white hover:bg-[#8f6e54]'
                }`}
            >
              {buttonDisabled ? 'Booking...' : 'Book Room'}
            </motion.button>
          </form>
          {/* Booking list and pagination logic below */}
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[#3C2F2F]">Bookings</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-full hover:bg-gray-100 transition-all"
              >
                <MdFilterList className="text-2xl text-[#7A5C45]" />
              </button>
            </div>

            {/* Filters omitted for brevity */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 bg-white rounded-lg shadow-md space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Room
                    </label>
                    <Select
                      options={[{ value: 'all', label: 'All' }, ...roomOptions]}
                      value={[{ value: 'all', label: 'All' }, ...roomOptions].find(
                        (option) => option.value === filterRoom,
                      )}
                      onChange={(selectedOption) =>
                        setFilterRoom(selectedOption ? selectedOption.value : 'all')
                      }
                      placeholder="Select Room"
                      isClearable={false}
                      styles={customStyles}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter Mode
                    </label>
                    <div className="flex gap-3 flex-wrap">
                      {['all', 'today', 'upcoming'].map((mode) => (
                        <button
                          key={mode}
                          onClick={() => setFilterMode(mode)}
                          className={`px-3 py-1 rounded-lg border cursor-pointer ${filterMode === mode ? 'bg-[#7A5C45] text-white' : 'bg-white'
                            }`}
                        >
                          {mode.charAt(0).toUpperCase() + mode.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Date Range
                    </label>
                    <div className="flex justify-around items-center mb-2 gap-2">
                      <DatePicker
                        selected={fromDate}
                        onChange={setFromDate}
                        showTimeSelect
                        dateFormat="h:mm:dd-MMM-yyyy "
                        placeholderText="From Date"
                        className="border border-gray-300 p-2 rounded-lg w-full md:w-[60%]"
                      />
                      <DatePicker
                        selected={toDate}
                        onChange={setToDate}
                        showTimeSelect
                        dateFormat="h:mm:dd-MMM-yyyy "
                        placeholderText="To Date"
                        className="border border-gray-300 p-2 rounded-lg w-full md:w-[60%]"
                      />
                      <button
                        onClick={() => {
                          setFromDate(null);
                          setToDate(null);
                        }}
                        className="px-2 py-2 bg-[#7A5C45] text-white rounded-lg hover:bg-[#9c7353] transition-all cursor-pointer"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="max-h-[52vh] overflow-y-auto mb-4 scrollbar-hide">
              {filteredBookings.length > 0 ? (
                <ul className="space-y-2">
                  {filteredBookings.map((room) => (
                    <li key={room.room_id}>
                      <ul className="space-y-2 ml-4">
                        {room.bookings.map((slot) => {
                          const start = new Date(slot.start_time);
                          const end = new Date(slot.end_time);
                          return (
                            <li
                              key={slot.booking_id}
                              className="text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm"
                            >
                              <div className="inline-block bg-[#7A5C45] text-white text-xs px-2 py-1 rounded-full mb-2">
                                {room.room_name}
                              </div>
                              <div className="font-semibold">{slot.booked_by}</div>

                              <div className="text-gray-500 text-xs mt-1">
                                {start.toDateString() === end.toDateString() ? (
                                  <>
                                    {format(start, 'd-MMM-yyyy')}, {format(start, 'hh:mm aa')} to{' '}
                                    {format(end, 'hh:mm aa')}
                                  </>
                                ) : (
                                  <>
                                    {format(start, 'd-MMM-yyyy, hh:mm aa')} to{' '}
                                    {format(end, 'd-MMM-yyyy, hh:mm aa')}
                                  </>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm text-center mt-4">
                  No bookings found for the selected filters.
                </p>
              )}
            </div>

            {/* Pagination */}
            {filteredBookings.length > 0 && totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-lg border ${currentPage === 1 ? 'bg-[#7a6f6f] text-white' : 'bg-[#7a5c45] text-white'}`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-lg border ${currentPage === totalPages ? 'bg-[#7a6f6f] text-white' : 'bg-[#7a5c45] text-white'}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}