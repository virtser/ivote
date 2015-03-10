class AddIndex2ToVotes < ActiveRecord::Migration
  def change
    add_index :votes, :party_id
  end
end
