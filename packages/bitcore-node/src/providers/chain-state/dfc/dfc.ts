import { InternalStateProvider } from "../internal/internal";

export class DFCStateProvider extends InternalStateProvider{
  constructor(chain: string = 'DFC') {
    super(chain);
  }
}
