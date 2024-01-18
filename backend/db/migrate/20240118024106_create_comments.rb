class CreateComments < ActiveRecord::Migration[7.1]
  def change
    create_table :comments do |t|
      t.references :user, type: :uuid, foreign_key: {to_table: :users, on_delete: :nullify}, index: true
      t.references :post, foreign_key: {to_table: :posts, on_delete: :cascade}, index: true
      t.string :content

      t.timestamps
    end
  end
end
