// 方案1：使用 Promise.all()
const moduleUrls = [
    '/interactive-bar-chart.js',
    '/snow.js',
];

Promise.all(moduleUrls.map(url => import(url)))
    .then(modules => {
        modules.forEach((module, index) => {
            console.log(`Module ${moduleUrls[index]} loaded:`, module);
        });
    })
    .catch(error => {
        console.error('Failed to load one or more modules:', error);
    });

// 方案2：使用 async/await
// async function loadModules(urls) {
//     try {
//         const modules = await Promise.all(
//             urls.map(async (url) => {
//                 const module = await import(url);
//                 console.log(`Module ${url} loaded:`, module);
//                 return module;
//             })
//         );
//         return modules;
//     } catch (error) {
//         console.error('Failed to load one or more modules:', error);
//         throw error;
//     }
// }

// // 使用方式
// const urls = [
//     '/interactive-bar-chart.js',
//     '/other-module.js',
//     '/another-module.js'
// ];

// loadModules(urls).then(modules => {
//     // 使用加载的模块
//     modules.forEach((module, index) => {
//         // 处理每个模块
//     });
// });