import {
  HomeIcon,
  PhoneIcon,
  ServerIcon,
  BarChartIcon,
  RobotIcon,
  WifiIcon,
} from '../components/icons/Icons';
import { Did, SipTrunk, DidStatus, DidRouteType, TrunkStatus, CountryCode } from '../types';

export const SIDEBAR_LINKS = [
  { href: 'dashboard', label: 'Dashboard', icon: HomeIcon },
  { href: 'dids', label: 'Números (DIDs)', icon: PhoneIcon },
  { href: 'trunks', label: 'Troncales SIP', icon: ServerIcon },
  { href: 'calls', label: 'Llamadas Activas', icon: WifiIcon },
  { href: 'agents', label: 'Agentes de Voz (n8n)', icon: RobotIcon },
  { href: 'insights', label: 'Analíticas', icon: BarChartIcon },
];

// FIX: Update samples to match the flattened `routeType` and `routeTarget` properties in the Did interface.
export const DIDS_SAMPLES: Did[] = [
  { id: 'did_1', phoneNumber: '+525585261234', country: 'MX', status: DidStatus.ACTIVE, trunkId: 'trunk_1', routeType: DidRouteType.AGENT, routeTarget: 'agent_support', createdAt: '2023-10-26T10:00:00Z', accountId: 'acc_default' },
  { id: 'did_2', phoneNumber: '+523341605678', country: 'MX', status: DidStatus.ACTIVE, trunkId: 'trunk_1', routeType: DidRouteType.IVR, routeTarget: 'ivr_main', createdAt: '2023-10-25T11:30:00Z', accountId: 'acc_default' },
  { id: 'did_3', phoneNumber: '+14155552671', country: 'US', status: DidStatus.PROVISIONING, trunkId: null, routeType: DidRouteType.QUEUE, routeTarget: 'q_sales', createdAt: '2023-10-26T12:00:00Z', accountId: 'acc_default' },
  { id: 'did_4', phoneNumber: '+442079460000', country: 'GB', status: DidStatus.INACTIVE, trunkId: 'trunk_2', routeType: DidRouteType.N8N_WEBHOOK, routeTarget: 'wh_promo', createdAt: '2023-10-24T15:00:00Z', accountId: 'acc_default' },
  { id: 'did_5', phoneNumber: '+573101234567', country: 'CO', status: DidStatus.ACTIVE, trunkId: 'trunk_1', routeType: DidRouteType.AGENT, routeTarget: 'agent_billing', createdAt: '2023-10-26T09:00:00Z', accountId: 'acc_default' },
  { id: 'did_6', phoneNumber: '+34919012345', country: 'ES', status: DidStatus.ACTIVE, trunkId: 'trunk_2', routeType: DidRouteType.IVR, routeTarget: 'ivr_main_es', createdAt: '2023-10-23T18:00:00Z', accountId: 'acc_default' },
];

export const TRUNKS_SAMPLES: SipTrunk[] = [
    { id: 'trunk_1', name: 'Proveedor Principal MX', host: 'sip.proveedor.mx', status: TrunkStatus.REGISTERED, dids: [], accountId: 'acc_default' },
    { id: 'trunk_2', name: 'Proveedor Internacional', host: 'sip.provider.com', status: TrunkStatus.ERROR, dids: [], accountId: 'acc_default' },
];