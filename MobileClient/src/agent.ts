import {ensureSecure} from 'isomorphic-webcrypto';
import {
  AnonCredsModule,
  LegacyIndyCredentialFormatService,
  LegacyIndyProofFormatService,
  V1CredentialProtocol,
  V1ProofProtocol,
} from '@aries-framework/anoncreds';
import {
  AutoAcceptCredential,
  AutoAcceptProof,
  ConnectionsModule,
  ConsoleLogger,
  CredentialEventTypes,
  CredentialState,
  CredentialStateChangedEvent,
  CredentialsModule,
  DidsModule,
  InitConfig,
  JsonLdCredentialFormatService,
  KeyDidRegistrar,
  KeyDidResolver,
  LogLevel,
  MediationRecipientModule,
  MediatorModule,
  MediatorPickupStrategy,
  OutOfBandEventTypes,
  OutOfBandStateChangedEvent,
  ProofEventTypes,
  ProofState,
  ProofStateChangedEvent,
  ProofsModule,
  V2CredentialProtocol,
  V2ProofProtocol,
  W3cCredentialsModule,
  Agent,
  WsOutboundTransport,
  HttpOutboundTransport,
} from '@aries-framework/core';
import {
  IndySdkAnonCredsRegistry,
  IndySdkIndyDidRegistrar,
  IndySdkIndyDidResolver,
  IndySdkModule,
  IndySdkPoolConfig,
  IndySdkSovDidResolver,
} from '@aries-framework/indy-sdk';
import {agentDependencies} from '@aries-framework/react-native';
import indySdk from 'indy-sdk-react-native';

import {MEDIATOR_URL} from './config';

