import { createRouter, defineRoute, param } from 'type-route';

const hashParamRoute = (path: string) =>
  defineRoute(
    {
      hash: param.path.string,
    },
    (p) => `/${path}/${p.hash}`
  );

export const { RouteProvider, useRoute, session, routes } = createRouter({
  signup: hashParamRoute('signup'),
  reset: hashParamRoute('reset'),
  main: defineRoute('/'),
});
