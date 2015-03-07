class AddIndexToRelations < ActiveRecord::Migration
  def change
    add_index :relations, :user_id
  end
end
