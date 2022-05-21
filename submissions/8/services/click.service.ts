import { Params } from '@feathersjs/feathers';
import { Service } from 'feathers-sequelize';
import { Sequelize, DataTypes } from 'sequelize';

interface ClickData {
  id?: string;
  campaign_id: string;
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
  
const Click = sequelize.define('click', {
    id: {
        type: DataTypes.UUID,
        primaryKey: true
    },
    campaign_id: DataTypes.STRING,
    created_at: DataTypes.DATE
    }, {
    freezeTableName: true
});

export class ClickService extends Service<ClickData> {
  constructor() {
    super({
        Model: Click
    });
  }

  create (data: ClickData, params?: Params) {
    const { campaign_id, created_at } = data;

    const accountData = {
      campaign_id,
      created_at
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(accountData, params);
  }

  find(params?: Params) {
    return super.find(params);
  }
}
