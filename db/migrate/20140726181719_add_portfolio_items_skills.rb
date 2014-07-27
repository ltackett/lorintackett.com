class AddPortfolioItemsSkills < ActiveRecord::Migration
  def change
    create_table :portfolio_items_skills, id: false do |t|
      t.belongs_to :portfolio_item
      t.belongs_to :skill
    end
  end
end
