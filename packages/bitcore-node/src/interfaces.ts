export interface IAddressAndAmount {
  address: string;
  value: number;
}

export interface INetworkMethods {
  getAddressAndValueList: Function;
  getGenesisBlock: Function;
  getGenesisTransaction: Function;
}
