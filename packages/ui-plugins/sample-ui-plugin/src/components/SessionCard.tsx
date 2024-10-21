import React from 'react';
import { View, Heading, Text, Button, Divider, Flex } from '@adobe/react-spectrum';

const SessionCard = ({ session, onViewEvents }) => {
  // Count IAM and Content Card downloads
  const countIAMs = Object.values(session.experiencesMap).reduce((acc, experience) => {
    if (experience.schema === 'https://ns.adobe.com/personalization/message/in-app') {
      return acc + experience.ids.size; // Counting unique IAMs
    }
    return acc;
  }, 0);

  const countContentCards = Object.values(session.experiencesMap).reduce((acc, experience) => {
    if (experience.schema === 'https://ns.adobe.com/personalization/message/content-card') {
      return acc + experience.ids.size; // Counting unique Content Cards
    }
    return acc;
  }, 0);

  const countCodeBased = Object.values(session.experiencesMap).reduce((acc, experience) => {
    if (experience.schema === 'https://ns.adobe.com/personalization/json-content-item' || experience.schema === 'https://ns.adobe.com/personalization/html-content-item') {
      return acc + experience.ids.size; // Counting unique Code Based experiences
    }
    return acc;
  }, 0);

  const totalAJOExperiences = countIAMs + countContentCards + countCodeBased;

  return (
    <View backgroundColor="gray-50" padding="size-100" borderRadius="medium" borderWidth="thin" borderColor="gray-200">
      <Flex direction="column" marginBottom="size-100">
        <Text UNSAFE_style={{ fontSize: '20px', fontWeight: 'bold' }}>{session.sessionName}</Text>
        <Text UNSAFE_style={{ fontSize: '10px', color: 'gray' }}>Session ID : {session.sessionID}</Text>
      </Flex>
      <Flex direction="column" justifyContent="center" alignItems="center" gap="size-100">
        <Flex direction="row" justifyContent="space-between" alignItems="center" gap="size-400" width="100%">
          <Flex direction="column" justifyContent="center" alignItems="center" flex="1">
            <Text UNSAFE_style={{ fontSize: '25px', fontWeight: 'bold', color: 'rgba(124, 192, 170, 0.9)' }}>{session.events.length || 0}</Text>
            <Text>EVENTS</Text>
          </Flex>
          <Divider orientation="vertical" size="S" />
          <Flex direction="column" justifyContent="center" alignItems="center" flex="1">
            <Text UNSAFE_style={{ fontSize: '25px', fontWeight: 'bold', color: 'gray' }}>{session.launches || 0}</Text>
            <Text>OPENS</Text>
          </Flex>
        </Flex>
        <Flex justifyContent="center" alignItems="center" marginTop="size-100">
          <Button variant="secondary" onPress={onViewEvents}>
            <Text>More Details</Text>
          </Button>
        </Flex>
      </Flex>
    </View>
  );
};

export default SessionCard;






// Just the view

// return (
//   <View 
//     backgroundColor="gray-50" 
//     padding="size-200" 
//     borderRadius="medium" 
//     marginStart="size-100" 
//     borderWidth="thin"
//     borderColor="gray-200"
//     maxWidth="size-4000"
//     alignSelf="center"
//   >
//     {/* Main Heading */}
    // <Heading level={3} marginBottom="size-100" alignSelf="center">
    //  {session.sessionName}
    // </Heading>

//     {/* Metrics in Grid Layout */}
//     <Grid 
//       columns={['1fr', 'size-40', '1fr', 'size-40', '1fr']} 
//       alignItems="center"
//       gap="size-20"
//       marginBottom="size-150"
//     >
//       {/* Launches */}
      
//       <Flex flex direction="column" justifyContent="center" alignItems="center">
        // <Text UNSAFE_style={{ fontSize: numberFontSize, fontWeight: numberFontWeight, color: numberFontColor}}>
        //   {session.launches || 0}
        // </Text>
        // <Text>LAUNCHES</Text>
//       </Flex>

//       {/* Divider between Launches and Events */}
//       <Divider orientation="vertical" size="S" />

//       {/* Events */}
//       <Flex flex direction="column" justifyContent="center" alignItems="center">
//         <Text  UNSAFE_style={{ fontSize: numberFontSize, fontWeight: numberFontWeight, textAlign: 'center' }}>
//           {session.events.length}
//         </Text>
//         <Text>EVENTS</Text>
//       </Flex>

