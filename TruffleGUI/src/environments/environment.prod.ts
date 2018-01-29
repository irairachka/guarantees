import {EtheriumService} from "../app/services/real-etherium.service";
import {RealService} from "../app/services/real-etheriumwork.service";

export const environment = {
  production: true,
  server:'35.158.139.208',
  apiserver:'',
  service: {
    provide: EtheriumService,
    useClass: RealService
  }
};
