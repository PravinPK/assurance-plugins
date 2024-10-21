import React, { useState } from 'react';
import { ProgressCircle, View, Flex } from "@adobe/react-spectrum";
import { useFilteredEvents } from '@assurance/plugin-bridge-provider';
import { prepareEvents } from './PrepareEvents';
import DeviceCard from './DeviceCard';
import SessionDetail from './SessionDetail';
import DeviceInfoPage from './DeviceInfoPage';
import AppSettingsPage from './AppSettingsPage';

const HomePage = () => {
  const events = useFilteredEvents({
    matchers: ['payload.appSessionID!=null']
  });

  const [selectedSession, setSelectedSession] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [currentView, setCurrentView] = useState('list'); // Possible values: 'list', 'session', 'deviceInfo', 'appSettings'

  if (!events) {
    return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  }

  if (events.length === 0) {
    return <div>No events yet</div>;
  }

  const prepared = prepareEvents(events);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setCurrentView('session');
  };

  const handleDeviceInfoClick = (device) => {
    setSelectedDevice(device);
    setCurrentView('deviceInfo');
  };

  const handleAppSettingClick = (device) => {
    setSelectedDevice(device);
    setCurrentView('appSettings');
  };

  const handleBackClick = () => {
    setCurrentView('list');
    setSelectedSession(null);
    setSelectedDevice(null);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'session':
        return <SessionDetail selectedSession={selectedSession} handleBackClick={handleBackClick} />;
      case 'deviceInfo':
        return <DeviceInfoPage device={selectedDevice} handleBackClick={handleBackClick} />;
      case 'appSettings':
        return <AppSettingsPage device={selectedDevice} handleBackClick={handleBackClick} />;
      default:
        return (
          <View>
            <Flex direction="column" gap="size-200">
              {prepared.map((device, index) => (
                <DeviceCard 
                  key={index} 
                  device={device} 
                  handleSessionClick={handleSessionClick} 
                  handleDeviceInfoClick={handleDeviceInfoClick}
                  handleAppSettingClick={handleAppSettingClick}
                />
              ))}
            </Flex>
          </View>
        );
    }
  };

  return <View>{renderContent()}</View>;
};

export default HomePage;