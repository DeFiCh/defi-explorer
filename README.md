# DeFi Blockchain Explorer

An insight-based blockchain explorer that's built for the DeFi Blockchain ([defichain.io](https://defichain.io)).

## Start

The default setup uses docker and docker-compose to enable a single command deployment with an env file.

By default there are 3 env files in the repo:
- `.env.example` 
- `.env.testnet`
- `.env.mainnet`

One is a local example file - `.env.example`. The other two files target `testnet.defichain.io` and `mainnet.defichain.io` deployments. To do a local deployment:

> user@host:~/src/defi-explorer$ cp .env.example .env

> user@host:~/src/defi-explorer$ docker-compose up

That's it. This should launch everything required (DeFi Blockchain node, Bitcore API server, MongoDB and Insight) in their respective containers.

Please have a look at the `docker-compose.yml` file for other defaults and env usage.

## Configurations

### Environment variables

- `NETWORK` [required] - mainnet/testnet
- `API_PREFIX` [required] - The full path prefix to the bitcore API endpoint
- `HTTP_PORT` [default: 5000] - The final web endpoint of the insight explorer
- `API_PORT` [default: 3000] - The bitcore API endpoint port

### Conf files

- `bitcore.${NETWORK}.config.json` [required] - The bitcore config file for the given network provided by the `NETWORK` env. 
- `defi.${NETWORK}.conf` [required] - The DeFi Blockchain config that's used the node.

NOTE: Please make sure to set a proper `rpc` username and password in both of the above before production deployments. 

- The DeFi Blockchain node version entirely depends on the docker image used to run it, with compose.

For details on `bitcore` config, have a look at the [Bitcore README](./docs/Bitcore-README.md).

## Notes

Deployment shortcuts: 
 
`testnet.defichain.io`:

> docker-compose --env-file .env.testnet up

`mainnet.defichain.io`:

> docker-compose --env-file .env.mainnet up