const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        port: 8888,
        // 设置代理
        proxy: {
            // 代理的根路径
            "/": {
                target: "http://localhost:9090/",
                // 是否开启根路径转换
                changeOrigin: true,
                ws: false,
            },
        },
    },
    transpileDependencies: [
        /\bvue-awesome\b/
    ]
});