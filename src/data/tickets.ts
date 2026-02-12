export type TicketStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export const getStatusLabel = (status: TicketStatus): string => {
  switch (status) {
    case 'open':
      return 'Open';
    case 'in-progress':
      return 'In Progress';
    case 'resolved':
      return 'Resolved';
    case 'closed':
      return 'Closed';
    default:
      return 'Unknown';
  }
};

export const getStatusColor = (status: TicketStatus): string => {
  switch (status) {
    case 'open':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'resolved':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'closed':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
