class AddFbUserIdToUsers < ActiveRecord::Migration
  def change
    add_column :users, :fb_user_id, :bigint
  end
end
