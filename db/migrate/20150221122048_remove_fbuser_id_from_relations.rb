class RemoveFbuserIdFromRelations < ActiveRecord::Migration
  def change
    remove_column :relations, :fbuser_id, :integer
    remove_column :relations, :friend_fbuser_id, :integer
  end
end
