// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import {EtheriumService} from "../app/services/real-etherium.service";
import {MockService} from "../app/services/mock-etherium.service";
import {RemoteService} from "../app/services/remote-etherium.service";
import {RealService} from "../app/services/real-etheriumwork.service";

export const environment = {
  production: false,
  //server:'35.158.139.208',
  // apiserver:'',
  server:'localhost',
  apiserver:'http://localhost:3000',
  service: {
    provide: EtheriumService,
     useClass: RemoteService
    //useClass: MockService
    // useClass: RealService
  }
};
