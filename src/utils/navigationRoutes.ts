export interface RouteMapping {
  viewKey: string;
  path: string;
  aliases: string[];
}

export const ROUTE_MAPPINGS: RouteMapping[] = [
  { viewKey: 'dashboard', path: '/dashboard', aliases: ['/', '/home'] },
  { viewKey: 'browse', path: '/marketplace', aliases: ['/browse', '/browse-produce', '/market'] },
  { viewKey: 'listings', path: '/produce', aliases: ['/listings', '/my-listings'] },
  { viewKey: 'requests', path: '/procurement', aliases: ['/requests', '/my-requests', '/demand-requests'] },
  { viewKey: 'matching', path: '/matching', aliases: ['/supplier-matches', '/matches'] },
  { viewKey: 'orders', path: '/orders', aliases: ['/orders-escrow', '/sales'] },
  { viewKey: 'contracts', path: '/contracts', aliases: ['/agreed-contracts'] },
  { viewKey: 'recurring', path: '/recurring', aliases: ['/recurring-supply', '/recurring-procurement', '/phase2'] },
  { viewKey: 'logistics', path: '/logistics', aliases: ['/tracking', '/freight-tracking', '/dispatch'] },
  { viewKey: 'payments', path: '/wallet', aliases: ['/payments', '/escrow', '/payouts'] },
  { viewKey: 'messages', path: '/messages', aliases: ['/chat', '/negotiations'] },
  { viewKey: 'market-intel', path: '/market-prices', aliases: ['/market-benchmarks', '/prices'] },
  { viewKey: 'verification', path: '/verification', aliases: ['/kyc', '/farm-verification'] },
  { viewKey: 'profile', path: '/trust-profile', aliases: ['/profile', '/trust-score'] },
  { viewKey: 'settings', path: '/settings', aliases: ['/account-settings', '/preferences'] },
  { viewKey: 'auth', path: '/client-portals', aliases: ['/auth', '/login', '/signup', '/exit'] },
  { viewKey: 'reports', path: '/reports', aliases: ['/admin-analytics', '/admin-data', '/analytics'] },
  { viewKey: 'available-jobs', path: '/available-jobs', aliases: ['/freight-jobs'] },
  { viewKey: 'active-delivery', path: '/active-delivery', aliases: ['/waybills'] },
  { viewKey: 'requests-feed', path: '/requests-feed', aliases: ['/demand-feed'] },
  { viewKey: 'farmer-bi', path: '/farmer-bi', aliases: ['/farm-intelligence'] },
  { viewKey: 'aggregation', path: '/aggregation', aliases: ['/farmer-aggregation'] },
  { viewKey: 'admin-verification', path: '/admin-verification', aliases: ['/verification-queue'] },
  { viewKey: 'admin-escrow', path: '/admin-escrow', aliases: ['/escrow-vault'] },
  { viewKey: 'admin-disputes', path: '/admin-disputes', aliases: ['/dispute-resolution'] },
  { viewKey: 'admin-users', path: '/admin-users', aliases: ['/user-directory'] },
];

export function getViewKeyFromPath(pathOrHash: string): string {
  if (!pathOrHash) return 'dashboard';
  // Strip query string, hash, and leading/trailing slashes
  const clean = pathOrHash.replace(/^[#/]+/, '').split('?')[0].split('#')[0].trim().toLowerCase();
  if (!clean || clean === 'dashboard' || clean === 'home') return 'dashboard';

  const normalized = '/' + clean;
  for (const m of ROUTE_MAPPINGS) {
    if (m.path === normalized || m.aliases.includes(normalized)) {
      return m.viewKey;
    }
  }
  return clean;
}

export function getPathFromViewKey(viewKey: string): string {
  const mapping = ROUTE_MAPPINGS.find(m => m.viewKey === viewKey || m.aliases.includes(`/${viewKey}`));
  return mapping ? mapping.path : `/${viewKey}`;
}
