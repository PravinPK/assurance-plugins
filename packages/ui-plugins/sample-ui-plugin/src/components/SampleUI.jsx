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

import React from "react";
import { PluginView, TimelineToolbar } from '@assurance/timeline-bar';
import { Item, Tabs, TabList, TabPanels } from "@adobe/react-spectrum";
import ProviderTable from "./ProviderTable";
import HomePage from "./HomePage";
import ComparerPage from "./Comparer";
import CompareDevice from "./CompareDevice";


const SampleUI = () => (
  <PluginView>
    <Tabs aria-label="Sample UI Tabs" height="100%">
      <TabList>
        <Item key="appsessions">App Sessions</Item>
        <Item key="comparer">Compare Sessions</Item>
        <Item key="compdevice">Compare Device</Item>
      </TabList>
      <TabPanels>
       <Item key="appsessions">
          <HomePage />
        </Item>
        <Item key="comparer">
          <ComparerPage />
      </Item>
      <Item key="compdevice">
          <CompareDevice />
      </Item>
      </TabPanels>
    </Tabs>
    <TimelineToolbar />
  </PluginView>
);

export default SampleUI;


