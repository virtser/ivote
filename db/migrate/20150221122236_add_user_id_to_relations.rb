class AddUserIdToRelations < ActiveRecord::Migration
  def change
    add_column :relations, :user_id, :bigint
    add_column :relations, :friend_user_id, :bigint
  end
end
