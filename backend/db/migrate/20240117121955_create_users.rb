class CreateUsers < ActiveRecord::Migration[7.1]
  def change
    create_table :users, id: :uuid do |t|
      t.string :username
      t.string :email
      t.string :password_digest
      t.boolean :admin, default: false

      t.timestamps
    end
    add_index :users, :username, unique: true
    add_index :users, :email, unique: true
  end
end
