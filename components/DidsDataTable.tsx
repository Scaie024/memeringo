import React from 'react';
import { Did, DidStatus, DidRouteType } from '../types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/Table';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { MoreHorizontalIcon, PhoneIcon, LoaderIcon } from './icons/Icons';
import { t } from '../lib/i18n';

interface DidsDataTableProps {
  dids: Did[];
  onCall: (did: Did) => void;
  callingDidId: string | null;
}

const getStatusBadgeVariant = (status: DidStatus) => {
  switch (status) {
    case DidStatus.ACTIVE:
      return 'green';
    case DidStatus.PROVISIONING:
      return 'yellow';
    case DidStatus.INACTIVE:
    default:
      return 'gray';
  }
};

const getRouteTypeLabel = (routeType: DidRouteType) => {
    switch (routeType) {
        case DidRouteType.AGENT: return 'Voice Agent';
        case DidRouteType.IVR: return 'IVR';
        case DidRouteType.QUEUE: return 'Queue';
        case DidRouteType.N8N_WEBHOOK: return 'n8n Webhook';
        default: return 'Unknown';
    }
}

export const DidsDataTable: React.FC<DidsDataTableProps> = ({ dids, onCall, callingDidId }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t.didsPage.table.number}</TableHead>
          <TableHead>{t.didsPage.table.country}</TableHead>
          <TableHead>{t.didsPage.table.status}</TableHead>
          <TableHead>{t.didsPage.table.routing}</TableHead>
          <TableHead className="text-right">{t.didsPage.table.actions}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {dids.length > 0 ? (
          dids.map((did) => (
            <TableRow key={did.id}>
              <TableCell className="font-medium text-white">{did.phoneNumber}</TableCell>
              <TableCell>{did.country}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(did.status)}>
                  {did.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{getRouteTypeLabel(did.routeType)}</span>
                  <span className="text-xs text-gray-400">{did.routeTarget}</span>
                </div>
              </TableCell>
              <TableCell className="text-right flex items-center justify-end gap-2">
                 <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onCall(did)}
                    disabled={!!callingDidId}
                 >
                    {callingDidId === did.id ? (
                        <LoaderIcon className="h-4 w-4 animate-spin" />
                    ) : (
                        <PhoneIcon className="h-4 w-4 mr-2" />
                    )}
                    Llamar
                 </Button>
                <Button variant="ghost" size="icon">
                    <MoreHorizontalIcon className="h-4 w-4" />
                    <span className="sr-only">Open menu</span>
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No DIDs found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
