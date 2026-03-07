import { useEffect, useRef } from 'react';
import { NavigationInternalItemFormSchema, NavigationItemFormSchema } from '../../utils/form';
import { StrapiContentTypeItemSchema } from 'src/api/validators';
import { useConfig } from '../../../../hooks';

export const useChangeFieldsFromRelated = (
  values: NavigationInternalItemFormSchema,
  contentTypeItems: StrapiContentTypeItemSchema[] | undefined,
  setFormValuesItems: (values: any) => void
) => {
  const configQuery = useConfig();
  const previousRelatedRef = useRef<string | undefined>(undefined);
  const initialPathRef = useRef<string | null | undefined>(undefined);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    if (!values.autoSync || !values.related || !configQuery.data) {
      return;
    }

    // Store initial path value on first run
    if (!hasInitializedRef.current) {
      initialPathRef.current = values.path;
    }

    const relatedItem = contentTypeItems?.find((item) => {
      return item.documentId === values.related;
    });

    if (!relatedItem) {
      return;
    }

    const { contentTypesNameFields, pathDefaultFields } = configQuery.data;

    const nextPath = pathDefaultFields[values.relatedType]?.reduce<string | undefined>(
      (acc, field) => {
        return acc ? acc : relatedItem?.[field];
      },
      undefined
    ) || '';

    const nextTitle = (contentTypesNameFields[values.relatedType] ?? [])
      .concat(contentTypesNameFields.default ?? [])
      .reduce<undefined | string>((acc, field) => {
        return acc ? acc : relatedItem?.[field];
      }, undefined);

    // Determine if we should update the path:
    // 1. For new items (no initial path), always update
    // 2. For existing items with custom paths, only update if user actively changed the related entity
    const isNewItem = !initialPathRef.current || initialPathRef.current === '' || initialPathRef.current === '/';
    const relatedHasChanged = previousRelatedRef.current !== undefined && 
                               previousRelatedRef.current !== values.related;
    
    const shouldUpdatePath = isNewItem || relatedHasChanged;
    
    if (shouldUpdatePath) {
      setFormValuesItems({
        path: nextPath,
        title: nextTitle,
      });
    }

    previousRelatedRef.current = values.related;
    hasInitializedRef.current = true;
  }, [values.autoSync, values.related, values.relatedType, contentTypeItems, configQuery.data]);
};
