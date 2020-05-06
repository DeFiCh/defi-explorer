# DeFi Blockchain Explorer

An insight-based blockchain explorer that's built for DeFi Blockchain.

## Start

The default setup uses docker and docker-compose to enable a single command deployment with an env file.

By default there are two env files in the repo: 
- `.env.testnet`
- `.env.mainnet`

These files target `testnet.defichain.io` and `mainnet.defichain.io` deployments. To do a local deployment, create `.env` file that has the `NETWORK` and `API_PREFIX` variables as given in these files.

```bash
user@host:~/src/defichain-explorer$ cat <<END > .env
NETWORK=testnet
HTTP_PORT=5000
API_PORT=3000
API_PREFIX=http://localhost:3000/api
END

user@host:~/src/defichain-explorer$ docker-compose up
```

That's it. This should launch everything required (DeFi Blockchain node, Bitcore API server, MongoDB and Insight) in their respective containers.

Please have a look at the `docker-compose.yml` file to other defaults and env usage.

## Configurations

### Environment variables

- `NETWORK` [required] - mainnet/testnet
- `API_PREFIX` [required] - The full path prefix to the bitcore API endpoint
- `HTTP_PORT` [default: 5000] - The final web endpoint of the insight explorer
- `API_PORT` [default: 3000] - The bitcore API endpoint port

### Conf files

- `bitcore.${NETWORK}.config.json` [required] - The bitcore config file for the given network provided by the `NETWORK` env. 
- `defichain/defi.${NETWORK}.conf` [required] - The DeFi Blockchain config that's used the node.

NOTE: Please make sure to set a proper `rpc` username and password in both of the above before production deployments. 

- `defichain/Dockerfile` - This dockerfile downloads the specific version of the DeFi Blockchain binary and builds a docker image out of it, that's used by the deployment subsequently. Modify `VERSION` here for running a different version of the blockchain node.

For details on `bitcore` config, have a look at the [Bitcore README](./docs/Bitcore-README.md)

## Notes

Deployment shortcuts: 
 
`testnet.defichain.io`:

> docker-compose --env-file .env.testnet up

`mainnet.defichain.io`:

> docker-compose --env-file .env.mainnet up