import React, { useState } from 'react';
import { View, Heading, TableView, TableHeader, TableBody, Row, Cell, ActionButton, Column, Flex, Divider } from '@adobe/react-spectrum';
import { EventDataViewer } from '@assurance/event-data-viewer';
import Close from '@spectrum-icons/workflow/Close';

const DeviceInfoView = ({ device, handleBackClick }) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Ensure device and deviceInfo are defined
  if (!device || !device.deviceInfo) {
    return <View padding="size-200">No device information available.</View>;
  }

  // Define columns for both tables
  const columns = [
    { name: 'Property', uid: 'property' },
    { name: 'Value', uid: 'value' },
  ];

  // Prepare rows for the identities section (pushToken and ECID)
  const identitiesRows = [
    { id: 'pushToken', property: 'Push Token', value: device.pushToken || 'N/A' },
    { id: 'ecid', property: 'ECID', value: device.ecid || 'N/A' },
  ];

  // Prepare rows for the device information section
  const deviceInfoRows = Object.keys(device.deviceInfo).map((key, index) => ({
    id: index,
    property: key,
    value: device.deviceInfo[key].toString(),
  }));

  return (
    <View padding="size-100">
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Heading level={2}>{device.deviceInfo["Device name"]} Details</Heading>
        <ActionButton onPress={handleBackClick}>
          <Close />
        </ActionButton>
      </Flex>

      <Flex direction="column" gap="size-400" marginTop="size-200">
        <View>
          <Heading level={3}>ID's</Heading>
          <TableView aria-label="Identities Table" width="100%">
            <TableHeader columns={columns}>
              {(column) => (
                <Column key={column.uid}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={identitiesRows}>
              {(item) => (
                <Row key={item.id}>
                  <Cell>{item.property}</Cell>
                  <Cell>{item.value}</Cell>
                </Row>
              )}
            </TableBody>
          </TableView>
        </View>

        <Divider size="S" />

        <View>
          <Heading level={3}>Device Information</Heading>
          <TableView aria-label="Device Info Table" width="100%">
            <TableHeader columns={columns}>
              {(column) => (
                <Column key={column.uid}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={deviceInfoRows}>
              {(item) => (
                <Row key={item.id}>
                  <Cell>{item.property}</Cell>
                  <Cell>{item.value}</Cell>
                </Row>
              )}
            </TableBody>
          </TableView>
        </View>
      </Flex>
    </View>
  );
};

export default DeviceInfoView;
