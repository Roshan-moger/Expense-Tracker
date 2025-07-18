import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

const Dashboard = ({ user, onLogout }) => {
  const sidebarRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
  };

  const unreadCount = useSelector((state) =>
    state.emails.data.filter((email) => !email.read).length
  );

  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    if (sidebarRef.current) {
      sidebarRef.current.classList.toggle('-translate-x-full');
    }
  };

  // Close sidebar when a link is clicked on mobile
  const handleLinkClick = () => {
    if (window.innerWidth < 640 && sidebarRef.current) {
      sidebarRef.current.classList.add('-translate-x-full');
    }
  };

  // Add event listener for toggle button
  useEffect(() => {
    const toggleButton = document.querySelector('[data-drawer-toggle="default-sidebar"]');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleSidebar);
    }

    // Cleanup event listener on component unmount
    return () => {
      if (toggleButton) {
        toggleButton.removeEventListener('click', toggleSidebar);
      }
    };
  }, []);

  return (
    <>
      {/* Sidebar Toggle Button for Mobile */}
      <button
        data-drawer-target="default-sidebar"
        data-drawer-toggle="default-sidebar"
        aria-controls="default-sidebar"
        type="button"
        className="inline-flex items-center p-2 m-2 ms-3 text-sm text-black bg-gray-100 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        id="default-sidebar"
        ref={sidebarRef}
        className="fixed top-0 left-0 z-40 w-64 h-screen  bg-[#8356D6] transition-transform -translate-x-full sm:translate-x-0"
        aria-label="Sidebar"
      >
        <div className="h-screen px-3 py-4 overflow-y-auto  flex flex-col">
          <ul className="space-y-2 mt-[25px] font-medium flex-grow">
            <li>
              <div className="flex justify-center p-2 text-gray-900 rounded-lg group text-center">
                <div className="flex items-center">
                  <div className="bg-[#ECECEC] text-gray-800 rounded-full w-20 h-20 flex items-center justify-center font-semibold text-5xl">
                    {user.email[0].toUpperCase()}
                  </div>
                </div>
              </div>
            </li>

            <li>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-100 hover:text-black'
                  }`
                }
                onClick={handleLinkClick}
              >
                <svg
                  className="w-5 h-5 transition duration-75 group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 22 21"
                >
                  <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                  <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                </svg>
                <span className="ms-3">Dashboard</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/inbox"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-100 hover:text-black'
                  }`
                }
                onClick={handleLinkClick}
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="m17.418 3.623-.018-.008a6.713 6.713 0 0 0-2.4-.569V2h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2H9.89A6.977 6.977 0 0 1 12 8v5h-2V8A5 5 0 1 0 0 8v6a1 1 0 0 0 1 1h8v4a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-4h6a1 1 0 0 0 1-1V8a5 5 0 0 0-2.582-4.377ZM6 12H4a1 1 0 1 1 0-2h2a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Inbox</span>
                <span className="inline-flex items-center justify-center w-3 h-3 p-3 ms-3 text-sm font-semibold text-black bg-blue-100 rounded-full group-hover:bg-blue-200">
                  {unreadCount}
                </span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/addExpense"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-100 hover:text-black'
                  }`
                }
                onClick={handleLinkClick}
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 18"
                >
  <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0ZM16.143 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0ZM6.143 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10ZM16.143 10h-4.286A1.857 1.857 0 0 0 10 11.857v4.286C10 17.169 10.831 18 11.857 18h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Add Expense</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/reports"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-100 hover:text-black'
                  }`
                }
                onClick={handleLinkClick}
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 18"
                >
                  <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Reports</span>
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/dashboard/transactions"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-100 hover:text-black'
                  }`
                }
                onClick={handleLinkClick}
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M3 10a1 1 0 0 1 1-1h12.586l-2.293-2.293a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414-1.414L16.586 11H4a1 1 0 0 1-1-1Z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">All Transactions</span>
              </NavLink>
            </li>
{/* 
            <li>
              <NavLink
                to="/dashboard/products"
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-lg group ${
                    isActive ? 'bg-white text-black' : 'text-white hover:bg-gray-100 hover:text-black'
                  }`
                }
                onClick={handleLinkClick}
              >
                <svg
                  className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-black"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 18 20"
                >
  <path d="M17 5.92A1 1 0 0 0 16 5h-3V4a4 4 0 1 0-8 0v1H2a1 1 0 0 0-1 .92L.08 17.85A2 2 0 0 0 2.08 20h13.84a2 2 0 0 0 1.99-2.15L17 5.92zM7 9a1 1 0 1 1-2 0V7h2v2z" />
                </svg>
                <span className="flex-1 ms-3 whitespace-nowrap">Budget</span>
              </NavLink>
            </li> */}
          </ul>

          <NavLink
            to="/"
            className={() =>
              `flex items-center p-5 group rounded-sm text-black bg-white hover:bg-gray-100 hover:text-black`
            }
            onClick={() => {
              handleLinkClick();
              handleLogout();
            }}
          >
            <svg
              className="shrink-0 w-5 h-5 transition duration-75 group-hover:text-black"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 18 16"
            >
           <path
  stroke="currentColor"
  strokeLinecap="round"
  strokeLinejoin="round"
  strokeWidth="2"
  d="M1 8h11m0 0L8 4m4 4-4 4M8 1h3a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"
/>

            </svg>
            <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="p-4 sm:ml-64 bg-[#ECECEC] min-h-screen">
        <Outlet />
      </div>
    </>
  );
};

export default Dashboard;