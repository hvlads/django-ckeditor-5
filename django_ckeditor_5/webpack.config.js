'use strict';

const path = require( 'path' );
const { styles } = require( '@ckeditor/ckeditor5-dev-utils' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );

module.exports = {
    entry: './static/django_ckeditor_5/app.js',
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