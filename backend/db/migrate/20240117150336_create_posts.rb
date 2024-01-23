class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.references :user, type: :uuid, foreign_key: {to_table: :users, on_delete: :nullify}, index: true
      t.string :title
      t.text :content
      t.string :tags, array: true, default: []

      t.timestamps
    end
    add_index :posts, :tags, using: 'gin'
  end
end
