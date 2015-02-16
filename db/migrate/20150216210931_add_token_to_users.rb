class AddTokenToUsers < ActiveRecord::Migration
  def change
    add_column :users, :token, :string
    add_column :users, :gender, :string
  end
end
