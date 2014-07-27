class AddFieldsToPortfolioItem < ActiveRecord::Migration
  def change
    add_column :portfolio_items, :description, :text
  end
end
