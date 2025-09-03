(()=>{var e={};e.id=888,e.ids=[888],e.modules={5937:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>u});var a=r(997);r(108);var s=r(4298),i=r.n(s),n=r(6689);let c=()=>{let e=function(){let[e,t]=(0,n.useState)(!1);return e}(),t=process.env.NEXT_PUBLIC_GA_ID,r=process.env.NEXT_PUBLIC_YANDEX_METRICA_ID;return e?(0,a.jsxs)(a.Fragment,{children:[t&&(0,a.jsxs)(a.Fragment,{children:[a.jsx(i(),{src:`https://www.googletagmanager.com/gtag/js?id=${t}`,strategy:"afterInteractive"}),a.jsx(i(),{id:"google-analytics",strategy:"afterInteractive",children:`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${t}', {
                page_title: document.title,
                page_location: window.location.href,
              });
            `})]}),r&&a.jsx(i(),{id:"yandex-metrica",strategy:"afterInteractive",children:`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
            
            ym(${r}, "init", {
              clickmap:true,
              trackLinks:true,
              accurateTrackBounce:true,
              webvisor:true
            });
          `})]}):null};function u({Component:e,pageProps:t}){return(0,a.jsxs)(a.Fragment,{children:[a.jsx(e,{...t}),a.jsx(c,{})]})}},108:()=>{},7093:(e,t,r)=>{"use strict";e.exports=r(2785)},2785:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/pages.runtime.prod.js")},6689:e=>{"use strict";e.exports=require("react")},6405:e=>{"use strict";e.exports=require("react-dom")},997:e=>{"use strict";e.exports=require("react/jsx-runtime")},167:(e,t)=>{"use strict";t._=t._interop_require_default=function(e){return e&&e.__esModule?e:{default:e}}}};var t=require("../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),a=t.X(0,[298],()=>r(5937));module.exports=a})();