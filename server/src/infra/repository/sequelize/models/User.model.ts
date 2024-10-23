import { DataType, Table, Model, PrimaryKey, Column, Unique, Default } from "sequelize-typescript";

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
}

export default UserModel;
