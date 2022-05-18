module.exports = {
  env: {
    NODE_ENV: '"development"',
  },
  defineConstants: {},
  mini: {},
  /*# if:react #*/
  h5: {
    webpackChain(chain) {
      chain.plugin('fastRefreshPlugin').tap(() => [{overlay: false}]);
    },
  },
  /*# else #*/
  h5: {},
  /*# end #*/
};
