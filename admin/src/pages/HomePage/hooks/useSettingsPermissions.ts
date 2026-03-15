import { useAuth } from '@strapi/strapi/admin';

import pluginPermissions from '../../../utils/permissions';

/**
 * Reads permissions directly from auth state to avoid the useRBAC race
 * condition where checkUserHasPermissions resolves before userPermissions
 * are loaded on hard refresh.
 */
export const useSettingsPermissions = () => {
  const isLoading = useAuth('useSettingsPermissions', (state) => state.isLoading);
  const permissions = useAuth('useSettingsPermissions', (state) => state.permissions);

  const hasAction = (action: string) =>
    permissions.some((p: any) => p.action === action);

  const canAccess = !isLoading && hasAction(pluginPermissions.access[0].action);
  const canUpdate = !isLoading && hasAction(pluginPermissions.update[0].action);

  return { canAccess, canUpdate, isLoadingForPermissions: isLoading };
};
