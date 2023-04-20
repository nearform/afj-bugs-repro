# Aries Framework Javascript - Bugs Repro

This repository has been created mainly to reproduce AFJ bugs.

## AriesFrameworkError: Failed to validate credential - Verification error(s)

### Issue description

We are experiencing this issue on a React Native application (trying to set up a simple AFJ flow), with the Holder trying to store properly a JSON-LD credential issued by an Issuer:

```json
{
  "error": {
    "name": "AriesFrameworkError",
    "message": "Failed to validate credential, error = VerificationError: Verification error(s).",
    "stack": "AriesFrameworkError: Failed to validate credential, error = VerificationError: Verification error(s).\n    at ?anon_0_ (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:161550:96)\n    at next (native)\n    at asyncGeneratorStep (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:20670:26)\n    at _next (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:20689:29)\n    at tryCallOne (/root/react-native/ReactAndroid/hermes-engine/.cxx/Release/6p672e13/arm64-v8a/lib/InternalBytecode/InternalBytecode.js:53:16)\n    at anonymous (/root/react-native/ReactAndroid/hermes-engine/.cxx/Release/6p672e13/arm64-v8a/lib/InternalBytecode/InternalBytecode.js:139:27)\n    at apply (native)\n    at anonymous (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:26200:26)\n    at _callTimer (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:26119:17)\n    at _callReactNativeMicrotasksPass (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:26149:17)\n    at callReactNativeMicrotasks (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:26312:44)\n    at __callReactNativeMicrotasks (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:2407:46)\n    at anonymous (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:2219:45)\n    at __guard (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:2391:15)\n    at flushedQueue (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:2218:21)\n    at callFunctionReturnFlushedQueue (http://localhost:8081/index.bundle?platform=android&dev=true&minify=false&app=com.afjreactnativedemo&modulesOnly=false&runModule=true:2203:33)"
  }
}
```

More details in the [AriesFrameworkError: Failed to validate credential - Verification error(s) GitHub Discussion](https://github.com/hyperledger/aries-framework-javascript/discussions/1432)

### Steps to reproduce the issue

#### Issuer

- navigate into the issuer folder with `cd issuer`
- install the dependencies with `yarn`
- run `ngrok http 3001` and grab the https generated URL
- update the `src/config.ts` `AGENT_DEFAULT_ENDPOINT` variable with the ngrok generated URL
- start the issuer with `yarn start`
- copy the `INVITATION URL` link that will appear in the console

#### MobileClient (React Native Holder)

- navigate into the holder folder with `cd MobileClient`
- install the dependencies with `yarn`
- run the application with `yarn android` (this example will work only with android, configuration is missing for iOS)
- paste the `INVITATION URL` copied from the issuer in the text field
- tap on `CONNECT`
- check the terminal, after a while you should have a the `Failed to validate credential, error = VerificationError: Verification error(s).` error.

#### Notes

- If you are experiencing a `Timeout` error in the React Native application this is due to the Indicio Mediator URL that is not working properly, sometimes it could be down. In this case we suggest to start your own mediator using the [Aries Mediator Service](https://github.com/hyperledger/aries-mediator-service).
- The issue is not happening if the holder is a NodeJS client, the credential in this case is going to be stored properly without any errors.
