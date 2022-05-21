import { Hook, HookContext } from '@feathersjs/feathers';

export default () : Hook => {
  return async (context: HookContext) => {
    const { app, method, result, params } = context;

    const filterByActive = async (accounts: any) => {
      const accs = accounts.filter((el:any) => el.active)

      // Merge the message content to include the `user` object
      return accs;
    };

    if (method === 'find') {
      context.result.data = filterByActive(result.data);
    }
    
    // Best practice: hooks should always return the context
    return context;
  };
}
