class AddVisualFieldsToPortfolioItem < ActiveRecord::Migration
  def change
    add_column :portfolio_items, :background_color, :string
    add_column :portfolio_items, :foreground_color, :string
    add_column :portfolio_items, :background_image, :string
  end
end
