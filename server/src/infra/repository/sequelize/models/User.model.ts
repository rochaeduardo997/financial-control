import { HasMany, DataType, Table, Model, PrimaryKey, Column, Unique, Default } from "sequelize-typescript";
import CategoryModel from './Category.model';
import TransactionModel from './Transaction.model';

@Table({ tableName: "users", timestamps: true })
class UserModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Unique
  @Column({ allowNull: false })
  declare username: string;

  @Unique
  @Column({ allowNull: false })
  declare email: string;

  @Column({ allowNull: false })
  declare password: string;

  @Column({ allowNull: false, defaultValue: true })
  declare status: boolean;

  @Column({ defaultValue: 'user', type: DataType.ENUM('admin', 'user') })
  declare role: boolean;

  @HasMany(() => CategoryModel, 'fk_user_id')
  declare category: CategoryModel[];

  @HasMany(() => CategoryModel, 'fk_user_id')
  declare transactions: TransactionModel[];
}

export default UserModel;
