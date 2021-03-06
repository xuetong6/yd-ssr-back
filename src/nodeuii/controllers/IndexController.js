 import { route, GET, POST, before } from 'awilix-koa';
 import { createBundleRenderer } from 'vue-server-renderer';
 import cheerio from 'cheerio';
 const fs = require("fs");
 const path = require("path");
 const LRU = require('lru-cache');
 @route('/')
 @route('/test')
 @route('/about')
 @route('/topics')
 @route('/video')
 export default class helloAPI {
     constructor({ indexService }) {
         this.indexService = indexService;
         this.metaDictionaries = {
             "index": {
                 title: "一等学堂学员学习系统",
                 meta: '<meta name="keywords" content=一等学堂学员学习系统>'
             }
         }
     }
     createRenderer(serverbundle, template, clientManifest) {
         return createBundleRenderer(serverbundle, {
             cache: LRU({
                 max: 10000
             }),
             runInNewContext: false,
             template,
             clientManifest
         });
     }
     @GET()
     async getIndex(ctx) {
         const rootPath = path.join(__dirname, '..');
         const serverBundle = require('../assets/vue-ssr-server-bundle.json');
         const clientManifest = require('../assets/vue-ssr-client-manifest.json');
         const template = fs.readFileSync(rootPath + '/assets/index.html', 'utf-8');

         /**
         * cheerio
         * nodejs的一个类jQuery库
         * 因为这块是ssr，所以肯定要拿到html文本，用cheerio操作更便捷
         */
        const $ = cheerio.load(template);
        $('title').html(this.metaDictionaries.index.title);
        $("head").append(this.metaDictionaries.index.meta);

         const context = { url: ctx.url };
         const ssrrender = this.createRenderer(serverBundle, $.html(), clientManifest);

         function createSsrStreamPromise() {
             return new Promise((resolve, reject) => {
                 if (!ssrrender) {
                     return ctx.body = 'waiting for compilation.. refresh in a moment.'
                 }
                 const ssrStream = ssrrender.renderToStream(context);

                 ctx.status = 200;
                 ctx.type = 'html';
                 ssrStream.on('error', err =>{reject(err)}).pipe(ctx.res);
             });
         }
         await createSsrStreamPromise(context);
     }

     
 }
