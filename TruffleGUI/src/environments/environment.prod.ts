import {EtheriumService} from "../app/services/real-etherium.service";
import {RealService} from "../app/services/real-etheriumwork.service";

export const environment = {
  production: true,
  service: {
    provide: EtheriumService,
    useClass: RealService
  }
};
