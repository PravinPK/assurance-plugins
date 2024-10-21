/*************************************************************************
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2023 Adobe
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe and its suppliers, if any. The intellectual
 * and technical concepts contained herein are proprietary to Adobe
 * and its suppliers and are protected by all applicable intellectual
 * property laws, including trade secret and copyright laws.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe.
 **************************************************************************/

import React from 'react';
import { 
  useEnvironment,
  useFlags,
  useImsAccessToken,
  useImsOrg,
  useNavigationPath,
  useFilteredEvents,
  useTenant,
  useValidation,
} from '@assurance/plugin-bridge-provider';
import { EventDataViewer } from '@assurance/event-data-viewer';

const ProviderTable = () => {
  const env = useEnvironment();
  const flags = useFlags();
  const imsAccsessToken = useImsAccessToken();
  const imsOrg = useImsOrg();
  const tenant = useTenant();
  const navigation = useNavigationPath();
  const events = useFilteredEvents();
  const validation = useValidation();

  return (
    <Inner/>
  )
};

export default ProviderTable;


const prepareEvents = (events: Event[]): EventData[] => {
  const results = (events || []).map(
    (event) => {
      return {
        eventId: event.uuid,
        values: event.payload
      }
    }
  )
  return results;
};

const Inner = () => {
  const events = useFilteredEvents({
    matchers: ['payload.appSessionID!=null']
  });
  return <EventDataViewer data={prepareEvents(events)} />;
};
