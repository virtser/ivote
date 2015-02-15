class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :email
      t.string :first_name
      t.string :last_name
      t.integer :phone
      t.datetime :date_of_birth

      t.timestamps
    end
  end
end
