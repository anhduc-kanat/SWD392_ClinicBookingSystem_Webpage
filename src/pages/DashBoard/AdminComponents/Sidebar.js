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

    if (path.includes('/clinicowner/dentist')) {
      setActivePanel('1');
    } else if (path.includes('/clinicowner/staff')) {
      setActivePanel('2');
    } else if (path.includes('/clinicowner/service')) {
      setActivePanel('3');
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
        <Panel header="Quản lí Bác sĩ" style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'sans-serif' }} key="1">
          <ul>
            <li>
              <NavLink to="/clinicowner/dentist" className={selectedKey === '/clinicowner/dentist' ? 'active-link' : ''}>
                Quản lí Bác sĩ
              </NavLink>
            </li>
          </ul>
        </Panel>
        <Panel header="Quản lí Nhân viên" style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'sans-serif' }} key="2">
          <ul>
            <li>
              <NavLink to="/clinicowner/staff" className={selectedKey === '/clinicowner/staff' ? 'active-link' : ''}>
                Quản lí Nhân viên
              </NavLink>
            </li>
          </ul>
        </Panel>
        <Panel header="Quản lí Dịch vụ" style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'sans-serif' }} key="3">
          <ul>
            <li>
              <NavLink to="/clinicowner/service" className={selectedKey === '/clinicowner/service' ? 'active-link' : ''}>
                Quản lí Dịch vụ
              </NavLink>
            </li>
          </ul>
        </Panel>
        <Panel header="Quản lí Ca Làm" style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'sans-serif' }} key="4">
          <ul>
            <li>
              <NavLink to="/clinicowner/slot" className={selectedKey === '/clinicowner/slot' ? 'active-link' : ''}>
                Quản lí Ca làm
              </NavLink>
            </li>
          </ul>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Sidebar;
