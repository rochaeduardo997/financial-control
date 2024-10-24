import { ForeignKey, BelongsTo, DataType, Table, Model, PrimaryKey, Column, Unique, Default } from "sequelize-typescript";
import UserModel from './User.model';

@Table({ tableName: "categories", timestamps: true })
class CategoryModel extends Model {
  @PrimaryKey
  @Column
  declare id: string;

  @Column({ allowNull: false })
  declare name: string;

  @Column({ allowNull: false })
  declare description: string;

  @ForeignKey(() => UserModel)
  @Column({
    allowNull: false,
    onDelete:  'CASCADE',
    onUpdate:  'CASCADE'
  })
  declare fk_user_id: string;
}

export default CategoryModel;

