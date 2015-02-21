class RemoveFbuserIdFromUsers < ActiveRecord::Migration
  def change
  	    remove_column :users, :fbuser_id
  end
end
