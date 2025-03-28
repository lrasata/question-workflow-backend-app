import type { Schema, Struct } from '@strapi/strapi';

export interface SharedOptionValue extends Struct.ComponentSchema {
  collectionName: 'components_shared_option_values';
  info: {
    displayName: 'optionValue';
  };
  attributes: {
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'shared.option-value': SharedOptionValue;
    }
  }
}
