import { Params } from '@feathersjs/feathers';
import { Service } from 'feathers-sequelize';
import { Sequelize, DataTypes } from 'sequelize';

interface CampaignData {
  id?: string;
  account_id: string;
  name: string;
  start_date: Date;
  end_date: Date;
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

const Campaign = sequelize.define('campaign', {
  id: {
    type: DataTypes.UUID,
    primaryKey: true
  },
  account_id: DataTypes.STRING,
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  created_at: DataTypes.DATE
}, {
  freezeTableName: true
});

export class CampaignService extends Service<CampaignData> {
  constructor() {
    super({
      Model: Campaign
    });
  }

  create (data: CampaignData, params?: Params) {
    const { account_id, name, start_date, end_date, created_at } = data;

    const campaignData = {
      account_id,
      name,
      start_date,
      end_date,
      created_at
    };

    // Call the original `create` method with existing `params` and new data
    return super.create(campaignData, params);
  }
  
  find(params?: Params) {
    return super.find(params);
  }
}
