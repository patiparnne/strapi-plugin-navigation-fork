<div align="center" style="max-width: 10rem; margin: 0 auto">
  <img style="width: 150px; height: auto;" src="https://www.sensinum.com/img/open-source/strapi-plugin-navigation/logo.png" alt="Logo - Strapi Navigation plugin" />
</div>
<div align="center">
  <h1>Strapi - Navigation plugin (Fork)</h1>
  <p>A fork of <a href="https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation">strapi-plugin-navigation</a> with multi-language slug support, path structure customization, and import/export features</p>
  <a href="https://www.npmjs.org/package/strapi-plugin-navigation-fork">
    <img alt="npm version" src="https://img.shields.io/npm/v/strapi-plugin-navigation-fork?logo=npm">
  </a>
  <a href="https://www.npmjs.org/package/strapi-plugin-navigation-fork">
    <img src="https://img.shields.io/npm/dm/strapi-plugin-navigation-fork.svg" alt="Monthly download on NPM" />
  </a>
</div>

---

> **This is a fork** of the original [strapi-plugin-navigation](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation) by VirtusLab. It adds features that are not available in the upstream version. See [Fork Features](#-fork-features) below.

<div style="margin: 20px 0" align="center">
  <img style="width: 100%; height: auto;" src="https://www.sensinum.com/img/open-source/strapi-plugin-navigation/preview.png" alt="UI preview" />
</div>

Strapi Navigation Plugin provides a website navigation / menu builder feature for [Strapi Headless CMS](https://github.com/strapi/strapi) admin panel. Navigation has the possibility to control the audience and can be consumed by the website with different output structure renderers:

- Flat
- Tree (nested)
- RFR (ready for handling by Redux First Router)

### Table of Contents

1. [🍴 Fork Features](#-fork-features)
2. [💎 Versions](#-versions)
3. [✨ Features](#-features)
4. [⏳ Installation](#-installation)
5. [🖐 Requirements](#-requirements)
6. [🔧 Basic Configuration](#-configuration)
   - [Settings page](#in-v203-and-newer)
   - [Plugin file](#in-v202-and-older--default-configuration-state-for-v203-and-newer)
7. [🔧 GraphQL Configuration](#-gql-configuration)
8. [👤 RBAC](#-rbac)
9. [🔐 Authorization strategy](#-authorization-strategy)
10. [🕸️ Public API specification](#%EF%B8%8F-public-api-specification)
    - [REST API](#rest-api)
    - [GraphQL API](#graphql-api)
11. [🔌 Extensions](#-extensions)
12. [🌿 Model lifecycle hooks](#model-life-cycle-hooks)
13. [📦 Import / Export](#-import--export)
14. [🧩 Examples](#-examples)
15. [💬 FAQ](#-faq)
16. [🤝 Contributing](#-contributing-to-the-plugin)
17. [👨‍💻 Community support](#-community-support)

## 🍴 Fork Features

This fork extends the original plugin with the following features:

### Multi-language slug support

The original plugin generates slugs based on the navigation item title, which can cause issues when working with non-Latin languages or when you need locale-specific slugs. This fork **unlocks slug editing** so you can:

- **Manually set slugs** per language/locale instead of relying on auto-generated values
- **Use transliterated or custom slugs** for non-Latin scripts (e.g. Thai, Chinese, Arabic)
- **Maintain consistent URL structures** across different locales

### Path structure customization

Gives you more control over the path structure of navigation items:

- **Override auto-generated paths** with custom values
- **Define locale-aware path patterns** that match your site's URL strategy
- **Support flexible path hierarchies** independent of the navigation tree structure

### Import / Export

Easily migrate and back up your navigation structures:

- **Export** full navigation trees (including all items, relations, and locale variants) as JSON
- **Import** navigation structures from JSON to quickly set up or restore navigations
- **Transfer navigations** between environments (e.g. staging to production)

## 💎 Versions

This fork is based on **v3.x** of the original plugin and targets **Strapi v5**.

- **This fork** - [strapi-plugin-navigation-fork](https://github.com/patiparnne/strapi-plugin-navigation-fork)
- **Original plugin (Strapi v5)** - [v3.x](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation)
- **Original plugin (Strapi v4)** - [v2.x](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation/tree/strapi-v4)

## ✨ Features

- **Navigation Public API:** Simple and ready for use API endpoint for consuming the navigation structure you've created
- **Visual builder:** Elegant and easy to use visual builder
- **Any Content Type relation:** Navigation can by linked to any of your Content Types by default. Simply, you're controlling it and also limiting available content types by configuration props
- **Different types of navigation items:** Create navigation with items linked to internal types, to external links or wrapper elements to keep structure clean
- **Multiple navigations:** Create as many Navigation containers as you want, setup them and use in the consumer application
- **Light / Dark mode compatible:** By design we're supporting Strapi ☀️ Light / 🌙 Dark modes
- **Webhooks integration:** Changes to navigation will trigger 'entry.update' or 'entry.create' webhook events.
- **Customizable:** Possibility to customize the options like: available Content Types, Maximum level for "attach to menu", Additional fields (audience)

## ⏳ Installation

### Via Strapi Marketplace

As a ✅ **verified** plugin by Strapi team we're available on the [**Strapi Marketplace**](https://market.strapi.io/plugins/strapi-plugin-navigation) as well as **In-App Marketplace** where you can follow the installation instructions.

<div style="margin: 20px 0" align="center">
  <img style="width: 100%; height: auto;" src="https://www.sensinum.com/img/open-source/strapi-plugin-navigation/marketplace.png" alt="Strapi In-App Marketplace" />
</div>

### Via command line

It's recommended to use **yarn** to install this plugin within your Strapi project. [You can install yarn with these docs](https://yarnpkg.com/lang/en/docs/install/).

```bash
yarn add strapi-plugin-navigation-fork@latest
```

Or with npm:

```bash
npm install strapi-plugin-navigation-fork@latest
```

After successful installation you've to re-build your Strapi instance. To archive that simply use:

```bash
yarn build
yarn develop
```

The **UI Navigation** plugin should appear in the **Plugins** section of Strapi sidebar after you run app again.

You can manage your multiple navigation containers by going to the **Navigation** manage view by clicking "Manage" button.

<div style="margin: 20px 0" align="center">
  <img style="width: 100%; height: auto;" src="https://www.sensinum.com/img/open-source/strapi-plugin-navigation/manager-view.png" alt="Navigation Manager View" />
</div>

As a next step you must configure your the plugin by the way you want to. See [**Configuration**](#🔧-configuration) section.

All done. Enjoy 🎉

## 🖐 Requirements

Complete installation requirements are exact same as for Strapi itself and can be found in the documentation under <a href="https://docs.strapi.io/dev-docs/installation/cli#preparing-the-installation">Installation Requirements</a>.

**Supported Strapi versions**:

- Strapi v5.10.3 (recently tested)
- Strapi v5.x

> This plugin is designed for **Strapi v5** and is not working with v4.x. To get version for **Strapi v4** install version [v4.x](https://github.com/VirtusLab-Open-Source/strapi-plugin-navigation/tree/strapi-v4).

**We recommend always using the latest version of Strapi to start your new projects**.

## 🔧 Configuration

To start your journey with **Navigation plugin** you must first setup it using the dedicated Settings page or for any version, put your configuration in `config/plugins.{js|ts}`. Anyway we're recommending the click-through option where your configuration is going to be properly validated.

### Settings page

On the dedicated page, you will be able to set up all crucial properties which drive the plugin and customize each individual collection for which **Navigation plugin** should be enabled.

<div style="margin: 20px 0" align="center">
  <img style="width: 100%; height: auto;" src="https://www.sensinum.com/img/open-source/strapi-plugin-navigation/configuration.png" alt="Plugin configuration" />
</div>

> _Note_
> The default configuration for your plugin is fetched from `config/plugins.js` or, if the file is not there, directly from the plugin itself. If you would like to customize the default state to which you might revert, please follow the next section.

### File

Config for this plugin is stored as a part of the `config/plugins.{js|ts}` or `config/<env>/plugins.{js|ts}` file. You can use the following snippet to make sure that the config structure is correct. If you've got already configurations for other plugins stores by this way, you can use the `navigation` along with them.

```ts
    module.exports = ({ env }) => ({
        // ...
        navigation: {
            enabled: true,
            config: {
                additionalFields: ['audience', { name: 'my_custom_field', type: 'boolean', label: 'My custom field' }],
                contentTypes: ['api::page.page'],
                defaultContentTypes: 'api::page.page',
                contentTypesNameFields: {
                    'api::page.page': ['title']
                },
                pathDefaultFields: {
                    'api::page.page': ['slug']
                },
                allowedLevels: 2,
                gql: {...},
            }
        }
    });
```

### Properties

- `additionalFields` - Additional fields for navigation items. More **[ here ](#additional-fields)**
- `allowedLevels` - Maximum level for which you're able to mark item as "Menu attached"
- `contentTypes` - UIDs of related content types
- `defaultContentTypes` - UID of content type that will be selected by default while creating a new navigation item
- `contentTypesNameFields` - Definition of content type title fields like `'api::<collection name>.<content type name>': ['field_name_1', 'field_name_2']`, if not set titles are pulled from fields like `['title', 'subject', 'name']`. **TIP** - Proper content type uid you can find in the URL of Content Manager where you're managing relevant entities like: `admin/content-manager/collectionType/< THE UID HERE >?page=1&pageSize=10&sort=Title:ASC&plugins[i18n][locale]=en`
- `pathDefaultFields` - The attribute to copy the default path from per content type. Syntax: `'api::<collection name>.<content type name>': ['url_slug', 'path']`
- `gql` - If you're using GraphQL that's the right place to put all necessary settings. More **[ here ](#gql-configuration)**
- `cascadeMenuAttached` - If you don't want "Menu attached" to cascade on child items set this value `Disabled`.

### Properties

### Additional Fields

It is advised to configure additional fields through the plugin's Settings Page. There you can find the table of custom fields and toggle input for the audience field. When enabled, the audience field can be customized through the content manager. Custom fields can be added, edited, toggled, and removed with the use of the table provided on the Settings Page. When removing custom fields be advised that their values in navigation items will be lost. Disabling the custom fields will not affect the data and can be done with no consequence of loosing information.

Creating configuration for additional fields with the `config.(js|ts)` file should be done with caution. Config object contains the `additionalFields` property of type `Array<CustomField | 'audience'>`, where CustomField is of type

```ts
type CustomField =
  | {
      type: 'string' | 'boolean' | 'media';
      name: string;
      label: string;
      description?: string;
      placeholder?: string;
      required?: boolean;
      enabled?: boolean;
    }
  | {
      type: 'select';
      name: string;
      label: string;
      description?: string;
      placeholder?: string;
      multi: boolean;
      options: string[];
      required?: boolean;
      enabled?: boolean;
    };
```

When creating custom fields be advised that the `name` property has to be unique. When editing a custom field it is advised not to edit its `name` and `type` properties. After config has been restored the custom fields that are not present in `config.js` file will be deleted and their values in navigation items will be lost.

## 🔧 GQL Configuration

Using navigation with GraphQL requires both plugins to be installed and working. You can find installation guide for GraphQL plugin **[here](https://docs.strapi.io/dev-docs/plugins/graphql#graphql)**. To properly configure GQL to work with navigation you should provide `gql` prop. This should contain union types that will be used to define GQL response format for your data while fetching:

> **Important!**
> If you're using `config/plugins.js` to configure your plugins , please put `navigation` property before `graphql`. Otherwise types are not going to be properly added to GraphQL Schema. That's because of dynamic types which base on plugin configuration which are added on `bootstrap` stage, not `register`. This is not valid if you're using `graphql` plugin without any custom configuration, so most of cases in real.

```gql
master: Int
items: [NavigationItem]
related: NavigationRelated
```

This prop should look as follows:

```ts
gql: {
    navigationItemRelated: ['<your GQL related content types>'],
},
```

for example:

```ts
gql: {
    navigationItemRelated: ['Page', 'UploadFile'],
},
```

where `Page` and `UploadFile` are your type names for the **Content Types** you're referring by navigation items relations.

## 👤 RBAC

Plugin provides granular permissions based on **Strapi RBAC** functionality within the editorial interface &amp; **Admin API**. Those settings are editable via the _Setings_ -> _Administration Panel_ -> _Roles_.

For any role different than **Super Admin**, to access the **Navigation panel** you must set following permissions:

### Mandatory permissions

- _Plugins_ -> _Navigation_ -> _Read_ - gives you the access to **Navigation Panel**

### Other permissions

- _Plugins_ -> _Navigation_ -> _Update_ - with this permission user is able to change Navigation structure
- _Plugins_ -> _Navigation_ -> _Settings_ - special permission for users that should be able to change plugin settings

## 🔐 Authorization strategy

Is applied for **Public API** both for REST and GraphQL. You can manage is by two different ways. Those settings are editable via the _Setings_ -> _Users &amp; Permissions Plugin_ -> _Roles_.

## User based

- _Public_ - as per description it's default role for any not authenticated user. By enabling **Public API** of the plugin here you're making it **fully public**, without **any permissions check**.
- _Authenticated_ - as per description this is default role for Strapi Users. If you enable **Public API** here, for any call made you must use the User authentication token as `Bearer <token>`.

## Token based

- _Full Access_ - gives full access to every Strapi Content API including our plugin endpoints as well.
- _Custom_ - granural access management to every Strapi Content API endpoints as well as plugin **Public API** - _(recomended approach)_

> _Note: Token usage &amp Read-Only tokens_
> If you're aiming to use token based approach, for every call you must provide proper token in headers as `Bearer <token>`.
>
> Important: As the Read-Only tokens are dedicated to support just `find` and `findAll` endpoints from Strapi Content API, they are not covering access to plugin **Public API** `render` and `renderChild` endpoints. We recommend to use the `Custom` token type for fully granural and secured approach instead of `Full Access` ones.
>
> Reference: [Strapi - API Tokens](https://docs.strapi.io/dev-docs/configurations/api-tokens#usage)

## Base Navigation Item model

### Flat

```json
{
  "id": 1,
  "documentId": "njx99iv4p4txuqp307ye8625",
  "title": "News",
  "type": "INTERNAL",
  "path": "news",
  "externalPath": null,
  "uiRouterKey": "News",
  "menuAttached": false,
  "parent": 8, // Parent Navigation Item 'id', null in case of root level
  "master": 1, // Navigation 'id'
  "createdAt": "2020-09-29T13:29:19.086Z",
  "updatedAt": "2020-09-29T13:29:19.128Z",
  "related": {
    /*<Content Type model >*/
  },
  "audience": []
}
```

### Tree

```json
{
  "title": "News",
  "menuAttached": true,
  "path": "/news",
  "type": "INTERNAL",
  "uiRouterKey": "news",
  "slug": "benefits",
  "external": false,
  "related": {
    // <Content Type model >
  },
  "items": [
    {
      "title": "External url",
      "menuAttached": true,
      "path": "http://example.com",
      "type": "EXTERNAL",
      "uiRouterKey": "generic",
      "external": true
    }
    //  < Tree Navigation Item models >
  ]
}
```

### RFR

```json
{
  "id": "News",
  "title": "News",
  "related": {
    "contentType": "page",
    "collectionName": "pages",
    "id": 1
  },
  "path": "/news",
  "slug": "news",
  "parent": null, // Parent Navigation Item 'id', null in case of root level
  "menuAttached": true
}
```

## 🕸️ Public API specification

Plugin supports both **REST API** and **GraphQL API** exposed by Strapi.

**Query Params**

- `navigationIdOrSlug` - ID or slug for which your navigation structure is generated like for REST API:

  > `https://localhost:1337/api/navigation/render/njx99iv4p4txuqp307ye8625` > `https://localhost:1337/api/navigation/render/main-menu`

- `type` - Enum value representing structure type of returned navigation:

  > `https://localhost:1337/api/navigation/render/njx99iv4p4txuqp307ye8625?type=FLAT`

- `menu` (`menuOnly` for GQL) - Boolean value for querying only navigation items that are attached to menu should be rendered eg.

  > `https://localhost:1337/api/navigation/render/njx99iv4p4txuqp307ye8625?menu=true`

- `path` - String value for querying navigation items by its path:

  > `https://localhost:1337/api/navigation/render/njx99iv4p4txuqp307ye8625?path=/home/about-us`

- `status` - Enum value representing the status of the related entity that should be returned. Can be set to `draft` or `published`. The default value is `published`:

  > `https://localhost:1337/api/navigation/render/njx99iv4p4txuqp307ye8625?status=draft`

### REST API

`GET <host>/api/navigation/?locale=<locale>&orderBy=<orderBy>&orderDirection=<orderDirection>`

NOTE: All params are optional

**Example URL**: `https://localhost:1337/api/navigation?locale=en`

**Example response body**

```json
[
  {
    "id": 383,
    "documentId": "njx99iv4p4txuqp307ye8625",
    "name": "Floor",
    "slug": "floor-pl",
    "visible": true,
    "createdAt": "2023-09-29T12:45:54.399Z",
    "updatedAt": "2023-09-29T13:44:08.702Z",
    "locale": "pl"
  },
  {
    "id": 384,
    "documentId": "njx99iv4p4txuqp307ye8625",
    "name": "Floor",
    "slug": "floor-fr",
    "visible": true,
    "createdAt": "2023-09-29T12:45:54.399Z",
    "updatedAt": "2023-09-29T13:44:08.725Z",
    "locale": "fr"
  },
  {
    "id": 382,
    "documentId": "njx99iv4p4txuqp307ye8625",
    "name": "Floor",
    "slug": "floor",
    "visible": true,
    "createdAt": "2023-09-29T12:45:54.173Z",
    "updatedAt": "2023-09-29T13:44:08.747Z",
    "locale": "en"
  },
  {
    "id": 374,
    "documentId": "njx99iv4p4txuqp307ye8625",
    "name": "Main navigation",
    "slug": "main-navigation-pl",
    "visible": true,
    "createdAt": "2023-09-29T12:22:30.373Z",
    "updatedAt": "2023-09-29T13:44:08.631Z",
    "locale": "pl"
  },
  {
    "id": 375,
    "documentId": "njx99iv4p4txuqp307ye8625",
    "name": "Main navigation",
    "slug": "main-navigation-fr",
    "visible": true,
    "createdAt": "2023-09-29T12:22:30.373Z",
    "updatedAt": "2023-09-29T13:44:08.658Z",
    "locale": "fr"
  },
  {
    "id": 373,
    "documentId": "njx99iv4p4txuqp307ye8625",
    "name": "Main navigation",
    "slug": "main-navigation",
    "visible": true,
    "createdAt": "2023-09-29T12:22:30.356Z",
    "updatedAt": "2023-09-29T13:44:08.680Z",
    "locale": "en"
  }
]
```

`GET <host>/api/navigation/render/<navigationIdOrSlug>?type=<type>`

Return a rendered navigation structure depends on passed type (`TREE`, `RFR` or nothing to render as `FLAT`).

**Example URL**: `https://localhost:1337/api/navigation/render/njx99iv4p4txuqp307ye8625`

**Example response body**

```json
[
  {
    "id": 1,
    "documentId": "njx99iv4p4txuqp307ye8625",
    "title": "News",
    "type": "INTERNAL",
    "path": "news",
    "externalPath": null,
    "uiRouterKey": "News",
    "menuAttached": false,
    "parent": null,
    "master": 1,
    "created_at": "2020-09-29T13:29:19.086Z",
    "updated_at": "2020-09-29T13:29:19.128Z",
    "related": {
      "__contentType": "Page",
      "id": 1,
      "documentId": "njx99iv4p4txuqp307ye8625",
      "title": "News"
      // ...
    }
  }
  // ...
]
```

**Example URL**: `https://localhost:1337/api/navigation/render/njx99iv4p4txuqp307ye8625?type=TREE`

**Example response body**

```json
[
  {
    "title": "News",
    "menuAttached": true,
    "path": "/news",
    "type": "INTERNAL",
    "uiRouterKey": "news",
    "slug": "benefits",
    "external": false,
    "related": {
      "__contentType": "Page",
      "id": 1,
      "title": "News"
      // ...
    },
    "items": [
      {
        "title": "External url",
        "menuAttached": true,
        "path": "http://example.com",
        "type": "EXTERNAL",
        "uiRouterKey": "generic",
        "external": true
      }
      // ...
    ]
  }
  // ...
]
```

**Example URL**: `https://localhost:1337/api/navigation/render/njx99iv4p4txuqp307ye8625?type=RFR`

**Example response body**

```json
{
  "pages": {
    "News": {
      "id": "News",
      "title": "News",
      "related": {
        "contentType": "page",
        "collectionName": "pages",
        "id": 1
      },
      "path": "/news",
      "slug": "news",
      "parent": null,
      "menuAttached": true
    },
    "Community": {
      "id": "Community",
      "title": "Community",
      "related": {
        "contentType": "page",
        "collectionName": "pages",
        "id": 2
      },
      "path": "/community",
      "slug": "community",
      "parent": null,
      "menuAttached": true
    },
    "Highlights": {
      "id": "Highlights",
      "title": "Highlights",
      "related": {
        "contentType": "page",
        "collectionName": "pages",
        "id": 3
      },
      "path": "/community/highlights",
      "slug": "community-highlights",
      "parent": "Community",
      "menuAttached": false
    }
    // ...
  },
  "nav": {
    "root": [
      {
        "label": "News",
        "type": "internal",
        "page": "News"
      },
      {
        "label": "Community",
        "type": "internal",
        "page": "Community"
      },
      {
        "label": "External url",
        "type": "external",
        "url": "http://example.com"
      }
      // ...
    ],
    "Community": [
      {
        "label": "Highlights",
        "type": "internal",
        "page": "Highlights"
      }
      // ...
    ]
    // ...
  }
}
```

### GraphQL API

Same as [**REST API**](#rest-api) returns a rendered navigation structure depends on passed type (`TREE`, `RFR` or nothing to render as `FLAT`).

**Example request**

```graphql
query {
  renderNavigation(navigationIdOrSlug: "main-navigation", type: TREE, menuOnly: false) {
    id
    title
    path
    related {
      id
      __typename

      ... on Page {
        Title
      }

      ... on WithFlowType {
        Name
      }
    }
    items {
      id
      title
      path
      related {
        id
        __typename

        ... on Page {
          Title
        }

        ... on WithFlowType {
          Name
        }
      }
    }
  }
}
```

**Example response**

```json
{
  "data": {
    "renderNavigation": [
      {
        "id": 8,
        "title": "Test page",
        "path": "/test-path",
        "related": {
          "id": 3,
          "__typename": "WithFlowType",
          "Name": "Test"
        },
        "items": [
          {
            "id": 11,
            "title": "Nested",
            "path": "/test-path/nested-one",
            "related": {
              "id": 1,
              "__typename": "Page",
              "Title": "Eg. Page title"
            }
          }
        ]
      },
      {
        "id": 10,
        "title": "Another page",
        "path": "/another",
        "related": {
          "__typename": "Page",
          "Title": "Eg. Page title"
        },
        "items": []
      }
    ]
  }
}
```

## 🔌 Extensions

### Server-side schema

On bootstrap you can customise Zod validators. Not all schemas are available at the moment, consult `CommonService` to see all available updaters.

Example:

```ts
const navigationCommonService = strapi.plugin('navigation').service('common');

navigationCommonService.updateUpdateNavigationSchema((schema: ZodObject) => {
  return schema.refine(
    (data) => {
      if (!data.visible) {
        return false;
      }

      return true;
    },
    { message: 'Hidden navigation updated.' }
  );
});
```

### Slug generation

Slug generation is available as a controller and service. If you have custom requirements outside of what this plugin provides you can add your own logic with [plugins extensions](https://docs.strapi.io/developer-docs/latest/development/plugins-extension.html).

For example:

```ts
// path: /admin/src/index.js

module.exports = {
  // ...
  bootstrap({ strapi }) {
    const navigationCommonService = strapi.plugin('navigation').service('common');
    const originalGetSlug = navigationCommonService.getSlug;
    const preprocess = (q) => {
      return q + 'suffix';
    };

    navigationCommonService.getSlug = (query) => {
      return originalGetSlug(preprocess(query));
    };
  },
};
```

## Model lifecycle hooks

Navigation plugin allows to register lifecycle hooks for `Navigation` and `NavigationItem` content types.

You can read more about lifecycle hooks [here](https://docs.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks). (You can set a listener for all of the hooks).

Lifecycle hooks can be register either in `register()` or `bootstrap()` methods of your server. You can register more than one listener for a specified lifecycle hook. For example: you want to do three things on navigation item creation and do not want to handle all of these actions in one big function. You can split logic in as many listeners as you want.

Listeners can by sync and `async`.

> Be aware that lifecycle hooks registered in `register()` may be fired by plugin's bootstrapping. If you want listen to events triggered after server's startup use `bootstrap()`.

Example:

```ts
const navigationCommonService = strapi.plugin('navigation').service('common');

navigationCommonService.registerLifecycleHook({
  callback: async ({ action, result }) => {
    const saveResult = await logIntoSystem(action, result);

    console.log(saveResult);
  },
  contentTypeName: 'navigation',
  hookName: 'afterCreate',
});

navigationCommonService.registerLifecycleHook({
  callback: async ({ action, result }) => {
    const saveResult = await logIntoSystem(action, result);

    console.log(saveResult);
  },
  contentTypeName: 'navigation-item',
  hookName: 'afterCreate',
});
```

## 📦 Import / Export

This fork adds the ability to import and export navigation structures as JSON.

### Export

Export a full navigation tree (including all items, relations, and locale variants) via the admin API:

```
GET /api/navigation/export/<navigationIdOrSlug>
```

Returns a JSON representation of the navigation that can be saved as a file and used for backup or migration.

### Import

Import a previously exported navigation structure:

```
POST /api/navigation/import
Content-Type: application/json

{
  "data": { /* exported navigation JSON */ }
}
```

This will create or update the navigation and all its items based on the imported data. Useful for:

- **Environment migration** — move navigations from staging to production
- **Backup & restore** — keep versioned snapshots of your navigation structures
- **Bulk setup** — quickly bootstrap navigations across multiple Strapi instances

## 🧩 Examples

Live example of plugin usage can be found in the [VirtusLab Strapi Examples](https://github.com/VirtusLab/strapi-examples/tree/master/strapi-plugin-navigation) repository.

## 💬 FAQ

### GraphQL tricks

**Q:** I would like to use GraphQL schemas but I'm not getting `renderNavigation` query or even proper types as Navigation, NavigationItem etc. What should I do?

**A:** There is a one trick you might try. Strapi by default is ordering plugins by the way which takes `strapi-plugin-graphql` to initialize earlier than other plugins so types might not be injected. If you don't have it yet, please create `config/plugins.{js|ts}` file and put there following lines (put `graphql` at the end):

```ts
module.exports = {
  navigation: { enabled: true },
  graphql: { enabled: true },
};
```

If you already got it, make sure that `navigation` plugin is inserted before `graphql`. That should do the job.

## 🤝 Contributing to the plugin

### How to start?

Feel free to fork and make a Pull Request to this plugin project. All the input is warmly welcome!

1. Clone repository

   ```
   git clone git@github.com:patiparnne/strapi-plugin-navigation-fork.git
   ```

2. Run `install` & `watch:link` command

   ```ts
   // Install all dependencies
   yarn install

   // Watch for file changes using `plugin-sdk` and follow the instructions provided by this official Strapi developer tool
   yarn watch:link
   ```

3. Within the Strapi project, modify `config/plugins.{js|ts}` for `imgix`

```ts
//...
'navigation': {
  enabled: true,
  //...
}
//...
```

4. Run your Strapi instance

### :octocat: Core team

[@CodeVoyager](https://github.com/CodeVoyager) [@cyp3rius](https://github.com/cyp3rius)

### 🌟 Strapi Community

[@jorrit](https://github.com/jorrit)

## 👨‍💻 Community support

For general help using Strapi, please refer to [the official Strapi documentation](https://strapi.io/documentation/). For additional help, you can use one of these channels to ask a question:

- [Discord](https://discord.strapi.io/) We're present on official Strapi Discord workspace. Find us by `[VirtusLab]` prefix and DM.
- [Slack - VirtusLab Open Source](https://virtuslab-oss.slack.com) We're present on a public channel #strapi-molecules
- [GitHub](https://github.com/VirtusLab/strapi-plugin-navigation/issues) (Bug reports, Contributions, Questions and Discussions)
- [E-mail](mailto:strapi@virtuslab.com) - we will respond back as soon as possible

## 📝 License

[MIT License](LICENSE.md) Copyright (c) [VirtusLab Sp. z o.o.](https://virtuslab.com/) &amp; [Strapi Solutions](https://strapi.io/).
Fork maintained by [Patiparnne](https://github.com/patiparnne).

## 🙏 Acknowledgements

This fork is based on the excellent work by the [VirtusLab](https://github.com/VirtusLab-Open-Source) team and the Strapi community. All original credit goes to them.