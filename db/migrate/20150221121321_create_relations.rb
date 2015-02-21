class CreateRelations < ActiveRecord::Migration
  def change
    create_table :relations do |t|
      t.integer :fbuser_id,  limit: 8
      t.integer :friend_fbuser_id,  limit: 8

      t.timestamps
    end
  end
end
