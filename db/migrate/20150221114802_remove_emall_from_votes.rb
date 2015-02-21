class RemoveEmallFromVotes < ActiveRecord::Migration
  def change
    remove_column :votes, :email, :string
  end
end
