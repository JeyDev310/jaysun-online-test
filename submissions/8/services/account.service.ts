import { Paginated, Params } from '@feathersjs/feathers';
import { Service } from 'feathers-sequelize';
import { Sequelize, DataTypes } from 'sequelize';

interface AccountData {
  id?: string;
  active: boolean;
  name: string;
  created_at: Date;
}

const sequelize = new Sequelize('postgres', 'root', 'root', {
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'postgres',
  username: 'root',
  password: 'root',
  logging: false
});

const Account = sequelize.define('account', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  active: DataTypes.BOOLEAN,
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  created_at: DataTypes.DATE
}, {
  freezeTableName: true
});

export class AccountService extends Service<AccountData> {
  constructor() {
    super({
      Model: Account
    });
  }

  create (data: AccountData, params?: Params) {
    const { active, name, created_at } = data;

    const accountData = {
      active,
      name,
      created_at
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(accountData, params);
  }

  find(params?: Params) {
    return super.find(params);
  }
}
