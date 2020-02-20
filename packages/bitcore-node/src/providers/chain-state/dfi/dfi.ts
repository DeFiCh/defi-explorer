import { InternalStateProvider } from "../internal/internal";

export class DFIStateProvider extends InternalStateProvider{
  constructor(chain: string = 'DFI') {
    super(chain);
  }
}
