import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { Flex, Grid, TextInput, Typography } from '@strapi/design-system';
import { Field } from '@sensinum/strapi-utils';

import { getTrad } from '../../../../../translations';
import { Footer, FooterBase } from '../Footer';
import { CommonProps, ImportState } from '../types';

interface Props extends ImportState, CommonProps {}

export const ImportNavigation = ({
  setState,
  navigationData,
  nameConflict,
  currentName,
  alreadyUsedNames,
  isLoading,
}: Props) => {
  const { formatMessage } = useIntl();
  const [name, setName] = useState(currentName);

  const nameInUse = alreadyUsedNames.includes(name);
  const nameError = nameInUse
    ? formatMessage(getTrad('popup.navigation.manage.import.name.conflict'))
    : name.length < 2
      ? formatMessage(getTrad('popup.navigation.manage.import.name.tooShort'))
      : undefined;

  const handleNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newName = e.target.value;
      setName(newName);

      setState({
        view: 'IMPORT',
        navigationData,
        nameConflict: alreadyUsedNames.includes(newName),
        currentName: newName,
        alreadyUsedNames,
        disabled: alreadyUsedNames.includes(newName) || newName.length < 2,
      });
    },
    [setState, navigationData, alreadyUsedNames]
  );

  return (
    <Grid.Root gap={5}>
      <Grid.Item col={12}>
        <Flex direction="column" alignItems="flex-start" gap={2} width="100%">
          {nameConflict && (
            <Typography variant="omega" textColor="warning600">
              {formatMessage(getTrad('popup.navigation.manage.import.name.conflictWarning'))}
            </Typography>
          )}
          <Field
            name="importName"
            label={formatMessage(getTrad('popup.navigation.manage.import.name.label'))}
            error={nameError}
          >
            <TextInput
              name="importName"
              type="string"
              value={name}
              onChange={handleNameChange}
              disabled={isLoading}
            />
          </Field>
        </Flex>
      </Grid.Item>
    </Grid.Root>
  );
};

export const ImportNavigationFooter: Footer = ({ onSubmit, onReset, disabled, isLoading }) => {
  const { formatMessage } = useIntl();

  return (
    <FooterBase
      start={{
        children: formatMessage(getTrad('popup.item.form.button.cancel')),
        variant: 'tertiary',
        disabled: isLoading,
        onClick: onReset,
      }}
      end={{
        children: formatMessage(getTrad('popup.navigation.manage.import.confirm')),
        variant: 'default',
        disabled: isLoading || disabled,
        onClick: onSubmit,
      }}
    />
  );
};
