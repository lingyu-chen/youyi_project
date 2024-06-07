const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
    transpileDependencies: true,
    lintOnSave: false, //关闭语法检查
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:5000/',
                pathRewrite: { '^/api': '' }
                //ws: true, //用于支持websocket 默认为true
                //changeOrigin: true //用于控制请求头中的host值 默认为true
            },
        }
    },
    configureWebpack: (config) => {
        config.resolve.extensions.push('.ts'); // 添加ts扩展文件：引用ts文件的时候不用写后缀名
        config.module.rules.push({ // 使用ts-loader对ts/tsx文件打包编译
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/,
            options: {
                appendTsSuffixTo: [/\.vue$/], // ts编译器tsc不能识别.vue文件，所以在 .vue文件后加.ts后缀
            },
        });
    }
})