class CreateReplies < ActiveRecord::Migration[7.1]
  def change
    create_table :replies do |t|
      t.references :user, type: :uuid, foreign_key: {to_table: :users, on_delete: :nullify}, index: true
      t.references :comment, foreign_key: {to_table: :comments, on_delete: :cascade}, index: true
      t.string :content

      t.timestamps
    end
  end
end
