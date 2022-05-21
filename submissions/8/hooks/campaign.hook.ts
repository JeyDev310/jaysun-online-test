import { Hook, HookContext } from '@feathersjs/feathers';

export default () : Hook => {
  return async (context: HookContext) => {
    const { app, method, result, params } = context;

    if (method === 'get' && params.id === 10) {
      throw new Error('Forbidden');
    }
    
    // Best practice: hooks should always return the context
    return context;
  };
}
