import React from 'react';
import { Flex, View, Divider, Text, ActionButton } from '@adobe/react-spectrum';
import DevicePhone from '@spectrum-icons/workflow/DevicePhone';
import SessionCard from './SessionCard';

const DeviceCard = ({ device, handleSessionClick, handleDeviceInfoClick, handleAppSettingClick }) => {
  return (
    <View padding="size-200" borderRadius="medium">
      <Flex direction="row" alignItems="center" justifyContent="space-between" gap="size-100">
        <Flex alignItems="center" gap="size-100">
          <DevicePhone aria-label="DevicePhone" size="M" />
          <Text UNSAFE_style={{ fontSize: '20px', fontWeight: 'semibold' }}>
            {device.deviceInfo["Device name"]}
          </Text>
        </Flex>
        <Flex direction="row" gap="size-100">
        <ActionButton onPress={() => handleAppSettingClick(device)}>App Settings</ActionButton> 
        <ActionButton onPress={() => handleDeviceInfoClick(device)}>Device Info</ActionButton> 
        </Flex>
      </Flex>
      <Divider marginY="size-200" size="S" />
      <Flex direction="row" gap="size-200" wrap>
        {device.sessions.map((session, idx) => (
          <SessionCard
            key={idx}
            session={session}
            onViewEvents={() => handleSessionClick(session)}
          />
        ))}
      </Flex>
    </View>
  );
};

export default DeviceCard;