const genesisTransactions = `{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node1","blskey":"4N8aUNHSgjQVgkpm8nhNEfDf6txHznoYREg9kirmJrkivgL4oSEimFF6nsQ6M41QvhM2Z33nves5vfSn9n1UwNFJBYtWVnHYMATn76vLuL3zU88KyeAYcHfsih3He6UHcXDxcaecHVz6jhCYz1P2UZn2bDVruL5wXpehgBfBaLKm3Ba","blskey_pop":"RahHYiCvoNCtPTrVtP7nMC5eTYrsUA8WjXbdhNc8debh1agE9bGiJxWBXYNFbnJXoXhWFMvyqhqhRoq737YQemH5ik9oL7R4NTTCz2LEZhkgLJzB3QRQqJyBNyv7acbdHrAT8nQ9UkLbaVL9NBpnWXBTw4LEMePaSHEw66RzPNdAX1","client_ip":"138.197.138.255","client_port":9702,"node_ip":"138.197.138.255","node_port":9701,"services":["VALIDATOR"]},"dest":"Gw6pDLhcBcoQesN72qfotTgFa7cbuqZpkX3Xo6pLhPhv"},"metadata":{"from":"Th7MpTaRZVRYnPiabds81Y"},"type":"0"},"txnMetadata":{"seqNo":1,"txnId":"fea82e10e894419fe2bea7d96296a6d46f50f93f9eeda954ec461b2ed2950b62"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node2","blskey":"37rAPpXVoxzKhz7d9gkUe52XuXryuLXoM6P6LbWDB7LSbG62Lsb33sfG7zqS8TK1MXwuCHj1FKNzVpsnafmqLG1vXN88rt38mNFs9TENzm4QHdBzsvCuoBnPH7rpYYDo9DZNJePaDvRvqJKByCabubJz3XXKbEeshzpz4Ma5QYpJqjk","blskey_pop":"Qr658mWZ2YC8JXGXwMDQTzuZCWF7NK9EwxphGmcBvCh6ybUuLxbG65nsX4JvD4SPNtkJ2w9ug1yLTj6fgmuDg41TgECXjLCij3RMsV8CwewBVgVN67wsA45DFWvqvLtu4rjNnE9JbdFTc1Z4WCPA3Xan44K1HoHAq9EVeaRYs8zoF5","client_ip":"138.197.138.255","client_port":9704,"node_ip":"138.197.138.255","node_port":9703,"services":["VALIDATOR"]},"dest":"8ECVSk179mjsjKRLWiQtssMLgp6EPhWXtaYyStWPSGAb"},"metadata":{"from":"EbP4aYNeTHL6q385GuVpRV"},"type":"0"},"txnMetadata":{"seqNo":2,"txnId":"1ac8aece2a18ced660fef8694b61aac3af08ba875ce3026a160acbc3a3af35fc"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node3","blskey":"3WFpdbg7C5cnLYZwFZevJqhubkFALBfCBBok15GdrKMUhUjGsk3jV6QKj6MZgEubF7oqCafxNdkm7eswgA4sdKTRc82tLGzZBd6vNqU8dupzup6uYUf32KTHTPQbuUM8Yk4QFXjEf2Usu2TJcNkdgpyeUSX42u5LqdDDpNSWUK5deC5","blskey_pop":"QwDeb2CkNSx6r8QC8vGQK3GRv7Yndn84TGNijX8YXHPiagXajyfTjoR87rXUu4G4QLk2cF8NNyqWiYMus1623dELWwx57rLCFqGh7N4ZRbGDRP4fnVcaKg1BcUxQ866Ven4gw8y4N56S5HzxXNBZtLYmhGHvDtk6PFkFwCvxYrNYjh","client_ip":"138.197.138.255","client_port":9706,"node_ip":"138.197.138.255","node_port":9705,"services":["VALIDATOR"]},"dest":"DKVxG2fXXTU8yT5N7hGEbXB3dfdAnYv1JczDUHpmDxya"},"metadata":{"from":"4cU41vWW82ArfxJxHkzXPG"},"type":"0"},"txnMetadata":{"seqNo":3,"txnId":"7e9f355dffa78ed24668f0e0e369fd8c224076571c51e2ea8be5f26479edebe4"},"ver":"1"}
{"reqSignature":{},"txn":{"data":{"data":{"alias":"Node4","blskey":"2zN3bHM1m4rLz54MJHYSwvqzPchYp8jkHswveCLAEJVcX6Mm1wHQD1SkPYMzUDTZvWvhuE6VNAkK3KxVeEmsanSmvjVkReDeBEMxeDaayjcZjFGPydyey1qxBHmTvAnBKoPydvuTAqx5f7YNNRAdeLmUi99gERUU7TD8KfAa6MpQ9bw","blskey_pop":"RPLagxaR5xdimFzwmzYnz4ZhWtYQEj8iR5ZU53T2gitPCyCHQneUn2Huc4oeLd2B2HzkGnjAff4hWTJT6C7qHYB1Mv2wU5iHHGFWkhnTX9WsEAbunJCV2qcaXScKj4tTfvdDKfLiVuU2av6hbsMztirRze7LvYBkRHV3tGwyCptsrP","client_ip":"138.197.138.255","client_port":9708,"node_ip":"138.197.138.255","node_port":9707,"services":["VALIDATOR"]},"dest":"4PS3EDQ3dW1tci1Bp6543CfuuebjFrg36kLAUcskGfaA"},"metadata":{"from":"TWwCRQRZ2ZHMJFn9TzLp7W"},"type":"0"},"txnMetadata":{"seqNo":4,"txnId":"aa5e817d7cc626170eca175822029339a444eb0ee8f0bd20d3b0b76e566fb008"},"ver":"1"}`;

const indyNetworkConfig: IndySdkPoolConfig = {
  id: 'bcovrin-test-net',
  genesisTransactions,
  indyNamespace: 'bcovrin-test-net',
  isProduction: false,
  connectOnStartup: true,
};

console.log('cryptostuff', {
  // @ts-ignore
  none: crypto,
  // @ts-ignore
  global: global.crypto,
  // @ts-ignore
  globalWindow: global.window.crypto,
  // @ts-ignore
  window: window.crypto,
});

