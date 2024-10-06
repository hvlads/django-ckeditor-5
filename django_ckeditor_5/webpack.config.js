'use strict';

const path = require( 'path' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const { CKEditorTranslationsPlugin } = require( '@ckeditor/ckeditor5-dev-translations' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
    entry: './static/django_ckeditor_5/app.js',
    output: {
        path: path.resolve( __dirname, 'static/django_ckeditor_5/dist' ),
        filename: 'bundle.js'
    },

    plugins: [
        new CKEditorTranslationsPlugin( {
            // The main language that will be built into the main bundle.
            language: 'en',

            // Additional languages that will be emitted to the `outputDirectory`.
            // This option can be set to an array of language codes or `'all'` to build all found languages.
            // The bundle is optimized for one language when this option is omitted.
            additionalLanguages: 'all',

            // For more advanced options see https://github.com/ckeditor/ckeditor5-dev/tree/master/packages/ckeditor5-dev-translations.
        } ),
        new MiniCssExtractPlugin( {
            filename: 'styles.css'
        } ),
    ],

    module: {
        rules: [
            {
                test: /\.svg$/,

                use: [ 'raw-loader' ]
            },
            {
                test: /\.css$/,

                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: styles.getPostCssConfig( {
                                themeImporter: {
                                    themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                                },
                                minify: true
                            } )
                        }
                    }
                ]
            }
        ]
    },
    devtool: 'source-map',
    performance: { hints: false }
};
