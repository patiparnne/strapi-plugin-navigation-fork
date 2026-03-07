import {
  Box,
  Button,
  Checkbox,
  DesignSystemProvider,
  Flex,
  Grid,
  IconButton,
  Modal,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Typography,
} from '@strapi/design-system';
import { prop } from 'lodash/fp';
import React, { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { getFetchClient } from '@strapi/strapi/admin';
import { Upload } from '@strapi/icons';

import { getApiClient } from '../../../../../api';
import { getTrad } from '../../../../../translations';
import { useConfig, useLocale } from '../../../hooks';
import { Footer, FooterBase } from '../Footer';
import { INITIAL_NAVIGATION } from '../NewNavigation';
import { CommonProps, ListState, Navigation } from '../types';
import * as icons from './icons';

interface Props extends ListState, CommonProps { }

export const AllNavigations = ({ navigations, selected, setState }: Props) => {
  const configQuery = useConfig();

  const hasAnySelected = !!selected.length;

  const { formatMessage } = useIntl();

  const localeQuery = useLocale();

  const handleExport = (navigation: Navigation) => async () => {
    try {
      const fetch = getFetchClient();
      const apiClient = getApiClient(fetch);
      const result = await apiClient.exportNavigation(navigation.documentId);

      const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${navigation.slug || navigation.name}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const toggleSelected = useCallback(
    () =>
      setState({
        navigations,
        selected: hasAnySelected ? [] : navigations.map((n) => n),
        view: 'LIST',
      }),
    [setState, navigations, hasAnySelected]
  );

  const currentlySelectedSet = useMemo(() => new Set(selected.map(prop('documentId'))), [selected]);

  const handleSelect = (navigation: Navigation, isSelected: boolean) => () => {
    setState({
      navigations,
      selected: isSelected
        ? selected.filter(({ documentId }) => documentId !== navigation.documentId)
        : selected.concat([navigation]),
      view: 'LIST',
    });
  };

  const edit = (navigation: Navigation) => () => {
    setState({
      view: 'EDIT',
      current: navigation,
      navigation,
      alreadyUsedNames: navigations.reduce<string[]>(
        (acc, { name }) => (name !== navigation.name ? acc.concat([name]) : acc),
        []
      ),
    });
  };

  const _delete = (navigations: Array<Navigation>) => () => {
    setState({
      view: 'DELETE',
      navigations,
    });
  };

  const purgeCache = (navigations: Array<Navigation>) => () => {
    setState({
      view: 'CACHE_PURGE',
      navigations,
    });
  };

  const deleteSelected = useCallback(_delete(selected), [_delete]);

  const purgeSelected = useCallback(purgeCache(selected), [purgeCache]);

  const getLocalizations = (focused: Navigation) =>
    [focused].concat(
      navigations.filter(
        (navigation) =>
          navigation.documentId === focused.documentId && navigation.locale !== focused.locale
      )
    );

  return (
    <>

      <Grid.Root>
        <Grid.Item col={12} paddingBottom={3}>
          {hasAnySelected ? (
            <Flex direction="row" gap={1}>
              <Box paddingRight={3}>
                {formatMessage(getTrad('popup.navigation.manage.table.hasSelected'), {
                  count: selected.length,
                })}
              </Box>
              <Button onClick={deleteSelected} variant="tertiary">
                {formatMessage(getTrad('popup.navigation.manage.button.delete'))}
              </Button>
              {configQuery.data?.isCacheEnabled ? (
                <Button onClick={purgeSelected} variant="tertiary">
                  {formatMessage(getTrad('popup.navigation.manage.button.purge'))}
                </Button>
              ) : null}
            </Flex>
          ) : null}
        </Grid.Item>
      </Grid.Root>
      <Table rowCount={navigations.length} colCount={6}>
        <Thead>
          <Tr>
            <Th>
              <Checkbox onCheckedChange={toggleSelected} checked={hasAnySelected} />
            </Th>
            <Th>
              <Typography textColor="neutral800">
                {formatMessage(getTrad('popup.navigation.manage.table.id'))}
              </Typography>
            </Th>
            <Th>
              <Typography textColor="neutral800">
                {formatMessage(getTrad('popup.navigation.manage.table.name'))}
              </Typography>
            </Th>
            <Th>
              <Typography textColor="neutral800">
                {formatMessage(getTrad('popup.navigation.manage.table.locale'))}
              </Typography>
            </Th>
            <Th>
              <Typography textColor="neutral800">
                {formatMessage(getTrad('popup.navigation.manage.table.visibility'))}
              </Typography>
            </Th>
            <Th>
              {configQuery.data?.isCacheEnabled ? (
                <Flex direction="row">
                  <Box paddingLeft={1}>
                    <IconButton
                      onClick={purgeCache([])}
                      label={formatMessage(getTrad('popup.navigation.manage.button.purge'))}
                      // noBorder
                      children={icons.featherIcon}
                    />
                  </Box>
                </Flex>
              ) : null}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {navigations
            .filter(({ locale }) => locale === localeQuery.data?.defaultLocale)
            .map((navigation) => (
              <Tr key={navigation.documentId}>
                <Td>
                  <Checkbox
                    onCheckedChange={handleSelect(
                      navigation,
                      currentlySelectedSet.has(navigation.documentId)
                    )}
                    checked={currentlySelectedSet.has(navigation.documentId)}
                  />
                </Td>
                <Td>
                  <Typography textColor="neutral800">{navigation.documentId}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">{navigation.name}</Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {getLocalizations(navigation).map(prop('locale')).join(', ')}
                  </Typography>
                </Td>
                <Td>
                  <Typography textColor="neutral800">
                    {navigation.visible
                      ? formatMessage(getTrad('popup.navigation.manage.navigation.visible'))
                      : formatMessage(getTrad('popup.navigation.manage.navigation.hidden'))}
                  </Typography>
                </Td>
                <Td>
                  <Flex width="100%" direction="row" alignItems="center" justifyContent="flex-end">
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={handleExport(navigation)}
                        label={formatMessage(getTrad('popup.navigation.manage.button.export'))}
                        children={icons.downloadIcon}
                      />
                    </Box>
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={edit(navigation)}
                        label={formatMessage(getTrad('popup.navigation.manage.button.edit'))}
                        children={icons.edit}
                      />
                    </Box>
                    <Box paddingLeft={1}>
                      <IconButton
                        onClick={_delete([navigation])}
                        label={formatMessage(getTrad('popup.navigation.manage.button.delete'))}
                        children={icons.deleteIcon}
                      />
                    </Box>
                    {configQuery.data?.isCacheEnabled ? (
                      <Box paddingLeft={1}>
                        <IconButton
                          onClick={purgeCache([navigation])}
                          label={formatMessage(getTrad('popup.navigation.manage.button.purge'))}
                          // noBorder
                          children={icons.featherIcon}
                        />
                      </Box>
                    ) : null}
                  </Flex>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </>
    // <DesignSystemProvider>
    //   <Grid.Root>
    //     <Grid.Item col={12} paddingBottom={3}>
    //       {hasAnySelected ? (
    //         <Flex direction="row" gap={1}>
    //           <Box paddingRight={3}>
    //             {formatMessage(getTrad('popup.navigation.manage.table.hasSelected'), {
    //               count: selected.length,
    //             })}
    //           </Box>
    //           <Button onClick={deleteSelected} variant="tertiary">
    //             {formatMessage(getTrad('popup.navigation.manage.button.delete'))}
    //           </Button>
    //           {configQuery.data?.isCacheEnabled ? (
    //             <Button onClick={purgeSelected} variant="tertiary">
    //               {formatMessage(getTrad('popup.navigation.manage.button.purge'))}
    //             </Button>
    //           ) : null}
    //         </Flex>
    //       ) : null}
    //     </Grid.Item>
    //   </Grid.Root>
    //   <Table rowCount={navigations.length} colCount={6}>
    //     <Thead>
    //       <Tr>
    //         <Th>
    //           <Checkbox onCheckedChange={toggleSelected} checked={hasAnySelected} />
    //         </Th>
    //         <Th>
    //           <Typography textColor="neutral800">
    //             {formatMessage(getTrad('popup.navigation.manage.table.id'))}
    //           </Typography>
    //         </Th>
    //         <Th>
    //           <Typography textColor="neutral800">
    //             {formatMessage(getTrad('popup.navigation.manage.table.name'))}
    //           </Typography>
    //         </Th>
    //         <Th>
    //           <Typography textColor="neutral800">
    //             {formatMessage(getTrad('popup.navigation.manage.table.locale'))}
    //           </Typography>
    //         </Th>
    //         <Th>
    //           <Typography textColor="neutral800">
    //             {formatMessage(getTrad('popup.navigation.manage.table.visibility'))}
    //           </Typography>
    //         </Th>
    //         <Th>
    //           {configQuery.data?.isCacheEnabled ? (
    //             <Flex direction="row">
    //               <Box paddingLeft={1}>
    //                 <IconButton
    //                   onClick={purgeCache([])}
    //                   label={formatMessage(getTrad('popup.navigation.manage.button.purge'))}
    //                   // noBorder
    //                   children={icons.featherIcon}
    //                 />
    //               </Box>
    //             </Flex>
    //           ) : null}
    //         </Th>
    //       </Tr>
    //     </Thead>
    //     <Tbody>
    //       {navigations
    //         .filter(({ locale }) => locale === localeQuery.data?.defaultLocale)
    //         .map((navigation) => (
    //           <Tr key={navigation.documentId}>
    //             <Td>
    //               <Checkbox
    //                 onCheckedChange={handleSelect(
    //                   navigation,
    //                   currentlySelectedSet.has(navigation.documentId)
    //                 )}
    //                 checked={currentlySelectedSet.has(navigation.documentId)}
    //               />
    //             </Td>
    //             <Td>
    //               <Typography textColor="neutral800">{navigation.documentId}</Typography>
    //             </Td>
    //             <Td>
    //               <Typography textColor="neutral800">{navigation.name}</Typography>
    //             </Td>
    //             <Td>
    //               <Typography textColor="neutral800">
    //                 {getLocalizations(navigation).map(prop('locale')).join(', ')}
    //               </Typography>
    //             </Td>
    //             <Td>
    //               <Typography textColor="neutral800">
    //                 {navigation.visible
    //                   ? formatMessage(getTrad('popup.navigation.manage.navigation.visible'))
    //                   : formatMessage(getTrad('popup.navigation.manage.navigation.hidden'))}
    //               </Typography>
    //             </Td>
    //             <Td>
    //               <Flex width="100%" direction="row" alignItems="center" justifyContent="flex-end">
    //                 <Box paddingLeft={1}>
    //                   <IconButton
    //                     onClick={edit(navigation)}
    //                     label={formatMessage(getTrad('popup.navigation.manage.button.edit'))}
    //                     // noBorder
    //                     children={icons.edit}
    //                   />
    //                 </Box>
    //                 <Box paddingLeft={1}>
    //                   <IconButton
    //                     onClick={_delete([navigation])}
    //                     label={formatMessage(getTrad('popup.navigation.manage.button.delete'))}
    //                     // noBorder
    //                     children={icons.deleteIcon}
    //                   />
    //                 </Box>
    //                 {configQuery.data?.isCacheEnabled ? (
    //                   <Box paddingLeft={1}>
    //                     <IconButton
    //                       onClick={purgeCache([navigation])}
    //                       label={formatMessage(getTrad('popup.navigation.manage.button.purge'))}
    //                       // noBorder
    //                       children={icons.featherIcon}
    //                     />
    //                   </Box>
    //                 ) : null}
    //               </Flex>
    //             </Td>
    //           </Tr>
    //         ))}
    //     </Tbody>
    //   </Table>
    // </DesignSystemProvider>
  );
};

export const AllNavigationsFooter: Footer = ({
  onClose,
  state,
  setState,
  navigations,
  isLoading,
}) => {
  const { formatMessage } = useIntl();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    file.text().then((text) => {
      try {
        const json = JSON.parse(text);
        const navData = json as Record<string, unknown>;
        const importName = (navData.name as string) || '';
        const existingNames = navigations.map(({ name }) => name);
        const existingSlugs = navigations.map(({ slug }) => slug);
        const nameConflict = existingNames.includes(importName) || existingSlugs.includes(importName);

        setState({
          view: 'IMPORT',
          navigationData: navData,
          nameConflict,
          currentName: importName,
          alreadyUsedNames: existingNames,
        });
      } catch (error) {
        console.error('Invalid JSON file:', error);
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Modal.Footer>
      <Modal.Close>
        <Button onClick={() => onClose?.()} variant="tertiary" disabled={isLoading}>
          {formatMessage(getTrad('popup.item.form.button.cancel'))}
        </Button>
      </Modal.Close>
      <Flex gap={2}>
        <Button
          onClick={handleImportClick}
          variant="secondary"
          disabled={isLoading}
          startIcon={<Upload />}
        >
          {formatMessage(getTrad('popup.navigation.manage.button.import'))}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <Button
          onClick={() =>
            setState({
              view: 'CREATE',
              alreadyUsedNames: navigations.map(({ name }) => name),
              current: INITIAL_NAVIGATION,
            })
          }
          variant="default"
          disabled={isLoading}
        >
          {formatMessage(getTrad('popup.navigation.manage.button.create'))}
        </Button>
      </Flex>
    </Modal.Footer>
  );
};