export const getAgent = async (label: string) => {
  // Needed for isomorphic-webcrypto. Must be removed if react-native-crypto is used instead
  await ensureSecure();
  const config: InitConfig = {
    logger: new ConsoleLogger(LogLevel.trace),
    label,
    walletConfig: {
      id: label,
      key: label,
    },
  };

  const agent = new Agent({
    config,
    dependencies: agentDependencies,
    modules: getModules(),
  });

  agent.registerOutboundTransport(new HttpOutboundTransport());
  agent.registerOutboundTransport(new WsOutboundTransport());

  await agent.initialize().catch(e => console.error(e));

  agent.events.on(
    CredentialEventTypes.CredentialStateChanged,
    async ({payload}: CredentialStateChangedEvent) => {
      console.log('CREDENTIAL CHANGED EVENT: ', payload);
      const {credentialRecord} = payload;
      switch (credentialRecord.state) {
        case CredentialState.OfferReceived:
          await agent.credentials.acceptOffer({
            credentialRecordId: credentialRecord.id,
          });
          break;
        case CredentialState.Done:
          console.log(
            `Credential for credential id ${credentialRecord.id} is accepted`,
          );
          break;
        default:
          console.log('Not handled credential state: ', credentialRecord.state);
          break;
      }
      console.log('CREDENTIAL CHANGED EVENT - ACCEPTING OFFER: ', payload);
    },
  );

  agent.events.on(
    OutOfBandEventTypes.OutOfBandStateChanged,
    async ({payload}: OutOfBandStateChangedEvent) => {
      console.log('OUT OF BAND EVENT CHANGED: ', payload);
    },
  );

  agent.events.on<ProofStateChangedEvent>(
    ProofEventTypes.ProofStateChanged,
    async ({payload}) => {
      console.log('ProofStateChangedEvent: ', payload);
      const {proofRecord} = payload;
      switch (proofRecord.state) {
        case ProofState.Abandoned:
          console.log('Abandoned');
          break;
        case ProofState.Declined:
          console.log('Declined');
          break;
        case ProofState.Done:
          console.log('Done');
          break;
        case ProofState.PresentationReceived:
          console.log('PresentationReceived');
          break;
        case ProofState.PresentationSent:
          console.log('PresentationSent');
          break;
        case ProofState.ProposalReceived:
          console.log('ProposalReceived');
          break;
        case ProofState.ProposalSent:
          console.log('ProposalSent');
          break;
        case ProofState.RequestReceived:
          console.log('RequestReceived');
          try {
            const requestedCredentials =
              await agent.proofs.selectCredentialsForRequest({
                proofRecordId: proofRecord.id,
              });

            await agent.proofs.acceptRequest({
              proofRecordId: proofRecord.id,
              proofFormats: requestedCredentials.proofFormats,
            });
          } catch (err) {
            console.error(err);
            await agent.proofs.declineRequest({
              proofRecordId: proofRecord.id,
            });
          }
          break;
        case ProofState.RequestSent:
          console.log('RequestSent');
          break;
        default:
          break;
      }
    },
  );

  return agent;
};

function getModules() {
  const legacyIndyCredentialFormat = new LegacyIndyCredentialFormatService();
  const legacyIndyProofFormat = new LegacyIndyProofFormatService();

  return {
    connections: new ConnectionsModule({
      autoAcceptConnections: true,
    }),
    credentials: new CredentialsModule({
      autoAcceptCredentials: AutoAcceptCredential.ContentApproved,
      credentialProtocols: [
        new V1CredentialProtocol({
          indyCredentialFormat: legacyIndyCredentialFormat,
        }),
        new V2CredentialProtocol({
          credentialFormats: [
            legacyIndyCredentialFormat,
            new JsonLdCredentialFormatService(),
          ],
        }),
      ],
    }),
    proofs: new ProofsModule({
      autoAcceptProofs: AutoAcceptProof.ContentApproved,
      proofProtocols: [
        new V1ProofProtocol({
          indyProofFormat: legacyIndyProofFormat,
        }),
        new V2ProofProtocol({
          proofFormats: [legacyIndyProofFormat],
        }),
      ],
    }),
    anoncreds: new AnonCredsModule({
      registries: [new IndySdkAnonCredsRegistry()],
    }),
    dids: new DidsModule({
      registrars: [new IndySdkIndyDidRegistrar(), new KeyDidRegistrar()],
      resolvers: [
        new IndySdkSovDidResolver(),
        new IndySdkIndyDidResolver(),
        new KeyDidResolver(),
      ],
    }),
    indySdk: new IndySdkModule({
      indySdk,
      networks: [indyNetworkConfig],
    }),
    w3cVc: new W3cCredentialsModule(),
    mediator: new MediatorModule({
      autoAcceptMediationRequests: true,
    }),
    mediationRecipient: new MediationRecipientModule({
      mediatorInvitationUrl: MEDIATOR_URL,
      mediatorPickupStrategy: MediatorPickupStrategy.Implicit,
    }),
  } as const;
}
