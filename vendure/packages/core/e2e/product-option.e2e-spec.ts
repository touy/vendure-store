import gql from 'graphql-tag';
import path from 'path';

import { omit } from '../../common/lib/omit';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import {
    CreateProductOption,
    CreateProductOptionGroup,
    LanguageCode,
    ProductOptionGroupFragment,
    UpdateProductOption,
    UpdateProductOptionGroup,
} from './graphql/generated-e2e-admin-types';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

// tslint:disable:no-non-null-assertion

describe('ProductOption resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();
    let sizeGroup: ProductOptionGroupFragment;
    let mediumOption: CreateProductOption.CreateProductOption;

    beforeAll(async () => {
        const token = await server.init({
            customerCount: 1,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('createProductOptionGroup', async () => {
        const { createProductOptionGroup } = await client.query<
            CreateProductOptionGroup.Mutation,
            CreateProductOptionGroup.Variables
        >(CREATE_PRODUCT_OPTION_GROUP, {
            input: {
                code: 'size',
                translations: [
                    { languageCode: LanguageCode.en, name: 'Size' },
                    { languageCode: LanguageCode.de, name: 'Größe' },
                ],
                options: [
                    {
                        code: 'small',
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Small' },
                            { languageCode: LanguageCode.de, name: 'Klein' },
                        ],
                    },
                    {
                        code: 'large',
                        translations: [
                            { languageCode: LanguageCode.en, name: 'Large' },
                            { languageCode: LanguageCode.de, name: 'Groß' },
                        ],
                    },
                ],
            },
        });

        expect(omit(createProductOptionGroup, ['options', 'translations'])).toEqual({
            id: 'T_3',
            name: 'Size',
            code: 'size',
        });
        sizeGroup = createProductOptionGroup;
    });

    it('updateProductOptionGroup', async () => {
        const { updateProductOptionGroup } = await client.query<
            UpdateProductOptionGroup.Mutation,
            UpdateProductOptionGroup.Variables
        >(UPDATE_PRODUCT_OPTION_GROUP, {
            input: {
                id: sizeGroup.id,
                translations: [
                    { id: sizeGroup.translations[0].id, languageCode: LanguageCode.en, name: 'Bigness' },
                ],
            },
        });

        expect(updateProductOptionGroup.name).toBe('Bigness');
    });

    it(
        'createProductOption throws with invalid productOptionGroupId',
        assertThrowsWithMessage(async () => {
            const { createProductOption } = await client.query<
                CreateProductOption.Mutation,
                CreateProductOption.Variables
            >(CREATE_PRODUCT_OPTION, {
                input: {
                    productOptionGroupId: 'T_999',
                    code: 'medium',
                    translations: [
                        { languageCode: LanguageCode.en, name: 'Medium' },
                        { languageCode: LanguageCode.de, name: 'Mittel' },
                    ],
                },
            });
        }, 'No ProductOptionGroup with the id \'999\' could be found'),
    );

    it('createProductOption', async () => {
        const { createProductOption } = await client.query<
            CreateProductOption.Mutation,
            CreateProductOption.Variables
        >(CREATE_PRODUCT_OPTION, {
            input: {
                productOptionGroupId: sizeGroup.id,
                code: 'medium',
                translations: [
                    { languageCode: LanguageCode.en, name: 'Medium' },
                    { languageCode: LanguageCode.de, name: 'Mittel' },
                ],
            },
        });

        expect(omit(createProductOption, ['translations'])).toEqual({
            id: 'T_7',
            groupId: sizeGroup.id,
            code: 'medium',
            name: 'Medium',
        });
        mediumOption = createProductOption;
    });

    it('updateProductOption', async () => {
        const { updateProductOption } = await client.query<UpdateProductOption.Mutation, UpdateProductOption.Variables>(UPDATE_PRODUCT_OPTION, {
            input: {
                id: 'T_7',
                translations: [
                    { id: mediumOption.translations[0].id, languageCode: LanguageCode.en, name: 'Middling' },
                ],
            },
        });

        expect(updateProductOption.name).toBe('Middling');
    });
});

const PRODUCT_OPTION_GROUP_FRAGMENT = gql`
    fragment ProductOptionGroup on ProductOptionGroup {
        id
        code
        name
        options {
            id
            code
            name
        }
        translations {
            id
            languageCode
            name
        }
    }
`;

const CREATE_PRODUCT_OPTION_GROUP = gql`
    mutation CreateProductOptionGroup($input: CreateProductOptionGroupInput!) {
        createProductOptionGroup(input: $input) {
            ...ProductOptionGroup
        }
    }
    ${PRODUCT_OPTION_GROUP_FRAGMENT}
`;

const UPDATE_PRODUCT_OPTION_GROUP = gql`
    mutation UpdateProductOptionGroup($input: UpdateProductOptionGroupInput!) {
        updateProductOptionGroup(input: $input) {
            ...ProductOptionGroup
        }
    }
    ${PRODUCT_OPTION_GROUP_FRAGMENT}
`;

const CREATE_PRODUCT_OPTION = gql`
    mutation CreateProductOption($input: CreateProductOptionInput!) {
        createProductOption(input: $input) {
            id
            code
            name
            groupId
            translations {
                id
                languageCode
                name
            }
        }
    }
`;

const UPDATE_PRODUCT_OPTION = gql`
    mutation UpdateProductOption($input: UpdateProductOptionInput!) {
        updateProductOption(input: $input) {
            id
            code
            name
            groupId
        }
    }
`;
