// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {MockService} from "../app/services/mock-etherium.service";
import {EtheriumService} from "../app/services/real-etherium.service";
import {RemoteService} from "../app/services/remote-etherium.service";
import {RealService} from "../app/services/real-etheriumwork.service";

export const environment = {
  production: false,
  server:'localhost',
  service: {
    provide: EtheriumService,
    useClass: MockService
    // useClass: RealService
    // useClass: RemoteService
  }
};
