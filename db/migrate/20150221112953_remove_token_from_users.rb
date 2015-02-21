class RemoveTokenFromUsers < ActiveRecord::Migration
  def change
    remove_column :users, :token, :string
    remove_column :users, :phone, :integer
    remove_column :users, :date_of_birth, :datetime
    remove_column :users, :gender, :string
  end
end
