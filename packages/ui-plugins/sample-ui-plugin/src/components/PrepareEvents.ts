export const prepareEvents = (events: Event[]): any[] => {
  const deviceMap: { [key: string]: any } = {};

  events.forEach((event) => {
    const clientId = event.clientId;
    const sessionID = event.payload?.appSessionID;

    if (!clientId || !sessionID) return;

    // Initialize the device map
    if (!deviceMap[clientId]) {
      deviceMap[clientId] = { clientId, sessions: {}, deviceInfo: null, appSettings: null, pushToken: null, ecid: null };
    }

    // Initialize the session map
    if (!deviceMap[clientId].sessions[sessionID]) {
      deviceMap[clientId].sessions[sessionID] = {
        sessionID,
        sessionName: `Session ${Object.keys(deviceMap[clientId].sessions).length + 1}`,
        events: [],
        experiencesMap: {},
        launches: 0,
        analyticsRequest: 0,
        edgeRequest: 0,
      };
    }

    // Add event to session
    deviceMap[clientId].sessions[sessionID].events.push({
      uuid: event.uuid,
      timestamp: event.timestamp,
      vendor: event.vendor,
      payload: event.payload,
      eventNumber: event.eventNumber
    });

    // Check if the event is a personalization decision event
    const acpEventData = event.payload?.ACPExtensionEventData;
    if (acpEventData?.type === "personalization:decisions" && acpEventData?.payload) {
      acpEventData.payload.forEach((experience: any) => {
        const scope = experience.scope;
        const items = experience.items || [];
        let schema = experience.items[0]?.schema || '';

        // If schema is 'ruleset-item', check for actual schema inside items
        if (schema === 'https://ns.adobe.com/personalization/ruleset-item') {
          schema = items[0]?.data?.rules[0]?.consequences[0]?.detail?.schema || '';
        }

        // Check if the schema is either Content Card or IAM
        const isContentCard = schema === 'https://ns.adobe.com/personalization/message/content-card';
        const isIAM = schema === 'https://ns.adobe.com/personalization/message/in-app';

        if (!deviceMap[clientId].sessions[sessionID].experiencesMap[scope]) {
          deviceMap[clientId].sessions[sessionID].experiencesMap[scope] = {
            ids: new Set(),
            schema: schema,
            isContentCard: isContentCard,
            isIAM: isIAM,
          };
        }

        // Add unique experience IDs to the set for each scope
        items.forEach((item: any) => {
          deviceMap[clientId].sessions[sessionID].experiencesMap[scope].ids.add(item.id);
        });
      });
    }

    // Check for application launch events
    if (acpEventData?.xdm?.eventType === "application.launch") {
      deviceMap[clientId].sessions[sessionID].launches += 1;
    }

    if (event.payload?.ACPExtensionEventSource === "com.adobe.eventsource.requestcontent" &&
       event.payload?.ACPExtensionEventType === "com.adobe.eventtype.generic.track") {
      deviceMap[clientId].sessions[sessionID].analyticsRequest += 1;
    }

    if (event.payload?.ACPExtensionEventSource === "com.adobe.eventsource.requestcontent" &&
      event.payload?.ACPExtensionEventType === "com.adobe.eventtype.edge") {
     deviceMap[clientId].sessions[sessionID].edgeRequest += 1;
   }

    // Check for client type events to extract device info
    if (event.type === "client" && event.payload?.type === "connect" && event.payload.deviceInfo) {
      deviceMap[clientId].deviceInfo = event.payload.deviceInfo;
      deviceMap[clientId].appSettings = event.payload.appSettings;
    }

    // Check for push token in shared state change events
    if (
      event.payload?.ACPExtensionEventType === "com.adobe.eventtype.hub" &&
      event.payload?.ACPExtensionEventSource === "com.adobe.eventsource.sharedstate" &&
      event.payload?.ACPExtensionEventData?.stateowner === "com.adobe.messaging" &&
      event.payload?.metadata?.["state.data"]?.pushidentifier
    ) {
      deviceMap[clientId].pushToken = event.payload.metadata["state.data"].pushidentifier;
    }

    // Check for ECID in shared state change events
    if (
      event.payload?.ACPExtensionEventType === "com.adobe.eventtype.hub" &&
      event.payload?.ACPExtensionEventSource === "com.adobe.eventsource.sharedstate" &&
      event.payload?.ACPExtensionEventData?.stateowner === "com.adobe.edge.identity" &&
      event.payload?.metadata?.["xdm.state.data"]?.identityMap?.ECID?.[0]?.id
    ) {
      deviceMap[clientId].ecid = event.payload.metadata["xdm.state.data"].identityMap.ECID[0].id;
    }

  });

  // Prepare the final structure
  return Object.values(deviceMap).map(device => ({
    clientId: device.clientId,
    deviceInfo: device.deviceInfo,
    appSettings: device.appSettings,
    pushToken: device.pushToken,
    ecid: device.ecid,
    sessions: Object.values(device.sessions),
  }));
};
