class CreateRelations < ActiveRecord::Migration
  def change
    create_table :relations do |t|
      t.integer :fbuser_id
      t.integer :friend_fbuser_id

      t.timestamps
    end
  end
end
