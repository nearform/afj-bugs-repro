import React, {useEffect, useState} from 'react';
import {ActivityIndicator} from 'react-native';
import {Agent, AriesFrameworkError} from '@aries-framework/core';
import AgentProvider from '@aries-framework/react-hooks';

import {getAgent} from './agent';
import MainScreen from './MainScreen';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [agent, setAgent] = useState<Agent>();

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      try {
        const holder = await getAgent('Holder');
        setAgent(holder);
      } catch (err) {
        if (err instanceof AriesFrameworkError) {
          console.error(err.message);
          console.error(err.cause);
          console.error(err.name);
          console.error(err.stack);
          return;
        }
        console.error(
          'An error occurred while initialising the Aries Agent: ',
          err,
        );
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <AgentProvider agent={agent}>
      <MainScreen />
    </AgentProvider>
  );
};

export default App;
