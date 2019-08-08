const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
    modifyVars: {
      "@body-background": "#f3f3f3",
      "@primary-color": "#03b4c8",
      "@menu-collapsed-width": "50px",
      "@table-padding-vertical": "8px",
      "@table-padding-horizontal": "8px",
      "@font-family" : "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,SimSun,sans-serif",
      "@primary-1": "#e9f3f9",
      "@menu-inline-toplevel-item-height": "48px",
      "@menu-item-height": "38px",
      "@heading-color ": "fade(#000, 95%)",
      "@text-color": "fade(#000, 80%)",
    },
  }),
);