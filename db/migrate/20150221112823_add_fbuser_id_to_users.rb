class AddFbuserIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :fbuser_id, :bigint
  end
end
