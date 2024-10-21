import React, { useState } from 'react';
import { ProgressCircle, View, Heading, TableView, TableHeader, TableBody, Row, Cell, Picker, Item, Flex, Divider, Column, Text } from "@adobe/react-spectrum";
import { useFilteredEvents } from '@assurance/plugin-bridge-provider';
import { prepareEvents } from './PrepareEvents';

const CompareDevice = () => {
  const events = useFilteredEvents({ matchers: ['payload.appSessionID!=null'] });
  const [leftDevice, setLeftDevice] = useState(null);
  const [rightDevice, setRightDevice] = useState(null);

  if (!events) return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  if (events.length === 0) return <div>No events yet</div>;

  // Prepare the device map using the prepareEvents function
  const preparedDevices = prepareEvents(events);

  // Function to render the device picker
  const renderPicker = (label, selectedDevice, setDevice) => (
    <View flex>
      <Picker
        label={`Select ${label} Device`}
        selectedKey={selectedDevice}
        onSelectionChange={setDevice}
        items={preparedDevices}
      >
        {item => <Item key={item.clientId}>{item.deviceInfo["Device name"] || item.clientId}</Item>}
      </Picker>
    </View>
  );

  // Function to render the device information table with highlighted differences
  const renderDeviceInfoTable = (device, otherDevice, ariaLabel) => {
    if (!device) return <View flex={1} padding="size-200">No device selected.</View>;

    const columns = [
      { name: 'Property', uid: 'property' },
      { name: 'Value', uid: 'value' },
    ];

    // Prepare and sort rows alphabetically by property name
    const rows = Object.keys(device.deviceInfo)
      .sort() // Sort properties alphabetically
      .map((key, index) => ({
        id: index,
        property: key,
        value: device.deviceInfo[key].toString(),
        isDifferent: otherDevice ? device.deviceInfo[key] !== otherDevice.deviceInfo[key] : false,
      }));

    return (
      <View flex={1}>
        <Heading level={3}>{device.deviceInfo["Device name"]} Details</Heading>
        <Divider size="S" marginY="size-200" />
        <TableView aria-label={ariaLabel} width="100%">
          <TableHeader columns={columns}>
            {(column) => (
              <Column key={column.uid}>
                {column.name}
              </Column>
            )}
          </TableHeader>
          <TableBody items={rows}>
            {(item) => (
              <Row key={item.id}>
                <Cell>{item.property}</Cell>
                <Cell>
                  {item.isDifferent ? (
                    <Text>
                     🟥 <em>{item.value}</em> 🟥
                    </Text>
                  ) : (
                    <Text>{item.value}</Text>
                  )}
                </Cell>
              </Row>
            )}
          </TableBody>
        </TableView>
      </View>
    );
  };

  return (
    <View padding="size-200">
      <Heading level={2}>Compare Devices</Heading>
      
      {/* Device Pickers */}
      <Flex direction="row" gap="size-200" marginTop="size-200">
        <View flex={1}>
          {renderPicker('Left', leftDevice, setLeftDevice)}
        </View>
        <View flex={1}>
          {renderPicker('Right', rightDevice, setRightDevice)}
        </View>
      </Flex>

      <Flex direction="row" gap="size-200" marginTop="size-400">
        {/* Left Device Table */}
        {leftDevice ? (
          <View flex={1}>
            {renderDeviceInfoTable(
              preparedDevices.find(device => device.clientId === leftDevice), 
              preparedDevices.find(device => device.clientId === rightDevice),
              "Left Device Info"
            )}
          </View>
        ) : (
          <View flex={1} padding="size-200">Select a device to view details.</View>
        )}

        {/* Divider */}
        {leftDevice && rightDevice && (
          <Divider orientation="vertical" size="S" />
        )}

        {/* Right Device Table */}
        {rightDevice ? (
          <View flex={1}>
            {renderDeviceInfoTable(
              preparedDevices.find(device => device.clientId === rightDevice), 
              preparedDevices.find(device => device.clientId === leftDevice),
              "Right Device Info"
            )}
          </View>
        ) : (
          <View flex={1} padding="size-200">Select a device to view details.</View>
        )}
      </Flex>
    </View>
  );
};

export default CompareDevice;
