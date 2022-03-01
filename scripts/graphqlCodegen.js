const tcpPortUsed = require('tcp-port-used');
const { spawn } = require('child_process');

const TIMEOUT = 60_000;

const spawnCommand = (cmd, cmdArgs) => {
  const childProcess = spawn(cmd, cmdArgs);

  childProcess.stdout.on('data', (data) => {
    console.log('stdout: ' + data.toString());
  });

  childProcess.stderr.on('data', (data) => {
    console.log('stderr: ' + data.toString());
  });

  childProcess.on('exit', (code) => {
    console.log(`Child process exited with code ${code}`);
  });

  return childProcess;
};

const graphqlServerPrcs = spawnCommand('npm', ['run', 'explore']);

tcpPortUsed.waitUntilUsed(8080, 200, TIMEOUT).then(
  () => {
    console.log('Port 8080 is now in use.');

    // Run codegen
    const codegenPrcs = spawnCommand('npm', ['run', 'gql:gen:noserver']);

    // Stop the graphql server once codegen is done
    codegenPrcs.on('close', () => graphqlServerPrcs.kill());
    codegenPrcs.on('error', () => graphqlServerPrcs.kill());
  },
  (err) => {
    console.log('Error:', err.message);
    graphqlServerPrcs.kill();
  },
);
