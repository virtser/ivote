class AddCodeToParties < ActiveRecord::Migration
  def change
    add_column :parties, :code, :string
  end
end
