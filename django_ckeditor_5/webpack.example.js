'use strict';

const path = require( 'path' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
    // https://webpack.js.org/configuration/entry-context/
    entry: './static/django_ckeditor_5/exemple.js',
    //entry: './static/django_ckeditor_5/app.js',

    // https://webpack.js.org/configuration/output/
    output: {
        path: path.resolve( __dirname, 'static/django_ckeditor_5/dist' ),
        filename: 'bundle.js'
    },

    plugins: [
        new MiniCssExtractPlugin( {
            filename: 'styles.css'
        } )
    ],

    module: {
        rules: [
            {
                // Or /ckeditor5-[^/]+\/theme\/icons\/.+\.svg$/ if you want to limit this loader
                // to CKEditor 5 icons only.
                test: /\.svg$/,

                use: [ 'raw-loader' ]
            },
            {
                // Or /ckeditor5-[^/]+\/theme\/.+\.css$/ if you want to limit this loader
                // to CKEditor 5 theme only.
                test: /\.css$/,

                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: styles.getPostCssConfig( {
                            themeImporter: {
                                themePath: require.resolve( '@ckeditor/ckeditor5-theme-lark' )
                            },
                            minify: true
                        } )
                    }
                ]
            }
        ]
    },

    // Useful for debugging.
    devtool: 'source-map',

    // By default webpack logs warnings if the bundle is bigger than 200kb.
    performance: { hints: false }
};