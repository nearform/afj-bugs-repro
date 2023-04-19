import {
  Agent,
  ConnectionEventTypes,
  ConnectionStateChangedEvent,
  DidExchangeState,
  JsonLdCredentialDetailFormat,
  KeyDidCreateOptions,
  KeyType,
  TypedArrayEncoder
} from '@aries-framework/core'
import qrcode from 'qrcode-terminal'

import { getAgent } from './agent'

const run = async () => {
  const agent = await getAgent('IssuerAgent')

  let did: string | null = null

  const dids = await agent.dids.getCreatedDids({
    method: 'key'
  })

  if (dids && dids.length > 0) {
    did = dids[0].did
  } else {
    const { didState } = await agent.dids.create<KeyDidCreateOptions>({
      method: 'key',
      options: {
        keyType: KeyType.Ed25519
      },
      secret: {
        privateKey: TypedArrayEncoder.fromString(
          'testkey0000000000000000000000001'
        )
      }
    })

    if (!didState.did) {
      throw new Error('Did not available.')
    }
    did = didState.did!
  }

  const { outOfBandRecord, invitation } =
    await agent.oob.createLegacyInvitation()

  const url = invitation.toUrl({ domain: 'https://example.com' })

  console.log('INVITATION URL: ', url)

  qrcode.generate(url, { small: true })

  const connectionId = await connectionListener(agent, outOfBandRecord.id)

  const credential: JsonLdCredentialDetailFormat = {
    credential: {
      '@context': [
        'https://www.w3.org/2018/credentials/v1',
        'https://www.w3.org/2018/credentials/examples/v1'
      ],
      type: ['VerifiableCredential', 'UniversityDegreeCredential'],
      issuer: did,
      issuanceDate: '2017-10-22T12:23:48Z',
      credentialSubject: {
        degree: {
          name: 'Bachelor of Science and Arts',
          type: 'BachelorDegree'
        }
      }
    },
    options: {
      proofType: 'Ed25519Signature2018',
      proofPurpose: 'assertionMethod'
    }
  }

  await agent.credentials.offerCredential({
    connectionId,
    protocolVersion: 'v2',
    credentialFormats: {
      jsonld: credential
    }
  })
}

const connectionListener = (agent: Agent, id: string): Promise<string> => {
  return new Promise(resolve => {
    agent.events.on<ConnectionStateChangedEvent>(
      ConnectionEventTypes.ConnectionStateChanged,
      ({ payload }) => {
        const { connectionRecord } = payload

        if (connectionRecord.outOfBandId !== id) {
          return
        }
        if (connectionRecord.state === DidExchangeState.Completed) {
          resolve(connectionRecord.id)
        }
      }
    )
  })
}

run()
