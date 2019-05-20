require('babel-register');
require('babel-polyfill');

module.exports = {
    solc: {
        optimizer: {
          enabled: true,
          runs: 200
        }
      },
    networks: {
        development: {
            host: 'localhost',
            port: 8545,
            gas: 7000000,
            network_id: '*', // Match any network id
            //gas: 0xfffffffffff,
            gasPrice: 0x01
        },
        coverage: {
            host: "localhost",
            network_id: "*",
            port: 8555,
            gas: 0xfffffffffff,
            gasPrice: 0x01
        },
        rinkeby: {
            host: "localhost", // Connect to geth on the specified
            port: 8545,
            from: "0x25a9f7512f28265Cb2772dE07DD947F969E19F49", // default address to use for any transaction Truffle makes during migrations
            network_id: 4,
            gas: 6900000 // Gas limit used for deploys
          }
    },
    mocha: {
        useColors: true,
        slow: 30000,
        bail: true
    }
  
};
