import { first, isEmpty } from 'lodash';

import {
  ConfigFromServerSchema,
  NavigationItemTypeSchema,
  StrapiContentTypeItemSchema,
} from '../../../../../api/validators';
import { extractRelatedItemLabel } from '../../../../HomePage/utils';
import { NavigationItemFormSchema } from './form';

/**
 * Checks if a path looks like a query parameter or if parent path ends with =
 * @param path - The path to check
 * @param parentPath - The parent path to check
 * @returns true if it looks like a query parameter (?key=value or &key=value) or parent ends with =
 */
const isQueryParameter = (path: string, parentPath?: string): boolean => {
  if (!path) return false;
  const trimmedPath = path.trim();
  
  // Check if it starts with ? or & and contains = with some content
  const queryParamRegex = /^[?&]\w+=[^&]*$/;
  const isStandardQueryParam = queryParamRegex.test(trimmedPath);
  
  // Check if parent path ends with = (incomplete query parameter)
  const parentEndsWithEquals = parentPath && parentPath.trim().endsWith('=');
  
  return isStandardQueryParam || !!parentEndsWithEquals;
};

interface GenerateUiRouterKeyInput {
  slugify: (s: string) => Promise<string>;
  title: string;
  related?: number | string;
  relatedType?: string;
  contentTypeItems?: Array<StrapiContentTypeItemSchema>;
  config?: ConfigFromServerSchema;
}

interface GeneratePreviewPathInput {
  isExternal?: boolean;
  currentPath?: string | null;
  current: Partial<NavigationItemFormSchema>;
  currentType?: NavigationItemTypeSchema;
  currentRelatedType?: string;
  currentRelated?: number | string;
  config?: ConfigFromServerSchema;
  isSingleSelected?: boolean;
  contentTypeItems?: Array<StrapiContentTypeItemSchema>;
}

interface GetDefaultPathInput {
  currentType: NavigationItemTypeSchema;
  currentRelatedType?: string;
  currentRelated?: number | string;
  config?: ConfigFromServerSchema;
  isSingleSelected?: boolean;
  contentTypeItems?: Array<StrapiContentTypeItemSchema>;
}

export const generateUiRouterKey = async ({
  slugify,
  title,
  config,
  related,
  relatedType,
  contentTypeItems,
}: GenerateUiRouterKeyInput): Promise<string | undefined> => {
  try {
    if (title) {
      const slugified = await slugify(title);
      // Return the slugified result if successful, otherwise return undefined
      return slugified || undefined;
    } else if (related) {
      const relationTitle = extractRelatedItemLabel(
        {
          ...(contentTypeItems?.find((_) => _.documentId === related.toString()) ?? {
            documentId: '',
            id: 0,
          }),
          __collectionUid: relatedType,
        },
        config
      );

      if (relationTitle) {
        const slugified = await slugify(relationTitle);
        // Return the slugified result if successful, otherwise return undefined
        return slugified || undefined;
      }
    }
  } catch (error) {
    // If slugification fails, return undefined to allow fallback handling
    console.warn('Slugification failed:', error);
    return undefined;
  }

  return undefined;
};

export const getDefaultPath = ({
  currentType,
  config,
  contentTypeItems,
  currentRelated,
  currentRelatedType,
  isSingleSelected,
}: GetDefaultPathInput): string => {
  if (currentType !== 'INTERNAL') return '';

  if (!currentRelatedType) {
    return '';
  }

  const pathDefaultFields = config?.pathDefaultFields[currentRelatedType] ?? [];

  if (isEmpty(currentType) && !isEmpty(pathDefaultFields)) {
    const selectedEntity = isSingleSelected
      ? first(contentTypeItems ?? [])
      : contentTypeItems?.find(({ id }) => id === currentRelated);

    const pathDefaultValues = pathDefaultFields
      .map((field: string) => selectedEntity?.[field] ?? '')
      .filter((value: string) => !!value.toString().trim());

    return pathDefaultValues[0] ?? '';
  }

  return '';
};

export const generatePreviewPath = ({
  currentPath,
  isExternal,
  current,
  currentType = 'INTERNAL',
  config,
  contentTypeItems,
  currentRelated,
  currentRelatedType,
  isSingleSelected,
}: GeneratePreviewPathInput): string | undefined => {
  if (!isExternal) {
    const itemPath =
      isEmpty(currentPath) || currentPath === '/'
        ? getDefaultPath({
            currentType,
            config,
            contentTypeItems,
            currentRelated,
            currentRelatedType,
            isSingleSelected,
          })
        : currentPath || '';

    // Smart path building: if itemPath looks like a query parameter,
    // or if current.levelPath ends with =, don't add a leading slash
    const shouldSkipSlash = isQueryParameter(itemPath, current.levelPath);
    
    let result: string;
    if (shouldSkipSlash) {
      // For query parameters or incomplete query params, just concatenate without adding slash
      result = `${current.levelPath !== '/' ? `${current.levelPath}` : ''}${itemPath}`;
    } else {
      // For regular paths, add slash as before
      result = `${current.levelPath !== '/' ? `${current.levelPath}` : ''}/${itemPath}`;
      result = result.replace('//', '/');
    }

    return result;
  }

  return undefined;
};
