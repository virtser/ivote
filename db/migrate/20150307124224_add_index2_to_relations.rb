class AddIndex2ToRelations < ActiveRecord::Migration
  def change
    add_index :relations, :friend_user_id
  end
end