//       {/* Divider between Events and AJO Experiences */}
//       <Divider orientation="vertical" size="S" />

//       {/* AJO Experiences */}
//       <Flex flex direction="column" justifyContent="center" alignItems="center">
//       <Text UNSAFE_style={{ fontSize: numberFontSize, fontWeight: numberFontWeight, textAlign: 'center'}}>
//           {totalAJOExperiences}
//         </Text>
//         <Text>AJO EXPERIENCES</Text>
//       </Flex>
//     </Grid>

//     <Divider size="S" marginY="size-250" />

//   {/* IAM Download and Events Information */}
//   <Flex direction="row" justifyContent="space-between" gap="size-125" marginBottom="size-150">
//       <Text>IAM Downloaded</Text>
//       <Text>{countIAMs}</Text> {/* Display IAM count */}
//   </Flex>

//     {/* Events Count */}
//     <Flex direction="row" justifyContent="space-between" gap="size-125" marginBottom="size-150">
//       <Text>Content Cards</Text>
//       <Text>{countContentCards}</Text>
//     </Flex>

    // <Flex direction="row" justifyContent="space-between" gap="size-125" marginBottom="size-150">
    //   <Text>Code Based Experience</Text>
    //   <Text>{countCodeBased}</Text>
    // </Flex>

//     <Divider size="S" marginY="size-250" />


//     {/* Center the button */}
    // <Flex justifyContent="center" alignItems="center" marginTop="size-200">
    //   <Button variant="secondary" onPress={onViewEvents}>
    //     <Text>View Events</Text>
    //   </Button>
    // </Flex>
//   </View>
// );
















// import React from 'react';
// import { View, Heading, Text, Button, Divider, Flex } from '@adobe/react-spectrum';

// const SessionCard = ({ session, onViewEvents }) => {
  
//   // Count IAM and Content Card downloads
//   const countIAMs = Object.values(session.experiencesMap).reduce((acc, experience) => {
//     if (experience.schema === 'https://ns.adobe.com/personalization/message/in-app') {
//       return acc + experience.ids.size; // Counting unique IAMs
//     }
//     return acc;
//   }, 0);

//   const countContentCards = Object.values(session.experiencesMap).reduce((acc, experience) => {
//     if (experience.schema === 'https://ns.adobe.com/personalization/message/content-card') {
//       return acc + experience.ids.size; // Counting unique Content Cards
//     }
//     return acc;
//   }, 0);

//   const countCodeBased = Object.values(session.experiencesMap).reduce((acc, experience) => {
//     if (experience.schema === 'https://ns.adobe.com/personalization/json-content-item' || experience.schema === 'https://ns.adobe.com/personalization/html-content-item') {
//       return acc + experience.ids.size; // Counting unique Code Based experience
//     }
//     return acc;
//   }, 0);

//   const totalAJOExperiences = countIAMs + countContentCards + countCodeBased;

//   return (
//     <View 
//       backgroundColor="gray-50" 
//       padding="size-200" 
//       borderRadius="medium" 
//       marginStart="size-150" 
//       borderWidth="thin"
//       borderColor="gray-200"
//       width="size-3000"
//     >
//       {/* Main Heading */}
//       <Heading level={3} marginBottom="size-100">
//         {session.sessionName}
//       </Heading>

//       <Divider size="S" marginY="size-250" />

//       {/* Launches Information */}
//       <Flex direction="row" justifyContent="space-between" gap="size-125" marginBottom="size-150">
//         <Text>Launches</Text>
//         <Text>{session.launches || 0}</Text>
//       </Flex>

//       <Divider size="M" marginY="size-250" />

//     {/* IAM Download and Events Information */}
//     <Flex direction="row" justifyContent="space-between" gap="size-125" marginBottom="size-100">
//         <Text>AJO Experiences</Text>
//         <Text>{totalAJOExperiences}</Text> {/* Display IAM count */}
//     </Flex>

//       <Divider size="S" marginY="size-250" />

//       {/* Events Count */}
//       <Flex direction="row" justifyContent="space-between" gap="size-125" marginBottom="size-150">
//         <Text>Events</Text>
//         <Text>{session.events.length}</Text>
//       </Flex>

//       <Divider size="S" marginY="size-250" />

      

//       {/* Button to view events */}
//       <Button variant="secondary" onPress={onViewEvents} marginTop="size-150">
//         <Text>View Events</Text>
//       </Button>
//     </View>
//   );
// };

// export default SessionCard;
