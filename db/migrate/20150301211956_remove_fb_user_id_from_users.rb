class RemoveFbUserIdFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :fb_user_id, :bigint
  end
end
