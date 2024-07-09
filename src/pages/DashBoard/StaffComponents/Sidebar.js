// Sidebar.js
import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';
import { NavLink, useLocation } from 'react-router-dom';
import './Sidebar.css';

const { Panel } = Collapse;

const Sidebar = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(null);
  const [activePanel, setActivePanel] = useState('1');

  // Determine the active panel based on the current route
  useEffect(() => {
    const path = location.pathname;
    setSelectedKey(path);

    if (path.includes('/staff/booking') || path.includes('/staff/user-info')|| path.includes('/staff/payment')) {
      setActivePanel('1');
    // } else if (path.includes('/staff/user-profile') ) {
    //   setActivePanel('2');
    }
  }, [location]);

  return (
    <div className="sidebar">
      <Collapse
        accordion
        bordered={false}
        className="ant-collapse-borderless"
        activeKey={activePanel}
        onChange={(key) => setActivePanel(key)}
      >
        <Panel header="DỊCH VỤ" style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'sans-serif' }} key="1">
          <ul>
            <li>
              <NavLink to="/staff/booking" className={selectedKey === '/staff/booking' ? 'active-link' : ''}>
                Booking
              </NavLink>
            </li>
            <li>
              <NavLink to="/staff/user-info" className={selectedKey === '/staff/user-info' ? 'active-link' : ''}>
                Thông tin người dùng
              </NavLink>
            </li>
            <li>
              <NavLink to="/staff/check-in" className={selectedKey === '/staff/check-in' ? 'active-link' : ''}>
                Check-in
              </NavLink>
            </li>
            <li>
              <NavLink to="/staff/payment" className={selectedKey === '/staff/payment' ? 'active-link' : ''}>
                Thanh toán
              </NavLink>
            </li>
          </ul>
        </Panel>
        {/* <Panel header="HỒ SƠ KHÁM BỆNH" style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'sans-serif' }} key="2">
          <ul>
            <li>
              <NavLink to="/customer/user-profile" className={selectedKey === '/customer/user-profile' ? 'active-link' : ''}>
                Hồ sơ người dùng
              </NavLink>
            </li>
            <li>
              <NavLink to="/customer/results" className={selectedKey === '/customer/results' ? 'active-link' : ''}>
                Kết quả
              </NavLink>
            </li>
          </ul>
        </Panel> */}
      </Collapse>
    </div>
  );
};

export default Sidebar;
