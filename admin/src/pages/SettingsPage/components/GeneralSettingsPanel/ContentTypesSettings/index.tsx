import { Accordion, Grid, MultiSelect, MultiSelectOption } from '@strapi/design-system';
import { Field } from '@sensinum/strapi-utils';

import { useIntl } from 'react-intl';
import { get, isEmpty } from 'lodash';

import { getTrad } from '../../../../../translations';
import { useConfig, useContentTypes } from '../../../hooks';
import { useSettingsContext } from '../../../context';

const ALLOWED_POPULATE_TYPES = ['relation', 'media', 'component', 'dynamiczone'];

type KeyFieldsEntry = { key: string; fields: string[] };

const findByKey = (arr: KeyFieldsEntry[], key: string): string[] => {
  return arr.find((item) => item.key === key)?.fields ?? [];
};

const updateByKey = (
  arr: KeyFieldsEntry[],
  key: string,
  fields: string[]
): KeyFieldsEntry[] => {
  let found = false;
  const updated = arr.map((item) => {
    if (item.key === key) {
      found = true;
      return { ...item, fields };
    }
    return item;
  });
  if (!found) {
    updated.push({ key, fields });
  }
  return updated;
};

export const ContentTypesSettings = () => {
  const contentTypesQuery = useContentTypes();
  const configQuery = useConfig();

  const { formatMessage } = useIntl();

  const { values, onChange, handleChange, restartStatus, renderError } = useSettingsContext();

  const {
    contentTypes: contentTypesCurrent,
    contentTypesNameFields: contentTypeNameFieldsCurrent,
  } = values;

  const configContentTypes = configQuery.data?.contentTypeItems;

  return (
    <Grid.Item col={12} s={12} xs={12}>
      {contentTypesCurrent?.length ? (
        <Accordion.Root style={{ width: '100%' }}>
          {contentTypeNameFieldsCurrent.map((nameFields, index) => {
            const ctKey = nameFields.key;
            const current = contentTypesQuery.data?.find(({ uid }) => uid === ctKey);
            const configCT = configContentTypes?.find((ct) => ct.uid === ctKey);
            const displayName = configCT?.label || current?.info.displayName;
            const schemaAttrs = configQuery.data?.contentTypesSchemas?.[ctKey];
            const attributes = (schemaAttrs ?? configCT?.attributes ?? current?.attributes ?? {}) as Record<string, any>;
            const attributeKeys = Object.keys(attributes).sort();
            const allowedFieldsToPopulate = attributeKeys.filter((key) =>
              ALLOWED_POPULATE_TYPES.includes(attributes[key]?.type)
            );

            const populateArr = get(values, 'contentTypesPopulate', []) as KeyFieldsEntry[];
            const populateFields = findByKey(populateArr, ctKey);

            const pathArr = get(values, 'pathDefaultFields', []) as KeyFieldsEntry[];
            const pathFields = findByKey(pathArr, ctKey);

            return (current || configCT) ? (
              <Accordion.Item key={ctKey} value={ctKey}>
                <Accordion.Header>
                  <Accordion.Trigger>
                    {displayName ??
                      formatMessage(getTrad('pages.settings.form.nameField.default'))}
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content>
                  <Grid.Root gap={4} padding={2}>
                    <Grid.Item col={12} s={12} xs={12}>
                      <Field
                        name={`contentTypesNameFields.${ctKey}`}
                        label={formatMessage(getTrad('pages.settings.form.nameField.label'))}
                        hint={formatMessage(
                          getTrad(
                            `pages.settings.form.nameField.${isEmpty(get(values, `contentTypesNameFields[${index}].fields`, [])) ? 'empty' : 'hint'}`
                          )
                        )}
                      >
                        <MultiSelect
                          name={`contentTypesNameFields.${ctKey}`}
                          placeholder={formatMessage(
                            getTrad('pages.settings.form.nameField.placeholder')
                          )}
                          value={get(values, `contentTypesNameFields[${index}].fields`)}
                          onChange={(value: Array<string>) => {
                            const updated = get(values, 'contentTypesNameFields', []).map(
                              (item: KeyFieldsEntry, i: number) => {
                                if (i === index) {
                                  return {
                                    ...item,
                                    fields: value,
                                  };
                                }
                                return item;
                              }
                            );

                            return handleChange('contentTypesNameFields', updated, onChange);
                          }}
                          disabled={restartStatus.required}
                          withTags
                        >
                          {attributeKeys.map((attribute) => (
                            <MultiSelectOption key={attribute} value={attribute}>
                              {attribute}
                            </MultiSelectOption>
                          ))}
                        </MultiSelect>
                      </Field>
                    </Grid.Item>
                    <Grid.Item col={12} s={12} xs={12}>
                      <Field
                        name={`contentTypesPopulate.${ctKey}`}
                        label={formatMessage(getTrad('pages.settings.form.populate.label'))}
                        hint={formatMessage(
                          getTrad(
                            `pages.settings.form.populate.${isEmpty(populateFields) ? 'empty' : 'hint'}`
                          )
                        )}
                      >
                        <MultiSelect
                          name={`contentTypesPopulate.${ctKey}`}
                          placeholder={formatMessage(
                            getTrad('pages.settings.form.populate.placeholder')
                          )}
                          value={populateFields}
                          onChange={(value: Array<string>) => {
                            const updated = updateByKey(populateArr, ctKey, value);
                            return handleChange('contentTypesPopulate', updated, onChange);
                          }}
                          disabled={restartStatus.required}
                          withTags
                        >
                          {allowedFieldsToPopulate.map((attribute) => (
                            <MultiSelectOption key={attribute} value={attribute}>
                              {attribute}
                            </MultiSelectOption>
                          ))}
                        </MultiSelect>
                      </Field>
                    </Grid.Item>
                    <Grid.Item col={12} s={12} xs={12}>
                      <Field
                        name={`pathDefaultFields.${ctKey}`}
                        label={formatMessage(
                          getTrad('pages.settings.form.pathDefaultFields.label')
                        )}
                        hint={formatMessage(
                          getTrad(
                            `pages.settings.form.pathDefaultFields.${isEmpty(pathFields) ? 'empty' : 'hint'}`
                          )
                        )}
                      >
                        <MultiSelect
                          name={`pathDefaultFields.${ctKey}`}
                          placeholder={formatMessage(
                            getTrad('pages.settings.form.pathDefaultFields.placeholder')
                          )}
                          value={pathFields}
                          onChange={(value: Array<string>) => {
                            const updated = updateByKey(pathArr, ctKey, value);
                            return handleChange('pathDefaultFields', updated, onChange);
                          }}
                          disabled={restartStatus.required}
                          withTags
                        >
                          {attributeKeys.map((attribute) => (
                            <MultiSelectOption key={attribute} value={attribute}>
                              {attribute}
                            </MultiSelectOption>
                          ))}
                        </MultiSelect>
                      </Field>
                    </Grid.Item>
                  </Grid.Root>
                </Accordion.Content>
              </Accordion.Item>
            ) : null;
          })}
        </Accordion.Root>
      ) : null}
    </Grid.Item>
  );
};
