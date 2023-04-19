import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Pressable,
} from 'react-native';
import {useAgent} from '@aries-framework/react-hooks';

import {ConnectionRecord} from '@aries-framework/core';

const MainScreen = () => {
  const {loading, agent} = useAgent();
  const [invitationUrl, setInvitationUrl] = useState<string>();
  const [currentConnection, setCurrentConnection] =
    useState<ConnectionRecord>();
  const [error, setError] = useState<string>();

  const connectHandler = async () => {
    setError(undefined);
    try {
      const {connectionRecord} = await agent!.oob.receiveInvitationFromUrl(
        invitationUrl!,
      );
      setCurrentConnection(connectionRecord);
    } catch (error: any) {
      setError(error.message.toString());
    }
  };

  const checkConnectionsHandler = async () => {
    const connections = await agent?.connections.getAll();
    console.log('CONNECTIONS HERE: ', connections);
  };

  const checkCredentialsHandler = async () => {
    setError(undefined);
    const creds = await agent?.credentials.getAll();
    if (!creds || !creds.length) {
      setError('no creds available.');
    }
    console.log('CREDS HERE: ', creds);
  };

  const acceptProofRequestsHandler = async () => {
    const proofs = await agent?.proofs.getAll();
    console.log('PROOFS HERE: ', proofs);

    for (const proof of proofs!) {
      const requestedCredentials =
        await agent?.proofs.selectCredentialsForRequest({
          proofRecordId: proof.id,
        });

      await agent?.proofs.acceptRequest({
        proofRecordId: proof.id,
        proofFormats: requestedCredentials!.proofFormats,
      });
    }
  };

  const deleteConnectionsHandler = async () => {
    const connections = await agent?.connections.getAll();
    await Promise.all(
      connections?.map(conn => {
        return agent?.connections.deleteById(conn.id);
      })!,
    );
  };

  const deleteCredentialsHandler = async () => {
    const creds = await agent?.credentials.getAll();
    await Promise.all(
      creds?.map(cred => agent?.credentials.deleteById(cred.id))!,
    );
  };

  const deleteWalletHandler = async () => {
    await agent?.wallet.delete();
  };

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.root}>
      <Text>Agent name: {agent?.config.label}</Text>
      {error && <Text style={styles.errorMessage}>{error}</Text>}
      {currentConnection && (
        <Text>Latest connection id: {currentConnection.id}</Text>
      )}
      <TextInput
        style={styles.input}
        placeholder="Invitation URL"
        value={invitationUrl}
        onChangeText={setInvitationUrl}
      />
      <Pressable
        style={({pressed}) => [styles.button, pressed && styles.pressed]}
        onPress={connectHandler}>
        <Text style={styles.buttonText}>CONNECT</Text>
      </Pressable>
      <Pressable
        style={({pressed}) => [styles.button, pressed && styles.pressed]}
        onPress={checkConnectionsHandler}>
        <Text style={styles.buttonText}>CHECK CONNECTIONS</Text>
      </Pressable>
      <Pressable
        style={({pressed}) => [styles.button, pressed && styles.pressed]}
        onPress={checkCredentialsHandler}>
        <Text style={styles.buttonText}>CHECK CREDS</Text>
      </Pressable>
      <Pressable
        style={({pressed}) => [styles.button, pressed && styles.pressed]}
        onPress={acceptProofRequestsHandler}>
        <Text style={styles.buttonText}>ACCEPT PROOF REQUESTS</Text>
      </Pressable>
      <Pressable
        style={({pressed}) => [styles.button, pressed && styles.pressed]}
        onPress={deleteConnectionsHandler}>
        <Text style={styles.buttonText}>DELETE CONNECTIONS</Text>
      </Pressable>
      <Pressable
        style={({pressed}) => [styles.button, pressed && styles.pressed]}
        onPress={deleteCredentialsHandler}>
        <Text style={styles.buttonText}>DELETE CREDS</Text>
      </Pressable>
      <Pressable
        style={({pressed}) => [styles.button, pressed && styles.pressed]}
        onPress={deleteWalletHandler}>
        <Text style={styles.buttonText}>DELETE WALLET</Text>
      </Pressable>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 5,
    margin: 10,
  },
  input: {
    padding: 5,
    backgroundColor: 'white',
    width: '100%',
    borderWidth: 2,
    borderColor: 'green',
  },
  button: {
    backgroundColor: 'green',
    width: '100%',
    padding: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
  },
  pressed: {
    opacity: 0.75,
  },
  errorMessage: {
    color: 'red',
    fontWeight: 'bold',
  },
});
