'use strict';

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');

const pkg = require('./package.json');

const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const bundleName = 'bundle';

const getDirectories = (source) => {
    return fs
        .readdirSync(source, { withFileTypes: true })
        .filter((dirent) => dirent.isDirectory())
        .map((dirent) => dirent.name);
};

const paths = {
    dist: path.resolve(__dirname, 'public/assets'),
    assets: path.resolve(__dirname, 'assets'),
    cms: path.resolve(__dirname, 'assets/cms'),
    src: path.resolve(__dirname, 'assets/src'),
};

const directories = getDirectories(paths.src);

const assets = {
    lib: path.join(paths.cms, 'lib'),
    admin: path.join(paths.cms, 'admin'),
    react: path.join(paths.cms, 'web/react'),
    vanilla: path.join(paths.cms, 'web/vanilla'),
    webpack: path.join(paths.cms, 'webpack'),
};

const src = _.reduce(
    directories,
    (acc, key) => ({
        ...acc,
        [key]: path.join(paths.src, key),
    }),
    {},
);

const entries = _.reduce(
    _.reduce(
        directories,
        (acc, key) => {
            const jsPath = path.join(src[key], 'js/index.js');
            const cssPath = path.join(src[key], 'css/index.scss');

            const pathes = [];

            if (fs.existsSync(jsPath)) pathes.push(jsPath);
            if (fs.existsSync(cssPath)) pathes.push(cssPath);

            if (pathes.length) {
                return { ...acc, [key]: pathes };
            }

            return acc;
        },
        {},
    ),
    (res, config, key) => {
        try {
            if (fs.existsSync(path.join(src[key], 'js/index.js'))) res[key] = config;
        } catch (err) {}

        return res;
    },
    {},
);

const aliases = {
    ..._.reduce(
        directories,
        (acc, key) => ({
            ...acc,
            [`src/${key}`]: src[key],
        }),
        {},
    ),
    lib: assets.lib,
    'cms-admin': assets.admin,
    'cms-react': assets.react,
    'cms-vanilla': assets.vanilla,
};

const webpackConfig = {
    mode: mode,
    entry: entries,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader?-url',
                    'postcss-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            data: `$env: ${mode};`,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader?-url', 'postcss-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.scss'],
        alias: aliases,
    },
    output: {
        path: paths.dist,
        publicPath: '/',
        filename: '[name]/' + bundleName + '.js',
    },
    plugins: [
        new CaseSensitivePathsPlugin(),
        new MiniCssExtractPlugin({
            filename: '[name]/' + bundleName + '.css',
            chunkFilename: '[name]/' + bundleName + '.[id].css',
        }),
        new WebpackNotifierPlugin({
            title: pkg.name,
            contentImage: path.join(assets.webpack, 'logo.png'),
            excludeWarnings: true,
            alwaysNotify: true,
            skipFirstNotification: false,
        }),
        new CleanWebpackPlugin(
            _.map(entries, (v, k) => path.join(paths.dist, k)),
            {
                root: path.resolve(__dirname),
                verbose: true,
            },
        ),
        new CircularDependencyPlugin({
            exclude: /a\.js|node_modules/,
            failOnError: true,
            allowAsyncCycles: false,
            cwd: process.cwd(),
        }),
    ],
    optimization: {
        minimizer: _.filter([
            new TerserPlugin({
                cache: true,
                extractComments: true,
                parallel: true,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorPluginOptions: {
                    preset: [
                        'default',
                        {
                            discardComments: { removeAll: true },
                            discardUnused: {},
                        },
                    ],
                },
            }),
        ]),
    },
    stats: {
        entrypoints: false,
    },
};

if (dev === true) {
    webpackConfig.devtool = 'eval-source-map';
}

module.exports = webpackConfig;
