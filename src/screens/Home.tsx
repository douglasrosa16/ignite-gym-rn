import { useState } from 'react';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { HStack, VStack } from 'native-base';

export function Home() {
  const [groupSelected, setGroupSelected] = useState('costas');

  return (
    <VStack flex={1}>
      <HomeHeader />

      <HStack>
        <Group 
          name="costas" 
          isActive={groupSelected === "costas"}
        
        />

        <Group name="ombro" isActive={groupSelected === "ombro"}/>
        <Group name="bícepes" isActive={groupSelected === "bícepes"}/>
      </HStack>
    </VStack>
  );
} 