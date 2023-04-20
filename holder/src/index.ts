import { getAgent } from './agent'
import { INVITATION_URL } from './config'

const runHolder = async () => {
  const agent = await getAgent('HolderAgent')

  try {
    const { connectionRecord } = await agent!.oob.receiveInvitationFromUrl(
      INVITATION_URL
    )

    console.log('Connected with connectionRecord: ', connectionRecord)
  } catch (error) {
    console.error(error)
  } finally {
    const creds = await agent.credentials.getAll()
    console.log('CREDENTIALS: ', JSON.stringify(creds))
  }
}

runHolder()
