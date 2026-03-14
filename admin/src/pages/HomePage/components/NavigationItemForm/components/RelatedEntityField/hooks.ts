import { useEffect, useRef } from 'react';
import { NavigationInternalItemFormSchema, NavigationItemFormSchema } from '../../utils/form';
import { StrapiContentTypeItemSchema } from 'src/api/validators';
import { useConfig } from '../../../../hooks';

export const useChangeFieldsFromRelated = (
  values: NavigationInternalItemFormSchema,
  contentTypeItems: StrapiContentTypeItemSchema[] | undefined,
  setFormValuesItems: (values: any) => void,
  onChange?: (fieldName: string, value: any) => void
) => {
  const configQuery = useConfig();
  const previousRelatedRef = useRef<string | undefined>(undefined);
  // Tracks the related value the item was loaded with (null = not yet recorded)
  const initialRelatedRef = useRef<string | undefined | null>(null);
  const hasInitializedRef = useRef(false);

  useEffect(() => {
    // Record the initial related value on the very first run of this effect,
    // before any early returns, so we know what the item was loaded with.
    if (initialRelatedRef.current === null) {
      initialRelatedRef.current = values.related;
    }

    if (!values.autoSync || !values.related || !configQuery.data) {
      return;
    }

    const relatedItem = contentTypeItems?.find((item) => {
      return item.documentId === values.related;
    });

    if (!relatedItem) {
      return;
    }

    // On first run with a related value:
    // - If the item was LOADED with this related value, skip (don't overwrite saved path/title)
    // - If the item had no related before (user just selected one), proceed to update
    if (!hasInitializedRef.current) {
      hasInitializedRef.current = true;
      previousRelatedRef.current = values.related;
      if (initialRelatedRef.current === values.related) {
        return;
      }
    }

    // Only update if the related entity actually changed
    if (previousRelatedRef.current === values.related) {
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

    setFormValuesItems({
      path: nextPath,
      title: nextTitle,
    });

    // Also update the Form's internal state so the UI reflects the changes
    if (onChange) {
      onChange('title', nextTitle);
      onChange('path', nextPath);
    }

    previousRelatedRef.current = values.related;
  }, [values.autoSync, values.related, values.relatedType, contentTypeItems, configQuery.data]);
};
