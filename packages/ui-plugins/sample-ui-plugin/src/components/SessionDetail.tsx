import React, { useState } from 'react';
import { View, Heading, Divider, Button, TableView, TableHeader, TableBody, Column, Row, Cell, Flex, Text, ActionButton } from '@adobe/react-spectrum';
import Close from '@spectrum-icons/workflow/Close';

const SessionDetail = ({ selectedSession, handleBackClick }) => {
  
  const [selectedEvent, setSelectedEvent] = useState(null); // State to track the selected event
  const [tableWidth, setTableWidth] = useState('70%'); // State to control the table width

  // Count IAM, Content Card, and Code Based downloads
  const countIAMs = Object.values(selectedSession.experiencesMap).reduce((acc, experience) => {
    if (experience.schema === 'https://ns.adobe.com/personalization/message/in-app') {
      return acc + experience.ids.size; // Counting unique IAMs
    }
    return acc;
  }, 0);

  const countContentCards = Object.values(selectedSession.experiencesMap).reduce((acc, experience) => {
    if (experience.schema === 'https://ns.adobe.com/personalization/message/content-card') {
      return acc + experience.ids.size; // Counting unique Content Cards
    }
    return acc;
  }, 0);

  const countCodeBased = Object.values(selectedSession.experiencesMap).reduce((acc, experience) => {
    if (experience.schema === 'https://ns.adobe.com/personalization/json-content-item' || experience.schema === 'https://ns.adobe.com/personalization/html-content-item') {
      return acc + experience.ids.size; // Counting unique Code Based experiences
    }
    return acc;
  }, 0);

  // Handle row click to select an event
  const handleRowClick = (event) => {
    setSelectedEvent(event);
    setTableWidth('50%'); // Shrink the table when an event is selected
  };

  // Handle dismissal of the side pane
  const handleDismiss = () => {
    setSelectedEvent(null);
    setTableWidth('70%'); // Reset the table width when side pane is closed
  };

  return (
    <Flex direction="row" gap="size-200" width="100%" height="100vh">
      {/* Main Table View */}
      <View flex UNSAFE_style={{ width: tableWidth, overflowY: 'auto', height: '100vh' }}>

        <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Heading level={2}>Session Details</Heading>
        <ActionButton onPress={handleBackClick}>
          <Close />
        </ActionButton>
      </Flex>
        
      <Flex direction="row" justifyContent="space-between" gap="size-200" marginTop="size-200" width="100%">
  {/* Analytics, Edge Requests, IAMs, Content Cards, and Code Based */}
  <Flex direction="column" flex="1" alignItems="center">
    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 'bold', color: 'gray' }}>
      {selectedSession.analyticsRequest || 0}
    </Text>
    <Text>ANALYTIC HITS</Text>
  </Flex>

  <Divider orientation="vertical" size="S" />

  <Flex direction="column" flex="1" alignItems="center">
    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 'bold', color: 'gray' }}>
      {selectedSession.edgeRequest || 0}
    </Text>
    <Text>EDGE REQUESTS</Text>
  </Flex>

  <Divider orientation="vertical" size="S" />

  <Flex direction="column" flex="1" alignItems="center">
    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 'bold', color: 'gray' }}>
      {countIAMs}
    </Text>
    <Text>IN-APP MESSAGES</Text>
  </Flex>

  <Divider orientation="vertical" size="S" />

  <Flex direction="column" flex="1" alignItems="center">
    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 'bold', color: 'gray' }}>
      {countContentCards}
    </Text>
    <Text>CONTENT CARD</Text>
  </Flex>

  <Divider orientation="vertical" size="S" />

  <Flex direction="column" flex="1" alignItems="center">
    <Text UNSAFE_style={{ fontSize: '28px', fontWeight: 'bold', color: 'gray' }}>
      {countCodeBased}
    </Text>
    <Text>CODE BASED</Text>
  </Flex>
</Flex>

        <Heading level={3} marginTop="size-400">Events</Heading>
        <Divider size="S" marginY="size-200" />
        
        {/* Event Table */}
        <TableView aria-label="Session Events" width="100%" onAction={(key) => handleRowClick(selectedSession.events[key])}>
          <TableHeader>
            <Column key="timestamp" allowsResizing minWidth={200}>Timestamp</Column>
            <Column key="eventName" allowsResizing minWidth={200}>Event Name</Column>
            <Column key="vendor" allowsResizing minWidth={200}>Vendor</Column>
            <Column key="eventNumber" allowsResizing minWidth={200}>Event Number</Column>
          </TableHeader>
          <TableBody>
            {selectedSession.events.map((event, idx) => (
              <Row key={idx} id={idx}>
                <Cell>{formatTimestamp(new Date(event.timestamp))}</Cell>
                <Cell>{event.payload.ACPExtensionEventName || 'Connection Event'}</Cell>
                <Cell>{event.vendor}</Cell>
                <Cell>{event.eventNumber}</Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
      </View>

      {/* Draggable Divider */}
      <View width="size-50" backgroundColor="gray-200" />

      {/* Side Pane for JSON Details */}
      {selectedEvent && (
        <View backgroundColor="gray-100" padding="size-200" UNSAFE_style={{ width: `calc(100% - ${tableWidth})`, height: '100vh', overflowY: 'auto' }}>
          <Button variant="secondary" onPress={handleDismiss} marginBottom="size-200">Dismiss</Button>
          <Heading level={4}>Event Details (JSON)</Heading>
          <Text UNSAFE_style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '14px', overflowX: 'auto', maxHeight: 'calc(100vh - 200px)' }}>
            {JSON.stringify(selectedEvent, null, 2)}
          </Text>
        </View>
      )}
    </Flex>
  );
};

export default SessionDetail;

function formatTimestamp(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const milliseconds = date.getMilliseconds().toString().padStart(3, '0');

  return (
    <>
      {`${month} ${day} ${hours}:${minutes}:${seconds}`}
      <span style={{ fontSize: '0.8em', color: '#888', marginLeft: '2px' }}>
        .{milliseconds}
      </span>
    </>
  );
}
