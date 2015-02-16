class CreateVotes < ActiveRecord::Migration
  def change
    create_table :votes do |t|
      t.string :email
      t.integer :party_id

      t.timestamps
    end
  end
end
