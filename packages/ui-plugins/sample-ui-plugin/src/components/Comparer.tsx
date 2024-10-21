import React, { useState } from 'react';
import { ProgressCircle, View, Heading, TableView, TableHeader, TableBody, Row, Cell, Picker, Item, Flex, Divider, Column, Text, Button } from "@adobe/react-spectrum";
import { useFilteredEvents } from '@assurance/plugin-bridge-provider';
import { prepareEvents } from './PrepareEvents';

const ComparerPage = () => {
  const events = useFilteredEvents({ matchers: ['payload.appSessionID!=null'] });
  const [leftDevice, setLeftDevice] = useState(null);
  const [rightDevice, setRightDevice] = useState(null);
  const [leftSession, setLeftSession] = useState(null);
  const [rightSession, setRightSession] = useState(null);

  if (!events) return <ProgressCircle aria-label="Loading…" isIndeterminate />;
  if (events.length === 0) return <div>No events yet</div>;

  const prepared = prepareEvents(events);

  const findSession = (deviceId, sessionId) => {
    const device = prepared.find(device => device.clientId === deviceId);
    return device?.sessions.find(session => session.sessionID === sessionId) || null;
  };

  const countMetrics = (session) => {
    const countIAMs = Object.values(session.experiencesMap).reduce((acc, experience) => {
      if (experience.schema === 'https://ns.adobe.com/personalization/message/in-app') {
        return acc + experience.ids.size;
      }
      return acc;
    }, 0);

    const countContentCards = Object.values(session.experiencesMap).reduce((acc, experience) => {
      if (experience.schema === 'https://ns.adobe.com/personalization/message/content-card') {
        return acc + experience.ids.size;
      }
      return acc;
    }, 0);

    const countCodeBased = Object.values(session.experiencesMap).reduce((acc, experience) => {
      if (experience.schema === 'https://ns.adobe.com/personalization/json-content-item' || experience.schema === 'https://ns.adobe.com/personalization/html-content-item') {
        return acc + experience.ids.size;
      }
      return acc;
    }, 0);

    return { countIAMs, countContentCards, countCodeBased };
  };

  const renderMetrics = (session) => {
    const { countIAMs, countContentCards, countCodeBased } = countMetrics(session);
    return (
      <Flex direction="row" justifyContent="space-between" alignItems="center" gap="size-200" marginTop="size-200" width="100%">
        <Flex direction="column" flex="1" alignItems="center">
          <Text UNSAFE_style={{ fontSize: '25px', fontWeight: 'bold', color: 'gray' }}>
            {session.analyticsRequest || 0}
          </Text>
          <Text>ANALYTIC HITS</Text>
        </Flex>
        <Divider orientation="vertical" size="S" />
        <Flex direction="column" flex="1" alignItems="center">
          <Text UNSAFE_style={{ fontSize: '25px', fontWeight: 'bold', color: 'gray' }}>
            {session.edgeRequest || 0}
          </Text>
          <Text>EDGE REQUESTS</Text>
        </Flex>
        <Divider orientation="vertical" size="S" />
        <Flex direction="column" flex="1" alignItems="center">
          <Text UNSAFE_style={{ fontSize: '25px', fontWeight: 'bold', color: 'gray' }}>
            {countIAMs}
          </Text>
          <Text>IN-APP MESSAGES</Text>
        </Flex>
        <Divider orientation="vertical" size="S" />
        <Flex direction="column" flex="1" alignItems="center">
          <Text UNSAFE_style={{ fontSize: '25px', fontWeight: 'bold', color: 'gray' }}>
            {countContentCards}
          </Text>
          <Text>CONTENT CARDS</Text>
        </Flex>
        <Divider orientation="vertical" size="S" />
        <Flex direction="column" flex="1" alignItems="center">
          <Text UNSAFE_style={{ fontSize: '25px', fontWeight: 'bold', color: 'gray' }}>
            {countCodeBased}
          </Text>
          <Text>CODE BASED</Text>
        </Flex>
      </Flex>
    );
  };

  const renderPicker = (label, device, setDevice, session, setSession) => (
    <View flex>
      <Picker
        label={`Select ${label} Device`}
        selectedKey={device}
        onSelectionChange={device => { setDevice(device); setSession(null); }}
        items={prepared}
      >
        {item => <Item key={item.clientId}>{item.deviceInfo["Device name"] || item.clientId}</Item>}
      </Picker>
      {device && (
        <Picker
          label="Select Session"
          selectedKey={session}
          onSelectionChange={setSession}
          items={prepared.find(item => item.clientId === device)?.sessions || []}
        >
          {item => <Item key={item.sessionID}>{item.sessionName}</Item>}
        </Picker>
      )}
    </View>
  );

  const renderSessionTable = (sessionData, ariaLabel) => (
    <View flex>
      <Heading level={3}>Session Events</Heading>
      {renderMetrics(sessionData)} {/* Display the metrics */}
      <Divider size="S" marginY="size-200" />
      <TableView aria-label={ariaLabel} width="100%">
        <TableHeader>
          <Column key="timestamp" allowsResizing>Timestamp</Column>
          <Column key="eventName" allowsResizing>Event Name</Column>
          <Column key="eventNumber" allowsResizing>Event Number</Column>
        </TableHeader>
        <TableBody>
          {sessionData.events.map((event, idx) => (
            <Row key={idx} id={idx}>
              <Cell>{formatTimestamp(new Date(event.timestamp))}</Cell>
              <Cell>{event.payload.ACPExtensionEventName || 'Connection Event'}</Cell>
              <Cell>{event.eventNumber || '-'}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </View>
  );

  return (
    <View padding="size-200">
      <Heading level={2}>Compare Sessions</Heading>
      
      {/* Device Pickers */}
      <Flex direction="row" gap="size-200" marginTop="size-200">
        <View flex={1}>
          {renderPicker('Left', leftDevice, setLeftDevice, leftSession, setLeftSession)}
        </View>
        <View flex={1}>
          {renderPicker('Right', rightDevice, setRightDevice, rightSession, setRightSession)}
        </View>
        {leftSession && rightSession && (
        <Flex justifyContent="flex-start" marginTop="size-400">
          <Button variant="accent" onPress={() => alert('AI assistance coming soon!')}>
            Analyze with AI
          </Button>
        </Flex>
      )}
      </Flex>

      {/* Ask AI Button */}


      <Flex direction="row" gap="size-200" marginTop="size-400">
        {/* Left Session Table */}
        {leftSession ? (
          <View flex={1}>
            {renderSessionTable(findSession(leftDevice, leftSession), "Left Session Events")}
          </View>
        ) : (
          <View flex={1} />
        )}

        {/* Divider */}
        {leftSession && rightSession && (
          <Divider orientation="vertical" size="S" />
        )}

        {/* Right Session Table */}
        {rightSession ? (
          <View flex={1}>
            {renderSessionTable(findSession(rightDevice, rightSession), "Right Session Events")}
          </View>
        ) : (
          <View flex={1} />
        )}
      </Flex>
    </View>
  );
};

export default ComparerPage;

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
