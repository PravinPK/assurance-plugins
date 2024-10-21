import React, { useState } from 'react';
import { View, Heading, TableView, TableHeader, TableBody, Row, Cell, ActionButton, Column, Flex, Divider, Switch } from '@adobe/react-spectrum';
import { EventDataViewer } from '@assurance/event-data-viewer';
import Close from '@spectrum-icons/workflow/Close';

const AppSettingPage = ({ device, handleBackClick }) => {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  // Ensure device and deviceInfo are defined
  if (!device || !device.deviceInfo) {
    return <View padding="size-200">No device information available.</View>;
  }

  // Define columns for device details
  const columns = [
    { name: 'Property', uid: 'property' },
    { name: 'Value', uid: 'value' },
  ];

  // Prepare rows from device.deviceInfo with a unique id
  const rows = Object.keys(device.deviceInfo).map((key, index) => ({
    id: index,
    property: key,
    value: device.deviceInfo[key].toString(),
  }));

  // Filter and convert the app settings data
  // Filter and convert the app settings data
const getFilteredAppSettings = () => {
    const appSettings = device.appSettings;
    const filteredData = [];
  
    // Minimum iOS Version
    if (appSettings.MinimumOSVersion) {
      filteredData.push({ id: 'minimumOSVersion', property: 'Minimum iOS Version', value: appSettings.MinimumOSVersion });
    }
  
    // Check if UIApplicationSceneManifest exists and is not empty
    const sceneManifest = appSettings.UIApplicationSceneManifest;
    const isSceneBased = !!sceneManifest; // This will be true if sceneManifest is present
    filteredData.push({ id: 'isSceneBasedApplication', property: 'Is Scene Based Application', value: isSceneBased.toString() });
  
    // If it's a scene-based application, check for scene delegate class
    if (sceneManifest) {
      const sceneConfig = sceneManifest.UISceneConfigurations?.UIWindowSceneSessionRoleApplication?.[0];
      if (sceneConfig && sceneConfig.UISceneDelegateClassName) {
        filteredData.push({ id: 'sceneDelegateClass', property: 'Scene Delegate Class', value: sceneConfig.UISceneDelegateClassName });
      }
    }
  
    // Bundle ID
    if (appSettings.CFBundleIdentifier) {
      filteredData.push({ id: 'bundleId', property: 'Bundle ID', value: appSettings.CFBundleIdentifier });
    }
  
    // App Name
    if (appSettings.CFBundleName) {
      filteredData.push({ id: 'appName', property: 'App Name', value: appSettings.CFBundleName });
    }
  
    // App Deeplink
    const urlTypes = appSettings.CFBundleURLTypes?.[0];
    if (urlTypes && urlTypes.CFBundleURLSchemes?.[0]) {
      filteredData.push({ id: 'appDeeplink', property: 'App Deeplink', value: `${urlTypes.CFBundleURLSchemes[0]}://` });
    }
  
    // Background Modes
    if (appSettings.UIBackgroundModes) {
      filteredData.push({
        id: 'backgroundMode',
        property: 'Background Mode',
        value: appSettings.UIBackgroundModes.map(mode => mode.charAt(0).toUpperCase() + mode.slice(1)).join(' | '),
      });
    }
  
    return filteredData;
  };
  

  const filteredAppSettings = getFilteredAppSettings();

  const prepareAppSettingsData = () => {
    return [
      {
        eventId: "someID",
        values: device.appSettings,
      }
    ];
  };

  return (
    <View padding="size-200">
      
      <Flex direction="row" justifyContent="space-between" alignItems="center">
        <Heading level={3}>App Settings</Heading>
        <ActionButton onPress={handleBackClick}>
          <Close />
        </ActionButton>
      </Flex>

      <Flex direction="row" gap="size-200" marginTop="size-200">
        <View flex={1}>

          {/* Display filtered App Settings */}
          <TableView aria-label="Filtered App Settings" width="100%">
            <TableHeader columns={columns}>
              {(column) => (
                <Column key={column.uid}>
                  {column.name}
                </Column>
              )}
            </TableHeader>
            <TableBody items={filteredAppSettings}>
              {(item) => (
                <Row key={item.id}>
                  <Cell>{item.property}</Cell>
                  <Cell>{item.value}</Cell>
                </Row>
              )}
            </TableBody>
          </TableView>

          {/* Toggle to show/hide advanced settings */}
          <Switch
            isSelected={showAdvancedSettings}
            onChange={setShowAdvancedSettings}
            marginTop="size-200"
          >
            Show Advanced Settings
          </Switch>

          {/* Conditionally render EventDataViewer based on toggle */}
          {showAdvancedSettings && (
            <View marginTop="size-200">
              <EventDataViewer data={prepareAppSettingsData()} />
            </View>
          )}
        </View>
      </Flex>
    </View>
  );
};

export default AppSettingPage;